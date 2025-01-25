import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";

// export const scrapePage = async (url: string) => {
//   const loader = new PuppeteerWebBaseLoader(url, {
//     launchOptions: { headless: "new" },
//     gotoOptions: { waitUntil: "domcontentloaded" },
//     evaluate: async (page, browser) => {
//       const result = await page.evaluate(() => document.body.textContent);
//       await browser.close();
//       return result;
//     }
//   });
  
//   const content = await loader.scrape();
//   return content?.replace(/<[^>]*>?/gm, '') || '';
// };

export const scrapePage = async (url: string) => {
  try {
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: {
        headless: "new"
      },
      gotoOptions: {
        waitUntil: "domcontentloaded"
      },
      evaluate: async (page, browser) => {
        const result = await page.evaluate(() => document.body.innerHTML);
        await browser.close();
        return result;
      }
    });
    const content = await loader.scrape();
    return content?.replace(/<[^>]*>?/gm, '');
  } catch (error) {
    console.error("Error scraping page:", error);
    return '';
  }
};