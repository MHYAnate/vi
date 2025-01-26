// // lib/scraper.ts
// import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
// import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// interface ScrapedContent {
//   url: string;
//   content: string;
//   chunks: string[];
// }

// export class SSPOT1Scraper {
//   private readonly targetURL = 'https://www.sspot1.com/api';
//   private splitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 512,
//     chunkOverlap: 100
//   });

//   public async scrapeFreshData(): Promise<ScrapedContent> {
//     try {
//       const rawContent = await this.fetchContent();
//       const cleanedContent = this.cleanContent(rawContent);
//       const chunks = await this.splitter.splitText(cleanedContent);
      
//       return {
//         url: this.targetURL,
//         content: cleanedContent,
//         chunks
//       };
//     } catch (error) {
//       throw new Error(`Scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
//     }
//   }

//   private async fetchContent(): Promise<string> {
//     const loader = new PuppeteerWebBaseLoader(this.targetURL, {
//       launchOptions: { headless: "new" },
//       gotoOptions: { waitUntil: "networkidle2" },
//       evaluate: async (page) => {
//         await page.waitForSelector('body', { timeout: 10000 });
//         return page.evaluate(() => document.body.innerText);
//       }
//     });

//     const docs = await loader.load();
//     return docs[0]?.pageContent || '';
//   }

//   private cleanContent(content: string): string {
//     return content
//       .replace(/<[^>]*>?/gm, '')
//       .replace(/\s+/g, ' ')
//       .trim();
//   }
// }

// lib/scraper.ts
import { DataAPIClient } from '@datastax/astra-db-ts';
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { config } from './config';
import { astraClient } from './astra';

const Sspot1Data = ['https://www.sspot1.com/api'];
const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100
});

export const scrapePage = async (url: string) => {
  try {
    const loader = new PuppeteerWebBaseLoader(url, {
      launchOptions: { headless: "new" },
      gotoOptions: { waitUntil: "domcontentloaded" }
    });
    
    const content = await loader.scrape();
    return content?.replace(/<[^>]*>?/gm, '') || '';
  } catch (error) {
    console.error("Error scraping page:", error);
    return '';
  }
};

export const loadSampleData = async () => {
  try {
    const collection = await astraClient.getCollection();
    
    for (const url of Sspot1Data) {
      const content = await scrapePage(url);
      const chunks = await splitter.splitText(content);
      
      for (const chunk of chunks) {
        try {
          const vector = await getJinaEmbedding(chunk);
          await collection.insertOne({
            $vector: vector,
            text: chunk
          });
        } catch (error) {
          console.error("Error processing chunk:", error);
        }
      }
    }
  } catch (error) {
    console.error("Error loading sample data:", error);
  }
};

async function getJinaEmbedding(text: string): Promise<number[]> {
  const response = await fetch('https://api.jina.ai/v1/embeddings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.jina.apiKey}`
    },
    body: JSON.stringify({
      model: 'jina-clip-v2',
      input: [text]
    })
  });

  if (!response.ok) {
    throw new Error(`Jina API Error: ${response.statusText}`);
  }

  const data = await response.json();
  return data.data[0].embedding;
}