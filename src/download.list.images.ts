import puppeteer, { Page } from "puppeteer";
import path from "path";
import { delay, downloadImage, saveImage } from "@/utils/tools";
import { Config, ListSelectors } from "@/interface/types";
import { main as downloadItemImages } from "@/download.item.images";

// Configuration constants
const CONFIG: Config = {
  SCRIPT_TYPE: "楷书", // Can be '隶书', '楷书', or '行书'
  PATHS: ["软笔", "颜体"],
  SOURCES: [
    {
      title: "宝如斋",
      nestedItem: true,
      url: "https://www.toutiao.com/c/user/token/CiY6VeuUEQ7iIV4WqXIdvlbPTGU-AhIUbsMEJD1acDAU38oX1JYduxpJCjwAAAAAAAAAAAAAUJVv5C15SSYMuxFEmeFAYIGxHFqqwBQtpIvwN2fOjYdQJzAsbkN0IFEG3uu--5tL8hUQj42VDhjDxYPqBCIBA0TVGu4=/?source=m_redirect",
    },
    // {
    //   title: "谦德堂中考书法工作室",
    //   nestedItem: false,
    //   url: "https://www.toutiao.com/c/user/token/CibGzAsQxEydhW2XoMpdp8bjfw_J5AYDGvuIOn67DTzl-af0SnbttxpJCjwAAAAAAAAAAAAAUJKom0asQqBOVoW38gS-EdRvZ6AkWCc4zqpiznkfoQVIHKWNv11Gohoc0QmWNMO0ODkQxuyUDhjDxYPqBCIBA8qRFvg=/?source=m_redirect",
    // },
    // {
    //   title: "翰墨文馨",
    //   nestedItem: false,
    //   url: "https://www.toutiao.com/c/user/token/MS4wLjABAAAAPQ8Ts43HdMN3MF6te8D3FwkofkHJwEggrf5m4AttvVo/?source=m_redirect&tab=wtt",
    // },
  ],
};

// Selectors for DOM elements
const SELECTORS: ListSelectors = {
  PROFILE_NAME: "#root .profile-info-wrapper .detail .name",
  CARD_WRAPPER:
    // "#root .main-wrapper .profile-tab-feed .profile-wtt-card-wrapper", // 个人主页
    "#root .main-wrapper .profile-search-result .profile-wtt-card-wrapper", // 个人主页搜索结果
  CARD_TIME: ".feed-card-wtt-l .feed-card-wtt-header .time",
  CARD_LINK: ".feed-card-wtt-l .content a",
  IMAGES:
    // "#root .main-wrapper .profile-tab-feed .feed-card-wtt .feed-card-wtt-r .feed-card-cover img", // 个人主页
    "#root .main-wrapper .profile-search-result .feed-card-wtt .feed-card-wtt-r .feed-card-cover img", // 个人主页搜索结果
};

const getPageContent = async <T>(
  page: Page,
  selector: string,
  evaluateFunc: (selectors: ListSelectors) => T,
): Promise<T> => {
  await page.waitForSelector(selector);
  return page.evaluate(evaluateFunc, SELECTORS);
};

const getPageInfo = async (
  page: Page,
): Promise<{ pageTitle: string; subFolder: string }> =>
  getPageContent(page, SELECTORS.CARD_WRAPPER, (selectors) => {
    const profileName = document.querySelector(selectors.PROFILE_NAME);
    const cards = document.querySelectorAll(selectors.CARD_WRAPPER);
    const lastCard = cards[cards.length - 1];
    const subFolder =
      lastCard?.querySelector(selectors.CARD_TIME)?.textContent?.trim() ?? "";

    return {
      pageTitle: profileName?.textContent?.trim() ?? "",
      subFolder,
    };
  });

const getPageLinks = async (page: Page): Promise<string[]> =>
  getPageContent(page, SELECTORS.CARD_WRAPPER, (selectors) => {
    const cards = document.querySelectorAll(selectors.CARD_WRAPPER);

    return Array.from(cards, (card) => {
      const href = card
        .querySelector(selectors.CARD_LINK)
        ?.getAttribute("href");
      return href ? new URL(href, window.location.href).toString() : "";
    }).filter(Boolean);
  });

const main = async (): Promise<void> => {
  const browser = await puppeteer.launch({
    headless: false,
    protocolTimeout: 360_000,
  });

  try {
    const page = await browser.newPage();
    const source = CONFIG.SOURCES[0];

    await page.goto(source.url);

    await delay(1000 * 60 * 1); // Wait for 1 minute to ensure all content is loaded

    const { pageTitle, subFolder } = await getPageInfo(page);

    console.log(pageTitle, "title");

    if (source.nestedItem) {
      const pageLinks = await getPageLinks(page);

      console.log(pageLinks, "pageLinks");

      const outputPath = path.join(
        "images",
        CONFIG.SCRIPT_TYPE,
        ...CONFIG.PATHS,
      );

      await downloadItemImages(outputPath, pageLinks, pageTitle, subFolder);
      return;
    }

    const imageUrls = await getPageContent(
      page,
      SELECTORS.IMAGES,
      (selectors) => {
        const images = document.querySelectorAll<HTMLImageElement>(
          selectors.IMAGES,
        );
        return Array.from(images).map((img) => img.src);
      },
    );

    console.log(imageUrls, "imageUrls");

    // Create images directory
    const imageDir = path.join(
      "images",
      CONFIG.SCRIPT_TYPE,
      ...CONFIG.PATHS,
      pageTitle,
      "images",
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
