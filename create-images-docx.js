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

const DIR_DIC = {
  篆书: "篆书",
  隶书: "隶书",
  楷书: "楷书",
};

const PATH_DIC = {
  吴昌硕: "吴昌硕",
  曹全碑: "曹全碑",
  软笔颜体: "软笔颜体",
  行书三字经: "行书三字经",
};

// const IMAGE_DIRS = "/隶书/曹全碑";
// const IMAGE_DIRS = "/楷书/软笔颜体";
const IMAGE_DIRS = `/${DIR_DIC.楷书}/${PATH_DIC.行书三字经}`;

const FOOT_NAME = "三字经简繁体毛笔字帖";

const IMAGE_WIDTH = 600 / 1;

const IMAGE_HEIGHT = parseInt((IMAGE_WIDTH * 670) / 425);

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
