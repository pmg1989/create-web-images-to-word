"use strict";

const fs = require("fs");
const https = require("https");
const puppeteer = require("puppeteer");

// 篆书
// const PATH_LIST = ["吴昌硕"];
// const IMAGES_DIR_PATH = `./images/篆书/${PATH_LIST[0]}`;
// const pageList = [
// /** 吴昌硕石鼓文唐诗三首，月落乌啼 */
//   "https://www.toutiao.com/article/7286833257789063716/?app=news_article&timestamp=1728369069&use_new_style=1&req_id=20241008143109DD7DEE2A90FCB08C63C8&group_id=7286833257789063716&share_token=8490C45F-F311-41AC-A664-96F5E9D4EE8E&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// ];

// 隶书 曹全碑
// const PATH_LIST = ["曹全碑"];
// const IMAGES_DIR_PATH = `./images/隶书/${PATH_LIST[0]}`;
// const pageList = [
// /** 曹全碑标准字帖，本帖共57页，共684字，喜欢隶书的收藏好了 */
//   "https://www.toutiao.com/article/7338812422226117172/?app=news_article&timestamp=1727148611&use_new_style=1&req_id=2024092411301100B961EAE2EBB47B88DD&group_id=7338812422226117172&share_token=96DFCA5A-0D8D-4B21-8AE9-E687095017E3&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7368703686865879578/?app=news_article&timestamp=1716869415&use_new_style=1&req_id=2024052812101482EFA173C0A154689890&group_id=7368703686865879578&share_token=068C3F3C-40DC-4A87-90EA-43F0FFBC1F4C&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7362574373963825690/?app=news_article&timestamp=1716869716&use_new_style=1&req_id=20240528121515237CB7F6795AA66B2D1C&group_id=7362574373963825690&share_token=1BE62534-22D1-44BA-A4F2-44B0CA1D71E8&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// ];

// 楷书
// const PATH_LIST = ["软笔颜体"];
// const IMAGES_DIR_PATH = `./images/楷书/${PATH_LIST[1]}/`;
// const pageList = [
// /** 《颜勤礼碑》集字：沁园春雪！学颜体楷书的朋友别错过，高清大图 */
// "https://www.toutiao.com/article/7380666467278193186/?app=news_article&timestamp=1727166300&use_new_style=1&req_id=202409241624597085FAE47F56F5A84D98&group_id=7380666467278193186&share_token=ADD80C5E-03E4-4FEF-A75C-814AAAA7FC55&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// /** 硬笔楷书字体精讲50字 胡啸卿 - start */
//   "https://www.toutiao.com/article/7319657865366176293/?app=news_article&timestamp=1711358043&use_new_style=1&req_id=2024032517140397DBEEE4AC9EF68B0D19&group_id=7319657865366176293&share_token=B90A230E-9578-4073-A91F-50D470B86BC9&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   "https://www.toutiao.com/article/7337864825181504000/?app=news_article&timestamp=1711358436&use_new_style=1&req_id=2024032517203667988472206C0E77BC6E&group_id=7337864825181504000&share_token=8A831E88-0D00-4FE6-B053-4B383A77A572&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   "https://www.toutiao.com/article/7331177781625766440/?app=news_article&timestamp=1711358537&use_new_style=1&req_id=20240325172216D25A69B5548F608D7E0C&group_id=7331177781625766440&share_token=80CD5551-D8EE-46FF-8D57-8AC98EC0EC6A&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   "https://www.toutiao.com/article/7328688639804949027/?app=news_article&timestamp=1711358658&use_new_style=1&req_id=202403251724172B3BC2CFD2F84C85C0EE&group_id=7328688639804949027&share_token=6D13C505-FD78-4103-9830-9A02315FA249&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   "https://www.toutiao.com/article/7323146402148909607/?app=news_article&timestamp=1711358717&use_new_style=1&req_id=202403251725162B3BC2CFD2F84C85DF23&group_id=7323146402148909607&share_token=9887D6C6-C5AC-4DBF-9A28-E375ED0C46C1&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   "https://www.toutiao.com/article/7321294860722536998/?app=news_article&timestamp=1711358766&use_new_style=1&req_id=202403251726068E0E94718F782C838F39&group_id=7321294860722536998&share_token=A14B8A7C-AF19-4F6D-9BDA-DC0B5FEF3802&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   "https://www.toutiao.com/article/7320033361500717618/?app=news_article&timestamp=1711358811&use_new_style=1&req_id=202403251726518E0E94718F782C83A741&group_id=7320033361500717618&share_token=DF644EE2-102C-44AA-9990-108790D31887&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   "https://www.toutiao.com/article/7319325177366577714/?app=news_article&timestamp=1711358824&use_new_style=1&req_id=20240325172703C10FDAE34ED684892A02&group_id=7319325177366577714&share_token=25C53D66-B3B2-4CCA-81E9-36444107BB41&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   "https://www.toutiao.com/article/7318560352986481179/?app=news_article&timestamp=1711358840&use_new_style=1&req_id=2024032517272041D240A8DCAF65922DE9&group_id=7318560352986481179&share_token=0110D20A-4177-4A38-B1EE-087D8F281F64&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// /** 硬笔楷书字体精讲50字 胡啸卿 - end */
//   "https://www.toutiao.com/article/7320436157764944396/?app=news_article&timestamp=1711358840&use_new_style=1&req_id=2024032517272041D240A8DCAF65922DE9&group_id=7318560352986481179&share_token=0110D20A-4177-4A38-B1EE-087D8F281F64&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// ];

// 行书
const PATH_LIST = ["三字经"];
const IMAGES_DIR_PATH = `./images/行书/${PATH_LIST[0]}/`;
const pageList = [
  /** 三字经简繁体毛笔字帖 */
  "https://www.toutiao.com/article/7375903921443832320/?app=news_article&timestamp=1728372775&use_new_style=1&req_id=20241008153254304825A498AB0C65D236&group_id=7375903921443832320&share_token=E70096B1-F4B6-40FB-B8F4-EC6D82ED4BD3&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
];

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

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  for (let curPageIndex = 0; curPageIndex < pageList.length; curPageIndex++) {
    await page.goto(pageList[curPageIndex]);

    console.log("加载中...");

    await delay(5000);

    await page.click("#root .main .expand-button-wrapper .expand-button");

    await delay(1000);

    const pageTitle = await page.evaluate(
      () =>
        document.querySelector("#root .main .article-content>h1").textContent
    );

    const images = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#root .main article.tt-article-content .pgc-img"
        ),
        (el) => {
          return el.querySelector("img").src;
        }
      )
    );

    console.log(curPageIndex, pageTitle, images.length, "[images]");

    for (let i = 0; i < images.length; i++) {
      const result = await download(
        images[i],
        `${IMAGES_DIR_PATH}/${pageTitle}`,
        `${i + 1}.jpg`
      );

      if (result === true) {
        console.log(
          `Success: ${curPageIndex} ${i} ${images[i]} has been downloaded successfully.`
        );
      } else {
        console.error(
          `Error: ${curPageIndex} ${i} ${images[i]}  downloaded failed.`
        );
      }
    }
  }

  await delay(1000);

  await browser.close();
}

main().catch(console.error);
