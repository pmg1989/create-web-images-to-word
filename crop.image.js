const fs = require("fs");
const path = require("path");
const sharp = require("sharp");
const getPixels = require("get-pixels");
const { padStart } = require("./utils");

const IMAGE_DIRS = "./images/楷书/软笔/颜体/《多宝塔碑》单字米字格版共495字";

const ORIGIN_DIRS = "images";

const CROP_DIRS = "crop";

const ROOT_IMAGE_DIRS = path.join(IMAGE_DIRS, ORIGIN_DIRS);

// 抽离配置常量
const CONFIG = {
  scanStep: 10,
  modifyOffset: 60, // 6 * scanStep
  rgbDiffThreshold: 30,
};

async function main() {
  const nameList = fs.readdirSync(`${ROOT_IMAGE_DIRS}`).sort(function (a, b) {
    return (
      fs.statSync(`${ROOT_IMAGE_DIRS}/${a}`).mtime.getTime() -
      fs.statSync(`${ROOT_IMAGE_DIRS}/${b}`).mtime.getTime()
    );
  });

  await cropImage(nameList).catch(console.error);
}

async function cropImage(nameList) {
  // for (const imgName of nameList) {
  for (const [index, imgName] of nameList.entries()) {
    const imagePath = `${ROOT_IMAGE_DIRS}/${imgName}`;
    const pixels = await getPixelsSync(imagePath);

    // 计算关键点位置
    const dimensions = {
      centerX: pixels.shape[0] / 2,
      centerY: pixels.shape[1] / 2,
      maxSharpX: pixels.shape[0] / 3,
      maxSharpY: pixels.shape[1] / 3,
    };

    // 扫描边界
    const boundaryX = await scanBoundary(
      pixels,
      dimensions.centerX,
      dimensions.centerY,
      dimensions.maxSharpX,
      true
    );

    const boundaryY = await scanBoundary(
      pixels,
      dimensions.centerX,
      dimensions.centerY,
      dimensions.maxSharpY,
      false
    );

    // 处理图片裁剪
    const cropDimensions = calculateCropDimensions(
      boundaryX.x,
      boundaryY.y,
      pixels.shape[0],
      pixels.shape[1],
      CONFIG.modifyOffset
    );

    const newName = `${padStart(index)}_${cropDimensions.width}x${
      cropDimensions.height
    }.jpg`;

    console.log(newName, cropDimensions, pixels.shape[0], pixels.shape[1]);

    await processImageCrop(imagePath, cropDimensions, newName);
  }
}

// 抽离扫描边界的方法
async function scanBoundary(pixels, centerX, centerY, maxSharp, isHorizontal) {
  let prev = {};

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
function calculateCropDimensions(x, y, width, height, offset) {
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
async function processImageCrop(imagePath, dimensions, imgName) {
  const sharpRes = await sharp(imagePath);
  await sharpRes.extract(dimensions);

  const cropPath = path.join(IMAGE_DIRS, CROP_DIRS);

  if (!fs.existsSync(cropPath)) {
    fs.mkdirSync(cropPath, { recursive: true });
  }

  await sharpRes.toFile(`${cropPath}/${imgName}`);
}

async function getPixelsSync(imagePath) {
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

function isRGBDifferent(rgb1, rgb2, rgbDiffThreshold = 30) {
  const rgbDiff = Math.sqrt(
    Math.pow(rgb1.r - rgb2.r, 2) +
      Math.pow(rgb1.g - rgb2.g, 2) +
      Math.pow(rgb1.b - rgb2.b, 2)
  );

  return rgbDiff > rgbDiffThreshold;
}

main().catch(console.error);
