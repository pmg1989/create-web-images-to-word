"use strict";

const fs = require("fs");
const https = require("https");
const puppeteer = require("puppeteer");

// 篆书
// const PATH_LIST = ["吴昌硕"];
// const IMAGES_DIR_PATH = `./images/篆书/${PATH_LIST[0]}`;
// const pageList = [
//   // /** 吴昌硕石鼓文唐诗三首，月落乌啼 */
//   // "https://www.toutiao.com/article/7286833257789063716/?app=news_article&timestamp=1728369069&use_new_style=1&req_id=20241008143109DD7DEE2A90FCB08C63C8&group_id=7286833257789063716&share_token=8490C45F-F311-41AC-A664-96F5E9D4EE8E&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // /** 《吴昌硕篆书部首一百法》书法教程 */
//   // "https://www.toutiao.com/article/7193704965666357772/?app=news_article&timestamp=1728527968&use_new_style=1&req_id=20241010103928F8AAE3714C299C66A992&group_id=7193704965666357772&share_token=B82A1348-6956-4397-99EE-1727367B4B6A&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // /** 吴昌硕篆书《西泠印社记》 */
//   // "https://www.toutiao.com/article/7407689993621176842/?app=news_article&timestamp=1728528107&use_new_style=1&req_id=20241010104146B0575E040E6E40663767&group_id=7407689993621176842&share_token=7B21EDC2-46E3-4010-9E4E-5BDC6B6A82A5&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7369882042505200167/?app=news_article&timestamp=1728540084&use_new_style=1&req_id=202410101401240F9ED9C32A53AE7EFDF9&group_id=7369882042505200167&share_token=0A484FFE-7C96-4C35-AE99-8E963957DEAA&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // /** 清吴昌硕篆书修震泽许塘记墨迹本 */
//   "https://www.toutiao.com/article/7358739612464103972/?app=news_article&timestamp=1728548210&use_new_style=1&req_id=2024101016164900814CB4CE02228E4F9A&group_id=7358739612464103972&share_token=D3581190-B6E3-4DF9-A81F-34BE91061AEA&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// ];

// 隶书 曹全碑
// const PATH_LIST = ["曹全碑"];
// const IMAGES_DIR_PATH = `./images/隶书/${PATH_LIST[0]}`;
// const pageList = [
//   // 春联 start
//   "https://www.toutiao.com/article/7055524026327892519/?app=news_article&timestamp=1730721446&use_new_style=1&req_id=20241104195725B2AB70EBAD8598156497&group_id=7055524026327892519&share_token=3ABAAC2A-1DF9-4E4C-8753-C4B8108B8226&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/6911926339956146700/?app=news_article&timestamp=1730701711&use_new_style=1&req_id=20241104142831DCD2EB04BC38CB2E2FF3&group_id=6911926339956146700&share_token=879BE962-3902-4061-B382-65C8BB09B345&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7049859859604423209/?app=news_article&timestamp=1730701663&use_new_style=1&req_id=202411041427421616B5290E7D1629A89A&group_id=7049859859604423209&share_token=3A8291F8-1E75-47BD-B4AE-AA9E519BDC34&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7188848139930780217/?app=news_article&timestamp=1730701622&use_new_style=1&req_id=20241104142702AF7A0A527F46002D6C20&group_id=7188848139930780217&share_token=C7D6B5DF-3315-4746-8CD0-66ECF0E82D50&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7314808679163855395/?app=news_article&timestamp=1730701521&use_new_style=1&req_id=202411041425212D5CE7F4B5133F2C0FF4&group_id=7314808679163855395&share_token=8D78DC5A-8551-494A-9035-9CFE8A669206&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/w/1811667846548491/?app=news_article&timestamp=1730701789&use_new_style=1&share_token=C7075C9A-4183-4557-80AC-9EB0A4A6CBA6&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // 春联 end
//   /** 曹全碑标准字帖，本帖共57页，共684字，喜欢隶书的收藏好了 */
//   // "https://www.toutiao.com/article/7338812422226117172/?app=news_article&timestamp=1727148611&use_new_style=1&req_id=2024092411301100B961EAE2EBB47B88DD&group_id=7338812422226117172&share_token=96DFCA5A-0D8D-4B21-8AE9-E687095017E3&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7368703686865879578/?app=news_article&timestamp=1716869415&use_new_style=1&req_id=2024052812101482EFA173C0A154689890&group_id=7368703686865879578&share_token=068C3F3C-40DC-4A87-90EA-43F0FFBC1F4C&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   // "https://www.toutiao.com/article/7362574373963825690/?app=news_article&timestamp=1716869716&use_new_style=1&req_id=20240528121515237CB7F6795AA66B2D1C&group_id=7362574373963825690&share_token=1BE62534-22D1-44BA-A4F2-44B0CA1D71E8&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// ];

// 楷书
const PATH_LIST = ["软笔颜体"];
const IMAGES_DIR_PATH = `./images/楷书/${PATH_LIST[0]}/`;
const pageList = [
  /** 颜真卿《颜勤礼碑》集字春联 */
  "https://www.toutiao.com/w/1816476393011292/?app=news_article&timestamp=1734346991&use_new_style=1&share_token=D5523BBD-D2A2-4241-8229-5E8AA5791523&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  /** 史上最全颜真卿·勤礼碑集字春联（新版） */
  // "https://www.toutiao.com/article/7338015443498500617/?app=news_article&timestamp=1734346850&use_new_style=1&req_id=20241216190049F3528BF746F07F9662A0&group_id=7338015443498500617&share_token=3ADF9B94-17B0-4EF2-BA4B-A29FCD60E8EB&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  /** 2025蛇年颜体春联，端庄喜庆 */
  // "https://www.toutiao.com/article/7444128088637604404/?app=news_article&timestamp=1734346547&use_new_style=1&req_id=2024121618554771A5378AA4775A884A3B&group_id=7444128088637604404&share_token=BAC40DB4-5F32-4D80-A5B6-543CD697862A&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  // /** 《颜勤礼碑》集字：沁园春雪！学颜体楷书的朋友别错过，高清大图 */
  // "https://www.toutiao.com/article/7380666467278193186/?app=news_article&timestamp=1727166300&use_new_style=1&req_id=202409241624597085FAE47F56F5A84D98&group_id=7380666467278193186&share_token=ADD80C5E-03E4-4FEF-A75C-814AAAA7FC55&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  // /** 硬笔楷书字体精讲50字 胡啸卿 - start */
  // "https://www.toutiao.com/article/7319657865366176293/?app=news_article&timestamp=1711358043&use_new_style=1&req_id=2024032517140397DBEEE4AC9EF68B0D19&group_id=7319657865366176293&share_token=B90A230E-9578-4073-A91F-50D470B86BC9&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  // "https://www.toutiao.com/article/7337864825181504000/?app=news_article&timestamp=1711358436&use_new_style=1&req_id=2024032517203667988472206C0E77BC6E&group_id=7337864825181504000&share_token=8A831E88-0D00-4FE6-B053-4B383A77A572&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  // "https://www.toutiao.com/article/7331177781625766440/?app=news_article&timestamp=1711358537&use_new_style=1&req_id=20240325172216D25A69B5548F608D7E0C&group_id=7331177781625766440&share_token=80CD5551-D8EE-46FF-8D57-8AC98EC0EC6A&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  // "https://www.toutiao.com/article/7328688639804949027/?app=news_article&timestamp=1711358658&use_new_style=1&req_id=202403251724172B3BC2CFD2F84C85C0EE&group_id=7328688639804949027&share_token=6D13C505-FD78-4103-9830-9A02315FA249&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  // "https://www.toutiao.com/article/7323146402148909607/?app=news_article&timestamp=1711358717&use_new_style=1&req_id=202403251725162B3BC2CFD2F84C85DF23&group_id=7323146402148909607&share_token=9887D6C6-C5AC-4DBF-9A28-E375ED0C46C1&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  // "https://www.toutiao.com/article/7321294860722536998/?app=news_article&timestamp=1711358766&use_new_style=1&req_id=202403251726068E0E94718F782C838F39&group_id=7321294860722536998&share_token=A14B8A7C-AF19-4F6D-9BDA-DC0B5FEF3802&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  // "https://www.toutiao.com/article/7320033361500717618/?app=news_article&timestamp=1711358811&use_new_style=1&req_id=202403251726518E0E94718F782C83A741&group_id=7320033361500717618&share_token=DF644EE2-102C-44AA-9990-108790D31887&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  // "https://www.toutiao.com/article/7319325177366577714/?app=news_article&timestamp=1711358824&use_new_style=1&req_id=20240325172703C10FDAE34ED684892A02&group_id=7319325177366577714&share_token=25C53D66-B3B2-4CCA-81E9-36444107BB41&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  // "https://www.toutiao.com/article/7318560352986481179/?app=news_article&timestamp=1711358840&use_new_style=1&req_id=2024032517272041D240A8DCAF65922DE9&group_id=7318560352986481179&share_token=0110D20A-4177-4A38-B1EE-087D8F281F64&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
  // /** 硬笔楷书字体精讲50字 胡啸卿 - end */
  // "https://www.toutiao.com/article/7320436157764944396/?app=news_article&timestamp=1711358840&use_new_style=1&req_id=2024032517272041D240A8DCAF65922DE9&group_id=7318560352986481179&share_token=0110D20A-4177-4A38-B1EE-087D8F281F64&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
];

// 行书
// const PATH_LIST = ["《1185字行书字帖》- 胡问遂"];
// const IMAGES_DIR_PATH = `./images/行书/${PATH_LIST[0]}/`;
// const pageList = [
//   /** 三字经简繁体毛笔字帖 */
//   // "https://www.toutiao.com/article/7375903921443832320/?app=news_article&timestamp=1728372775&use_new_style=1&req_id=20241008153254304825A498AB0C65D236&group_id=7375903921443832320&share_token=E70096B1-F4B6-40FB-B8F4-EC6D82ED4BD3&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
//   /** 《1185字行书字帖》- 胡问遂*/
//   "https://www.toutiao.com/article/7411819957110981156/?app=news_article&timestamp=1728647173&use_new_style=1&req_id=20241011194613E6D27D0457537A40041F&group_id=7411819957110981156&share_token=E21F642F-DEE1-4F07-B163-79302275EE24&tt_from=weixin&utm_source=weixin&utm_medium=toutiao_ios&utm_campaign=client_share&wxshare_count=1&source=m_redirect",
// ];

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
      // document.querySelector("#root .main .weitoutiao-html").textContent
    );

    const images = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          "#root .main article.tt-article-content .pgc-img"
          // "#root .main .image-list .weitoutiao-img"
        ),
        (el) => {
          return el.querySelector("img").src;
          // return el.src;
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
