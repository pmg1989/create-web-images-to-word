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

const IMAGE_DIRS = "隶书/曹全碑/汉隶《曹全碑》集字春联五言对联10副";

const FOOT_NAME = "汉隶《曹全碑》集字春联五言对联10副";

const IMAGE_WIDTH = 600 / 2;

const IMAGE_HEIGHT = parseInt((IMAGE_WIDTH * 3020) / 1280);

const IMAGE_DOCS_Path = path.join(
  ROOT_DIR,
  "docs",
  IMAGE_DIRS
  // `${IMAGE_WIDTH}x${IMAGE_HEIGHT}`
);

const ROOT_IMAGE_DIRS = path.join(ROOT_DIR, IMAGE_DIRS);

async function main() {
  const dirName = FOOT_NAME;

  const nameList = fs.readdirSync(ROOT_IMAGE_DIRS).sort(function (a, b) {
    return (
      fs.statSync(`${ROOT_IMAGE_DIRS}/${a}`).mtime.getTime() -
      fs.statSync(`${ROOT_IMAGE_DIRS}/${b}`).mtime.getTime()
    );
  });

  console.log(nameList, "[nameList]");

  await createDocs(dirName, nameList);
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
                  new TextRun(`${FOOT_NAME}  `),
                  new TextRun({
                    children: [PageNumber.CURRENT],
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
            alignment: AlignmentType.CENTER,
            children: nameList.map(
              (name) =>
                new ImageRun({
                  data: fs.readFileSync(`${ROOT_IMAGE_DIRS}/${name}`),
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
