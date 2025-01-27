// lib/scraper.ts
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

interface ScrapedContent {
  url: string;
  content: string;
  chunks: string[];
}

export class SSPOT1Scraper {
  private readonly targetURL = 'https://www.sspot1.com/api';
  private splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 512,
    chunkOverlap: 100
  });

  public async scrapeFreshData(): Promise<ScrapedContent> {
    try {
      const rawContent = await this.fetchContent();
      const cleanedContent = this.cleanContent(rawContent);
      const chunks = await this.splitter.splitText(cleanedContent);
      
      return {
        url: this.targetURL,
        content: cleanedContent,
        chunks
      };
    } catch (error) {
      throw new Error(`Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async fetchContent(): Promise<string> {
    const loader = new PuppeteerWebBaseLoader(this.targetURL, {
      launchOptions: { headless: "new" },
      gotoOptions: { waitUntil: "networkidle2" },
      evaluate: async (page) => {
        await page.waitForSelector('body', { timeout: 10000 });
        return page.evaluate(() => document.body.innerText);
      }
    });

    const docs = await loader.load();
    return docs[0]?.pageContent || '';
  }

  private cleanContent(content: string): string {
    return content
      .replace(/<[^>]*>?/gm, '')
      .replace(/\s+/g, ' ')
      .trim();
  }
}