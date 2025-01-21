"use strict";

const puppeteer = require("puppeteer");
const { main: downloadItemImages } = require("./download.items.image");
const {
  delay,
  download,
  padStart,
  getFileExtension,
  autoScroll,
} = require("./utils");

// Configuration constants
// const CONFIG = {
//   SCRIPT_TYPE: "楷书", // Can be '隶书', '楷书', or '行书'
//   PATHS: ["软笔", "颜体"],
//   SOURCES: [
//     {
//       title: "翰墨文馨",
//       nestedItem: false,
//       url: "https://www.toutiao.com/c/user/token/MS4wLjABAAAAPQ8Ts43HdMN3MF6te8D3FwkofkHJwEggrf5m4AttvVo/?source=m_redirect&tab=wtt",
//     },
//   ],
// };

const CONFIG = {
  SCRIPT_TYPE: "行书", // Can be '隶书', '楷书', or '行书'
  PATHS: [],
  SOURCES: [
    {
      title: "春联情深",
      nestedItem: true,
      url: "https://www.toutiao.com/c/user/token/MS4wLjABAAAAd2OUBbN7cWFu9s-76z328HyVhDV0oz-Bn6-K977AVTS2lAnrEVM2k2uLTPu8EzzU/?source=m_redirect&tab=wtt",
    },
  ],
};

// Derive image directory path from config
const IMAGES_DIR_PATH = `./images/${CONFIG.SCRIPT_TYPE}/${CONFIG.PATHS.join(
  "/"
)}`;

// Selectors for DOM elements
const SELECTORS = {
  PROFILE_NAME: "#root .profile-info-wrapper .detail .name",
  CARD_WRAPPER:
    "#root .main-wrapper .profile-tab-feed .profile-wtt-card-wrapper",
  CARD_TIME: ".feed-card-wtt-l .feed-card-wtt-header .time",
  CARD_LINK: ".feed-card-wtt-l .content a",
  IMAGES:
    "#root .main-wrapper .profile-tab-feed .feed-card-wtt .feed-card-wtt-r .feed-card-cover",
};

async function getPageInfo(page) {
  return await page.evaluate((selectors) => {
    const pageTitle = document.querySelector(
      selectors.PROFILE_NAME
    )?.textContent;
    const cards = document.querySelectorAll(selectors.CARD_WRAPPER);
    const lastCard = cards[cards.length - 1];
    const subFolder = lastCard.querySelector(selectors.CARD_TIME)?.textContent;

    return { pageTitle, subFolder };
  }, SELECTORS);
}

async function getPageLinks(page) {
  return await page.evaluate((selectors) => {
    const cards = document.querySelectorAll(selectors.CARD_WRAPPER);
    return Array.from(cards, (el) => {
      const link = el.querySelector(selectors.CARD_LINK);
      return link.getAttribute("href");
    });
  }, SELECTORS);
}

async function getPageImages(page) {
  return await page.evaluate((selectors) => {
    const imageElements = document.querySelectorAll(selectors.IMAGES);
    return Array.from(imageElements, (el) => {
      const img = el.querySelector("img") || el;
      const width =
        img.naturalWidth || img.width || img.getAttribute("img_width");
      const height =
        img.naturalHeight || img.height || img.getAttribute("img_height");

      return {
        src: img.src,
        width,
        height,
      };
    });
  }, SELECTORS);
}

async function downloadImages(images, outputPath, pageTitle, subFolder) {
  for (let i = 0; i < images.length; i++) {
    const { src, width, height } = images[i];
    // const extension = getFileExtension(src);
    const filename = `${padStart(i)}x${width}x${height}.jpg`;
    const fullPath = `${outputPath}/${pageTitle}/${subFolder}/images`;

    try {
      const success = await download(src, fullPath, filename);
      console.log(
        success
          ? `Success: ${i} ${src} has been downloaded successfully.`
          : `Error: ${i} ${src} downloaded failed.`
      );
    } catch (error) {
      console.error(`Error downloading ${src}:`, error);
    }
  }
}

async function main() {
  const browser = await puppeteer.launch({
    headless: false,
    protocolTimeout: 360_000,
  });

  try {
    const page = await browser.newPage();
    const pageItem = CONFIG.SOURCES[0];

    await page.goto(pageItem.url);
    await delay(5000);
    // await autoScroll(page, 50000);

    const { pageTitle, subFolder } = await getPageInfo(page);
    console.log(pageTitle, "[pageTitle]");

    if (pageItem.nestedItem) {
      const pageLinks = await getPageLinks(page);

      console.log(pageLinks, "[pageLinks]");

      await downloadItemImages(
        IMAGES_DIR_PATH,
        pageLinks,
        pageTitle,
        subFolder
      );
    } else {
      const images = await getPageImages(page);
      console.log(images.length, "[images.length]");
      await downloadImages(images, IMAGES_DIR_PATH, pageTitle, subFolder);
    }
  } finally {
    await delay(1000);
    await browser.close();
  }
}

main().catch(console.error);
