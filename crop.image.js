const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const IMAGE_DIRS = "./images/行书/其他/《岳阳楼记》行书入门教程";

const ORIGIN_DIRS = "images";

const CROP_DIRS = "crop";

const ROOT_IMAGE_DIRS = path.join(IMAGE_DIRS, ORIGIN_DIRS);

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
  for (const imgName of nameList) {
    const imagePath = `${ROOT_IMAGE_DIRS}/${imgName}`;

    // if (imgName !== "1.jpg") return;

    const sharpRes = await sharp(imagePath);

    const names = imgName.replace(".jpg", "").split("x");

    const [_index, widthO, heightO] = names;

    // await sharpRes
    //   .resize(Math.floor(Number(widthO) / 2), Math.floor(Number(heightO) / 2))
    //   .jpeg({ quality: 80 });

    await sharpRes.extract({
      left: 70,
      top: 50,
      width: Number(widthO) - 140,
      height: Number(heightO) - 100,
    });

    const cropPath = path.join(IMAGE_DIRS, CROP_DIRS);

    console.log(`${cropPath}/${imgName}`, ["toFile"]);

    if (!fs.existsSync(cropPath)) {
      fs.mkdirSync(cropPath, { recursive: true });
    }

    await sharpRes.toFile(`${cropPath}/${imgName}`);
  }
}

main().catch(console.error);
