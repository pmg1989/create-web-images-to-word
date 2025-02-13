import https from "https";
import fs from "fs";
import path from "path";
// download image
export const downloadImage = async (url: string): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    https
      .get(url, (res) => {
        const chunks: Buffer[] = [];
        res.on("data", (chunk: Buffer) => chunks.push(chunk));
        res.on("end", () => resolve(Buffer.concat(chunks)));
        res.on("error", (err) => reject(err));
      })
      .on("error", (err) => reject(err));
  });
};

export const saveImage = async (
  imageDir: string,
  imageName: string,
  data: Buffer
): Promise<void> => {
  await fs.promises.mkdir(imageDir, { recursive: true });

  const imagePath = path.join(imageDir, imageName);

  fs.writeFileSync(imagePath, data);
  console.log(`Saved image: ${imagePath}`);
};

// 下载并保存图片
export const downloadAndSaveImage = (
  url: string,
  destDir: string,
  destName: string
) =>
  new Promise((resolve, reject) => {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const destination = path.join(destDir, destName);

    const file = fs.createWriteStream(destination);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close(() => resolve(true));
        });
      })
      .on("error", (error) => {
        fs.unlink(destination, () => {});

        reject(error.message);
      });
  });

export const delay = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export const padStart = (str: string, length = 3): string => {
  return `${str}`.padStart(length, "0");
};

export const getFileExtension = (url: string): string => {
  return path.extname(url);
};

/**
 * rgb转hex
 * @param {number} r 红色色值，如：64
 * @param {number} g 绿色色值，如：158
 * @param {number} b 蓝色色值，如：255
 * @returns {string} 最终rgb转hex的值，如：#409EFF
 */
export const rgb2Hex = (r: number, g: number, b: number): string => {
  // 将每个颜色值转换为两位的十六进制字符串
  let hex =
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  return hex;
};
