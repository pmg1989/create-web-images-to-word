"use strict";

const fs = require("fs");
const https = require("https");
const puppeteer = require("puppeteer");

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

/* ============================================================
  Promise-Based Download Function
============================================================ */
const download = (url, destination) =>
  new Promise((resolve, reject) => {
    const file = fs.createWriteStream(destination);

    https
      .get(url, (response) => {
        response.pipe(file);

        file.on("finish", () => {
          file.close(resolve(true));
        });
      })
      .on("error", (error) => {
        fs.unlink(destination);

        reject(error.message);
      });
  });

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto("https://m.eshetang.com/pages/product/brand-filter/index");

  await delay(1000);

  await page.click(
    "#tabBar .index-module__content___PpGgl .index-module__item___bYz4_:nth-child(2)"
  );

  await delay(3000);

  const images = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll(
        ".xfe_indexer .index-module__brand_indexer_content___ubMj1 .index-module__list___OegEB .index-module__item___bYz4_"
      ),
      (el) => ({
        url: el.querySelector(".index-module__logo___j66L9 taro-image-core")
          .src,
        name: el.querySelector(".index-module__name___QOHmo").textContent,
      })
    )
  );

  console.log(images, "[images]", images.length);

  for (let i = 0; i < images.length; i++) {
    const result = await download(
      images[i].url,
      `images/xiangbao/image-${images[i].name}.png`
    );

    if (result === true) {
      console.log(
        "Success:",
        images[i].name,
        images[i].url,
        "has been downloaded successfully."
      );
    } else {
      console.error(
        "Error:",
        images[i].name,
        images[i].url,
        "was not downloaded."
      );
      console.error(result);
    }
  }

  await delay(1000);

  await browser.close();
}

main().catch(console.error);
