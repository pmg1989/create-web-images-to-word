import puppeteer, { Browser, Page } from "puppeteer";
import path from "path";
import { downloadImage, saveImage } from "@/utils/tools";
import { Config, ListSelectors } from "@/interface/types";

// Configuration constants
const CONFIG: Config = {
  SCRIPT_TYPE: "楷书", // Can be '隶书', '楷书', or '行书'
  PATHS: ["软笔", "颜体"],
  SOURCES: [
    {
      title: "翰墨文馨",
      nestedItem: false,
      url: "https://www.toutiao.com/c/user/token/MS4wLjABAAAAPQ8Ts43HdMN3MF6te8D3FwkofkHJwEggrf5m4AttvVo/?source=m_redirect&tab=wtt",
    },
  ],
};

// Selectors for DOM elements
const SELECTORS: ListSelectors = {
  PROFILE_NAME: "#root .profile-info-wrapper .detail .name",
  CARD_WRAPPER:
    "#root .main-wrapper .profile-tab-feed .profile-wtt-card-wrapper",
  CARD_TIME: ".feed-card-wtt-l .feed-card-wtt-header .time",
  CARD_LINK: ".feed-card-wtt-l .content a",
  IMAGES:
    "#root .main-wrapper .profile-tab-feed .feed-card-wtt .feed-card-wtt-r .feed-card-cover img",
};

const getPageContent = async <T>(
  page: Page,
  selector: string,
  evaluateFunc: (selectors: ListSelectors) => T
): Promise<T> => {
  await page.waitForSelector(selector);
  return page.evaluate(evaluateFunc, SELECTORS);
};

const main = async (): Promise<void> => {
  const browser = await puppeteer.launch({
    headless: false,
    protocolTimeout: 360_000,
  });

  try {
    const page = await browser.newPage();
    const { url } = CONFIG.SOURCES[0];

    await page.goto(url);

    // Get page title and image URLs
    const title = await getPageContent(page, SELECTORS.IMAGES, (selectors) => {
      const title = document.querySelector(selectors.PROFILE_NAME);
      return title ? title.textContent! : "";
    });

    const imageUrls = await getPageContent(
      page,
      SELECTORS.IMAGES,
      (selectors) => {
        const images = document.querySelectorAll<HTMLImageElement>(
          selectors.IMAGES
        );
        return Array.from(images).map((img) => img.src);
      }
    );

    console.log(imageUrls, "imageUrls");

    // Create images directory
    const imageDir = path.join(
      "images",
      CONFIG.SCRIPT_TYPE,
      ...CONFIG.PATHS,
      title,
      "images"
    );

    // Download images sequentially with try-catch for each image
    for (const [index, imageUrl] of imageUrls.entries()) {
      if (!imageUrl) continue;

      try {
        const imageData = await downloadImage(imageUrl);
        await saveImage(imageDir, `image_${index}.jpg`, imageData);
      } catch (error) {
        console.error(`Failed to download image ${index}: ${error}`);
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  } finally {
    await browser.close();
  }
};

// Execute main function
main().catch(console.error);
