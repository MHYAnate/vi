

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