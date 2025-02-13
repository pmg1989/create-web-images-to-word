import fs from "fs";
import path from "path";
import {
  ImageRun,
  AlignmentType,
  Document,
  Footer,
  Packer,
  PageNumber,
  NumberFormat,
  Paragraph,
  TextRun,
  ISectionOptions,
} from "docx";

const CUR_DIR: string =
  "./images/楷书/软笔/其他/梁同书/清代梁同书楷书作品《六一泉三堂祠记》";

const IMAGE_DIR: string = "images";

const FILE_NAME: string = CUR_DIR.split("/").at(-1) || "";

const IMAGE_WIDTH = 0;

const IMAGE_HEIGHT = 0;

const IMAGE_DOCS_Path: string = path.join(CUR_DIR);

const CUR_IMAGE_DIR: string = path.join(CUR_DIR, IMAGE_DIR);

async function main(): Promise<void> {
  const nameList: string[] = fs.readdirSync(CUR_IMAGE_DIR);
  // .sort((a: string, b: string) => {
  //   return (
  //     fs.statSync(`${CUR_IMAGE_DIR}/${a}`).ctime.getTime() -
  //     fs.statSync(`${CUR_IMAGE_DIR}/${b}`).ctime.getTime()
  //   );
  // });

  console.log(nameList, "[nameList]");

  await createDocs(FILE_NAME, nameList);
}

async function createDocs(fileName: string, nameList: string[]): Promise<void> {
  console.log(fileName, "[文件生成中...]");

  const docsFullName: string = `${IMAGE_DOCS_Path}/${fileName}.docx`;

  if (fs.existsSync(docsFullName)) {
    fs.rmSync(docsFullName);
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: "3.5mm",
              right: "3.5mm",
              bottom: "3.5mm",
              left: "3.5mm",
            },
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
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun(`${FILE_NAME}  `),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                  }),
                  new TextRun({
                    children: [" / ", PageNumber.CURRENT],
                  }),
                ],
              }),
            ],
          }),
        },
        children: [
          new Paragraph({
            alignment: AlignmentType.CENTER,
            children: nameList.map((name: string) => {
              const names: string[] = name.replace(".jpg", "").split("x");
              const [_index, widthO, heightO] = names;

              const max_width: number = 600 + 172;
              const max_height: number = 930 + 172;

              const width: number =
                (Number(widthO) * max_height) / Number(heightO);
              const height: number =
                (Number(heightO) * max_width) / Number(widthO);

              if (width > max_width) {
                return new ImageRun({
                  data: fs.readFileSync(`${CUR_IMAGE_DIR}/${name}`),
                  transformation: {
                    width: IMAGE_WIDTH || max_width,
                    height: IMAGE_HEIGHT || height,
                  },
                  type: "jpg",
                });
              }

              return new ImageRun({
                data: fs.readFileSync(`${CUR_IMAGE_DIR}/${name}`),
                transformation: {
                  width: IMAGE_WIDTH || width,
                  height: IMAGE_HEIGHT || max_height,
                },
                type: "jpg",
              });
            }),
          }),
        ],
      } as ISectionOptions,
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
