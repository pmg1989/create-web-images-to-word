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

/**
 * rgb转hex
 * @param {number} r 红色色值，如：64
 * @param {number} g 绿色色值，如：158
 * @param {number} b 蓝色色值，如：255
 * @returns {string} 最终rgb转hex的值，如：#409EFF
 */
function rgb2Hex(r, g, b) {
  // 将每个颜色值转换为两位的十六进制字符串
  let hex =
    "#" +
    ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase();
  return hex;
}

// 获取文件后缀名
function getFileExtension(url) {
  return url.split(".").pop().split("?")[0].toLowerCase();
}

module.exports = {
  delay: delay,
  download: download,
  padStart: padStart,
  autoScroll: autoScroll,
  rgb2Hex: rgb2Hex,
  getFileExtension: getFileExtension,
};
