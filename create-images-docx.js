const fs = require("fs");
const path = require("path");
const {
  ImageRun,
  AlignmentType,
  Document,
  Footer,
  Packer,
  PageNumber,
  NumberFormat,
  Paragraph,
  TextRun,
} = require("docx");

const ROOT_DIR = "./images";

// const IMAGE_DIRS = "隶书/曹全碑";
const IMAGE_DIRS = "/楷书/软笔颜体";

const FOOT_NAME = "《颜勤礼碑》集字 - 沁园春雪";

const IMAGE_WIDTH = 600 / 3;

const IMAGE_HEIGHT = parseInt((IMAGE_WIDTH * 2593) / 676);

const IMAGE_DOCS_Path = path.join(
  ROOT_DIR,
  "docs",
  IMAGE_DIRS,
  `${IMAGE_WIDTH}x${IMAGE_HEIGHT}`
);

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

    console.log(nameList, "[nameList]");

    await createDocs(dirName, nameList);
  }
}

async function createDocs(dirName, nameList) {
  console.log(dirName, "[文件生成中...]");

  const docsFullName = `${IMAGE_DOCS_Path}/${dirName}.docx`;

  if (fs.existsSync(docsFullName)) {
    fs.rmSync(docsFullName);
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            pageNumbers: {
              start: 1,
              formatType: NumberFormat.DECIMAL,
            },
          },
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun(`${FOOT_NAME} - `),
                  new TextRun({
                    children: ["页码: ", PageNumber.CURRENT],
                  }),
                  new TextRun({
                    children: [" / ", PageNumber.TOTAL_PAGES],
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            children: nameList.map(
              (name) =>
                new ImageRun({
                  data: fs.readFileSync(
                    `${ROOT_IMAGE_DIRS}/${dirName}/${name}`
                  ),
                  transformation: {
                    width: IMAGE_WIDTH,
                    height: IMAGE_HEIGHT,
                  },
                })
            ),
          }),
        ],
      },
    ],
  });

  if (!fs.existsSync(IMAGE_DOCS_Path)) {
    fs.mkdirSync(IMAGE_DOCS_Path, { recursive: true });
  }

  const buffer = await Packer.toBuffer(doc);

  fs.writeFileSync(docsFullName, buffer);

  console.log(dirName, "[文件生成成功]");
}

main().catch(console.error);
