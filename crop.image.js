const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const ROOT_DIR = "./images";

const IMAGE_DIRS = "隶书/曹全碑";

const ROOT_IMAGE_DIRS = path.join(ROOT_DIR, IMAGE_DIRS);

const rootImageDirs = fs.readdirSync(ROOT_IMAGE_DIRS);

async function main() {
  for (let dirIndex in rootImageDirs) {
    const dirName = rootImageDirs[dirIndex];

    const nameList = fs
      .readdirSync(`${ROOT_IMAGE_DIRS}/${dirName}`)
      .sort(function (a, b) {
        return (
          fs.statSync(`${ROOT_IMAGE_DIRS}/${dirName}/${a}`).mtime.getTime() -
          fs.statSync(`${ROOT_IMAGE_DIRS}/${dirName}/${b}`).mtime.getTime()
        );
      });

    await cropImage(dirName, nameList).catch(console.error);
  }
}

async function cropImage(dirName, nameList) {
  for (const imgName of nameList) {
    const imagePath = `${ROOT_IMAGE_DIRS}/${dirName}/${imgName}`;

    // if (imgName !== "1.jpg") return;

    const sharpRes = await sharp(imagePath);

    await sharpRes.extract({ left: 50, top: 80, width: 980, height: 1360 });

    console.log(`${ROOT_IMAGE_DIRS}/${dirName}//${imgName}`, ["toFile"]);

    await sharpRes.toFile(`${ROOT_DIR}/crop/${imgName}`);
  }
}

main().catch(console.error);
