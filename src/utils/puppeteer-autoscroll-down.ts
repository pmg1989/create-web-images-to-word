import { Page } from "puppeteer";

function scrollPage(scrollDirection: "bottom" | "top") {
  return async (
    page: Page,
    { delay = 100, size = 250, stepsLimit = null } = {}
  ) => {
    let lastScrollPosition = await page.evaluate(
      async (
        pixelsToScroll: number,
        delayAfterStep: number,
        limit: any,
        direction: "bottom" | "top"
      ) => {
        let getElementScrollHeight = (element: any) => {
          if (!element) return 0;
          let { clientHeight, offsetHeight, scrollHeight } = element;
          return Math.max(scrollHeight, offsetHeight, clientHeight);
        };

        let initialScrollPosition = window.pageYOffset;
        let availableScrollHeight = getElementScrollHeight(document.body);
        let lastPosition = direction === "bottom" ? 0 : initialScrollPosition;

        let scrollFn = (resolve: any) => {
          let intervalId = setInterval(() => {
            window.scrollBy(
              0,
              direction === "bottom" ? pixelsToScroll : -pixelsToScroll
            );
            lastPosition +=
              direction === "bottom" ? pixelsToScroll : -pixelsToScroll;

            if (
              (direction === "bottom" &&
                lastPosition >= availableScrollHeight) ||
              (direction === "bottom" &&
                limit !== null &&
                lastPosition >= pixelsToScroll * limit) ||
              (direction === "top" && lastPosition <= 0) ||
              (direction === "top" &&
                limit !== null &&
                lastPosition <= initialScrollPosition - pixelsToScroll * limit)
            ) {
              clearInterval(intervalId);
              resolve(lastPosition);
            }
          }, delayAfterStep);
        };

        return new Promise(scrollFn);
      },
      size,
      delay,
      stepsLimit,
      scrollDirection
    );

    return lastScrollPosition;
  };
}

export const scrollPageToBottom = scrollPage("bottom");

export const scrollPageToTop = scrollPage("top");
