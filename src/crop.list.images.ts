import fs from "fs";
import path from "path";
import sharp from "sharp";
import getPixels from "get-pixels";
import { padStart } from "@/utils/tools";
import { BoundaryResult, CropDimensions, RGB } from "@/interface/types";

const DIRS_CONFIG = {
  root: "./images/楷书/软笔/颜体/《颜勤礼碑》高清放大版",
  origin: "images",
  crop: "crop",
};

const ROOT_IMAGE_DIRS = path.join(DIRS_CONFIG.root, DIRS_CONFIG.origin);

// 抽离配置常量
const CONFIG = {
  // crop: 保持原裁剪逻辑；copy: 只读取原图下标/尺寸并复制原文件到 crop 目录
  outputMode: "crop" as "crop" | "copy",
  // 扫描步长和RGB差异阈值可以根据实际情况调整
  scanStep: 10,
  // modifyOffset应该根据实际图片的边界情况进行调整，过大可能会裁剪掉部分内容，过小可能无法完全去除边界
  modifyOffset: 60,
  // rgbDiffThreshold可以根据图片的颜色差异情况进行调整，过大可能会误判边界，过小可能无法正确识别边界
  rgbDiffThreshold: 30,
};

async function main() {
  const nameList = fs
    .readdirSync(`${ROOT_IMAGE_DIRS}`)
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));
  // .sort(function (a, b) {
  // return (
  //   fs.statSync(path.join(ROOT_IMAGE_DIRS, a)).mtime.getTime() -
  //   fs.statSync(path.join(ROOT_IMAGE_DIRS, b)).mtime.getTime()
  // );
  // });

  await cropImage(nameList).catch(console.error);
}

async function cropImage(nameList: string[]): Promise<void> {
  for (const [index, imgName] of nameList.entries()) {
    const imagePath = path.join(ROOT_IMAGE_DIRS, imgName);
    const pixels = await getPixelsSync(imagePath);
    const originWidth = pixels.shape[0];
    const originHeight = pixels.shape[1];

    if (CONFIG.outputMode === "copy") {
      const newName = getOutputImageName(
        index,
        originWidth,
        originHeight,
        path.extname(imgName) || ".jpg",
      );

      console.log(newName, { index, width: originWidth, height: originHeight });

      await processImageCopy(imagePath, newName);
      continue;
    }

    // 计算关键点位置
    const dimensions = {
      centerX: originWidth / 2,
      centerY: originHeight / 2,
      maxSharpX: originWidth / 3,
      maxSharpY: originHeight / 3,
    };

    // 扫描边界
    const boundaryX = await scanBoundary(
      pixels,
      dimensions.centerX,
      dimensions.centerY,
      dimensions.maxSharpX,
      true,
    );

    const boundaryY = await scanBoundary(
      pixels,
      dimensions.centerX,
      dimensions.centerY,
      dimensions.maxSharpY,
      false,
    );

    // 处理图片裁剪
    const cropDimensions = calculateCropDimensions(
      boundaryX.x ?? 0,
      boundaryY.y ?? 0,
      originWidth,
      originHeight,
      CONFIG.modifyOffset,
    );

    const newName = getOutputImageName(
      index,
      cropDimensions.width,
      cropDimensions.height,
    );

    console.log(index, newName, cropDimensions, originWidth, originHeight);

    await processImageCrop(imagePath, cropDimensions, newName);
  }
}

function getOutputImageName(
  index: number,
  width: number,
  height: number,
  extension: string = ".jpg",
): string {
  return `${padStart(index.toString(), 3)}x${width}x${height}${extension}`;
}

// 抽离扫描边界的方法
async function scanBoundary(
  pixels: any,
  centerX: number,
  centerY: number,
  maxSharp: number,
  isHorizontal: boolean,
): Promise<BoundaryResult> {
  let prev: BoundaryResult = { rgb: { r: 0, g: 0, b: 0 } };

  const stepStart = 0;

  for (let i = stepStart; i < maxSharp; i += CONFIG.scanStep) {
    const rgb = {
      r: pixels.get(isHorizontal ? i : centerX, isHorizontal ? centerY : i, 0),
      g: pixels.get(isHorizontal ? i : centerX, isHorizontal ? centerY : i, 1),
      b: pixels.get(isHorizontal ? i : centerX, isHorizontal ? centerY : i, 2),
    };

    if (
      i > stepStart &&
      isRGBDifferent(rgb, prev.rgb, CONFIG.rgbDiffThreshold)
    ) {
      return prev;
    }

    prev = { [isHorizontal ? "x" : "y"]: i, rgb };
  }

  return prev;
}

// 抽离裁剪尺寸计算逻辑
function calculateCropDimensions(
  x: number,
  y: number,
  width: number,
  height: number,
  offset: number,
): CropDimensions {
  const _left = x - offset;
  const _top = y - offset;
  const left = _left > 0 ? _left : x;
  const top = _top > 0 ? _top : y;

  return {
    left,
    top,
    width: width - 2 * left,
    height: height - 2 * top,
  };
}

// 抽离图片处理逻辑
async function processImageCrop(
  imagePath: string,
  dimensions: CropDimensions,
  imgName: string,
): Promise<void> {
  const sharpRes = await sharp(imagePath);
  await sharpRes.extract(dimensions);

  const cropPath = ensureCropPath();

  await sharpRes.toFile(`${cropPath}/${imgName}`);
}

async function processImageCopy(
  imagePath: string,
  imgName: string,
): Promise<void> {
  const cropPath = ensureCropPath();
  await fs.promises.copyFile(imagePath, path.join(cropPath, imgName));
}

function ensureCropPath(): string {
  const cropPath = path.join(DIRS_CONFIG.root, DIRS_CONFIG.crop);

  if (!fs.existsSync(cropPath)) {
    fs.mkdirSync(cropPath, { recursive: true });
  }

  return cropPath;
}

async function getPixelsSync(imagePath: string): Promise<any> {
  return new Promise((resolve, reject) => {
    return getPixels(imagePath, function (err, pixels) {
      if (err) {
        console.error(imagePath, "[imagePath]");
        reject(err);
      }

      resolve(pixels);
    });
  });
}

function isRGBDifferent(
  rgb1: RGB,
  rgb2: RGB,
  rgbDiffThreshold: number = 30,
): boolean {
  const rgbDiff = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2),
  );

  return rgbDiff > rgbDiffThreshold;
}

main().catch(console.error);
