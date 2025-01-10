"use strict";

const fs = require("fs");
const https = require("https");

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

/* ============================================================
    Promise-Based Download Function
  ============================================================ */
const download = (url, destDir, destName) =>
  new Promise((resolve, reject) => {
    if (!fs.existsSync(destDir)) {
      fs.mkdirSync(destDir, { recursive: true });
    }

    const destination = `${destDir}/${destName}`;

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

const padStart = (str, length = 3) => {
  return `${str}`.padStart(length, "0");
};

/** 页面上下滚动 */
async function autoScroll(page, toScrollHeight = 10000, distance = 100) {
  if (toScrollHeight > 50000)
    throw new Error(`${toScrollHeight} 设置的太大了~`);

  await page.evaluate(
    async ({ distance, toScrollHeight }) => {
      await new Promise((resolve, reject) => {
        var totalHeight = 0;
        var timer = setInterval(
          ([distanceTime, toScrollHeightTime]) => {
            var scrollHeight = document.body.scrollHeight;
            window.scrollBy(0, distanceTime);
            totalHeight += distanceTime;

            if (
              totalHeight >= scrollHeight ||
              totalHeight > toScrollHeightTime
            ) {
              clearInterval(timer);
              resolve();
            }
          },
          300,
          [distance, toScrollHeight]
        );
      });
    },
    { distance, toScrollHeight }
  );
}

module.exports = {
  delay: delay,
  download: download,
  padStart: padStart,
  autoScroll: autoScroll,
};
