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

const CUR_DIR = "./images/行书/胡问遂/《1185字行书字帖》- 胡问遂";

const IMAGE_DIR = "images";

const FILE_NAME = CUR_DIR.split("/").at(-1);

const IMAGE_WIDTH = 0; // 600 / 1;

const IMAGE_HEIGHT = 0; // parseInt((IMAGE_WIDTH * 1400) / 1000);

const IMAGE_DOCS_Path = path.join(CUR_DIR);

const CUR_IMAGE_DIR = path.join(CUR_DIR, IMAGE_DIR);

async function main() {
  const nameList = fs.readdirSync(CUR_IMAGE_DIR).sort(function (a, b) {
    return (
      fs.statSync(`${CUR_IMAGE_DIR}/${a}`).mtime.getTime() -
      fs.statSync(`${CUR_IMAGE_DIR}/${b}`).mtime.getTime()
    );
  });

  console.log(nameList, "[nameList]");

  await createDocs(FILE_NAME, nameList);
}

async function createDocs(fileName, nameList) {
  console.log(fileName, "[文件生成中...]");

  const docsFullName = `${IMAGE_DOCS_Path}/${fileName}.docx`;

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
                  new TextRun(`${FILE_NAME}  `),
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
            children: nameList.map((name) => {
              const names = name.replace(".jpg", "").split("x");

              const [_index, widthO, heightO] = names;

              const max_width = 600;
              const max_height = 930;

              const width = (Number(widthO) * max_height) / Number(heightO);
              const height = (Number(heightO) * max_width) / Number(widthO);

              if (width > max_width) {
                return new ImageRun({
                  data: fs.readFileSync(`${CUR_IMAGE_DIR}/${name}`),
                  transformation: {
                    width: IMAGE_WIDTH || max_width,
                    height: IMAGE_HEIGHT || height,
                  },
                });
              }

              return new ImageRun({
                data: fs.readFileSync(`${CUR_IMAGE_DIR}/${name}`),
                transformation: {
                  width: IMAGE_WIDTH || width,
                  height: IMAGE_HEIGHT || max_height,
                },
              });
            }),
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

  console.log(fileName, "[文件生成成功]");
}

main().catch(console.error);
