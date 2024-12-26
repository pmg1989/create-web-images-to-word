const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT_DIR = "./images";

const IMAGE_DIRS = "楷书/软笔颜体/颜真卿行书标准字帖";

const ROOT_IMAGE_DIRS = path.join(ROOT_DIR, IMAGE_DIRS);

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

    await sharpRes.extract({ left: 40, top: 50, width: 1000, height: 1400 });

    console.log(`${ROOT_IMAGE_DIRS}/${imgName}`, ["toFile"]);

    await sharpRes.toFile(`${ROOT_DIR}/crop/${imgName}`);
  }
}

main().catch(console.error);
