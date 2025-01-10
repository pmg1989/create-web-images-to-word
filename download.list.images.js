"use strict";

const puppeteer = require("puppeteer");

const { main: itemsMain } = require("./download.items.image");

const { delay, download, padStart, autoScroll } = require("./utils");

// 隶书 曹全碑
// const PATH_LIST = ["曹全碑"];
// const IMAGES_DIR_PATH = `./images/隶书/${PATH_LIST[0]}`;

// 楷书
const PATH_LIST = ["软笔", "颜体"];
const IMAGES_DIR_PATH = `./images/楷书/${PATH_LIST.join("/")}`;

const dataList = [
  {
    title: "翰墨文馨",
    nestedItem: false,
    url: "https://www.toutiao.com/c/user/token/MS4wLjABAAAAPQ8Ts43HdMN3MF6te8D3FwkofkHJwEggrf5m4AttvVo/?source=m_redirect&tab=wtt",
  },
];

// 行书
// const PATH_LIST = [];
// const IMAGES_DIR_PATH = `./images/行书/${PATH_LIST.join("/")}`;
// const dataList = [
//   {
//     title: "春联情深",
//     nestedItem: true,
//     url: "https://www.toutiao.com/c/user/token/MS4wLjABAAAAd2OUBbN7cWFu9s-76z328HyVhDV0oz-Bn6-K977AVTS2lAnrEVM2k2uLTPu8EzzU/?source=m_redirect&tab=wtt",
//   },
// ];

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    protocolTimeout: 360_000,
  });
  const page = await browser.newPage();

  const pageItem = dataList[0];

  await page.goto(pageItem.url);

  await delay(5000);

  await autoScroll(page, 30000);

  const pageTitle = await page.evaluate(() => {
    const content1 = document.querySelector(
      "#root .profile-info-wrapper .detail .name"
    )?.textContent;

    return content1;
  });

  const subFolder = await page.evaluate(() => {
    const $cardList = document.querySelectorAll(
      "#root .main-wrapper .profile-tab-feed .profile-wtt-card-wrapper"
    );

    const lastDate = $cardList[$cardList.length - 1].querySelector(
      ".feed-card-wtt-l .feed-card-wtt-header .time"
    )?.textContent;

    return lastDate;
  });

  console.log(pageTitle, "[pageTitle]");

  const pageList = await page.evaluate(() =>
    Array.from(
      (() => {
        const $listWrapper = document.querySelectorAll(
          "#root .main-wrapper .profile-tab-feed .profile-wtt-card-wrapper"
        );

        return $listWrapper;
      })(),
      (el) => {
        const $a = el.querySelector(".feed-card-wtt-l .content a");
        return $a.getAttribute("href");
      }
    )
  );

  if (pageItem.nestedItem) {
    await itemsMain(IMAGES_DIR_PATH, pageList, pageTitle, subFolder);
  } else {
    const images = await page.evaluate(() =>
      Array.from(
        (() => {
          const images1 = document.querySelectorAll(
            "#root .main-wrapper .profile-tab-feed .feed-card-wtt .feed-card-wtt-r .feed-card-cover"
          );
          return images1;
        })(),
        (el) => {
          const $img = el.querySelector("img") || el;
          return {
            src: $img.src,
            width:
              $img.naturalWidth || $img.width || $img.getAttribute("img_width"),
            height:
              $img.naturalHeight ||
              $img.height ||
              $img.getAttribute("img_height"),
          };
        }
      )
    );

    console.log(images.length, "[images.length]");

    for (let i = 0; i < images.length; i++) {
      const result = await download(
        images[i].src,
        `${IMAGES_DIR_PATH}/${pageTitle}/${subFolder}/images`,
        `${padStart(i)}x${images[i].width}x${images[i].height}.jpg`
      );
      if (result === true) {
        console.log(
          `Success: ${i} ${images[i].src} has been downloaded successfully.`
        );
      } else {
        console.error(`Error: ${i} ${images[i].src}  downloaded failed.`);
      }
    }
  }

  await delay(1000);

  await browser.close();
}

main().catch(console.error);
