const puppeteer = require("puppeteer");

const delay = (milliseconds) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(
    "http://test176.erpnew.t.zhixiangyao.com/account/login?redirect=%2Fwarehouse%2FreservoirList"
  );
  await page.type("#phone", "13610000016", { delay: 100 });

  await delay(1000);

  await page.click("#rc-tabs-0-panel-1 .ant-btn-default");

  await delay(1000);

  const captchaCode = await page.$eval("#captchaCode", (input) => {
    return input.getAttribute("value");
  });

  await delay(1000);

  await page.type("#smsCode", captchaCode, { delay: 100 });

  await delay(1000);

  // await page.click(".ant-modal-root .ant-btn-primary");

  // await delay(1000);

  await page.click(
    "#rc-tabs-0-panel-1 > div > div > form > div:nth-child(4) > div > div > div > div > button"
  );

  await delay(1000);

  browser.close();
})();
