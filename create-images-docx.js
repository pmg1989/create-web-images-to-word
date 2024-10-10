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
  篆书: {
    NAME: "篆书",
    CHILD: {
      吴昌硕: "吴昌硕",
    },
  },
  隶书: {
    NAME: "隶书",
    CHILD: {
      曹全碑: "曹全碑",
    },
  },
  楷书: {
    NAME: "楷书",
    CHILD: {
      软笔颜体: "软笔颜体",
      "硬笔-胡啸卿": "硬笔-胡啸卿",
    },
  },
  行书: {
    NAME: "行书",
    CHILD: {
      三字经: "三字经",
    },
  },
};

const IMAGE_DIRS = `/${DIR_DIC.篆书.NAME}/${DIR_DIC.篆书.CHILD.吴昌硕}`;

const FOOT_NAME = "硬笔楷书结构精讲50字-胡啸卿";

const IMAGE_WIDTH = 600 / 1;

const IMAGE_HEIGHT = parseInt((IMAGE_WIDTH * 828) / 640);

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
