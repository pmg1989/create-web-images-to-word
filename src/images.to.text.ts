import { createWorker } from "tesseract.js";
import fs from "fs";
import path from "path";

const ROOT_DIR = path.resolve(
  __dirname,
  "../images/楷书/软笔/颜体/《多宝塔碑》单字米字格版共495字"
);

const IMAGE_DIR = path.join(ROOT_DIR, "images");

const TEXT_DIR = path.join(ROOT_DIR, "text");

console.log(`Recognizing ${IMAGE_DIR}`);

async function main() {
  // 创建worker并指定中文语言包
  const worker = await createWorker("chi_tra+chi_sim", 1, {
    // logger: (m) => {
    //   if (m.status === "recognizing text") {
    //     console.log(`识别进度: ${(m.progress * 100).toFixed(2)}%`);
    //   }
    // },
  });

  // 设置识别参数 - 单个中文字识别模式
  await worker.setParameters({
    // 单个字符模式 - PSM_SINGLE_CHAR
    tessedit_pageseg_mode: "10" as any,
    // 保留空格
    preserve_interword_spaces: "1",
    // 禁用词典和语言模型，专注于单字识别
    load_system_dawg: "0",
    load_freq_dawg: "0",
    // 优化毛笔字识别的图像处理参数
    textord_heavy_nr: "1", // 处理粗笔画
    textord_force_make_prop_words: "F",
    edges_max_children_per_outline: "50", // 100 增加轮廓检测的灵敏度
    edges_min_nonhole: "1.5", // 调整空心笔画检测
    edges_childarea: "0.7", // 增加子区域检测范围
    edges_boxarea: "0.9",
    textord_min_linesize: "2.5", // 3.0 增加最小线条尺寸
    textord_noise_sizelimit: "0.2", // 0.2 降低噪点阈值
    // 图像质量优化
    user_defined_dpi: "2400", // 提高DPI以获取更多细节
    thresholding_method: "1", // 使用Otsu自适应阈值
    // 字符识别优化
    tessedit_char_blacklist:
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVYZ/=-",
    // tessedit_enable_dict_correction: "0", // 禁用字典校正
    segment_penalty_dict_nonword: "0.1", // 降低非词典词的惩罚
    language_model_penalty_non_dict_word: "0.5", // 降低非词典字的惩罚
    language_model_penalty_non_freq_dict_word: "0.8", // 降低非常用字的惩罚

    // 单个字符模式 - PSM_SINGLE_CHAR
    // tessedit_pageseg_mode: "10" as any,
    // // 保留空格
    // preserve_interword_spaces: "1",
    // // 提高DPI以获取更好的清晰度
    // user_defined_dpi: "2400",
    // // 设置为繁体中文优先，降低惩罚值以提高识别灵活性
    // language_model_penalty_non_freq_dict_word: "0.5",
    // language_model_penalty_non_dict_word: "0.8",
    // // 优化图像处理
    // textord_heavy_nr: "1",
    // textord_force_make_prop_words: "F",
    // edges_max_children_per_outline: "50",
    // // 添加以下参数来优化毛笔字识别
    // tessedit_char_blacklist:
    //   "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/=-",
    // textord_min_linesize: "2.5",
    // textord_noise_sizelimit: "0.2",
    // edges_childarea: "0.65",
    // edges_boxarea: "0.9",
  });

  const nameList = fs.readdirSync(`${IMAGE_DIR}`).sort(function (a, b) {
    return (
      fs.statSync(path.join(IMAGE_DIR, a)).mtime.getTime() -
      fs.statSync(path.join(IMAGE_DIR, b)).mtime.getTime()
    );
  });
  // .filter((_, i) => i < 10);

  for (const [index, imgName] of nameList.entries()) {
    const imagePath = path.join(IMAGE_DIR, imgName);

    // 识别图片
    const { data } = await worker.recognize(imagePath);
    await saveTextImage(imgName, `${index}_${data.text}`, imagePath);
  }

  // 释放资源
  await worker.terminate();
}

export const saveTextImage = async (
  imgName: string,
  text: string,
  imagePath: string
) => {
  // 创建TEXT_DIR目录（如果不存在）
  await fs.promises.mkdir(TEXT_DIR, { recursive: true });

  // 获取文件扩展名
  const ext = path.extname(imgName);
  // 清理识别文本中的空白字符，用作新文件名
  const newFileName = text.trim() + ext;
  // 构建新的文件路径
  const newPath = path.join(TEXT_DIR, newFileName);

  // 复制文件到新位置并重命名
  await fs.promises.copyFile(imagePath, newPath);
  console.log(`文件已保存至: ${newPath}`);
};

main().catch(console.error);
