import { DataAPIClient } from '@datastax/astra-db-ts';
import { PuppeteerWebBaseLoader } from "@langchain/community/document_loaders/web/puppeteer";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
// sk-91ed665166764ab8b269c344c8bbccd8  

type SimilarityMetric = "dot_product" | "cosine" | "euclidean";
 
const Sspot1Data = [
  'https://www.sspot1.com/api'
];

const client = new DataAPIClient("AstraCS:EEvrbZTXwmHJejApxGijBOeF:cb3d67986d2d79c5929e56b2c58bebe1f4131646a2c4c8b3ebf2689791d9519a");
const db = client.db("https://3b27e26f-9189-4bcf-ba28-6f8ad31526a5-us-east-2.apps.astra.datastax.com", { namespace:  "default_keyspace" });

const splitter = new RecursiveCharacterTextSplitter({
  chunkSize: 512,
  chunkOverlap: 100
});

const getJinaEmbedding = async (text: string): Promise<number[]> => {
  const url = 'https://api.jina.ai/v1/embeddings';
  const token = 'Bearer jina_b215f331b8e54727b7f41449fb0bacdbZj9-dOyxRkf-jTy6PzncMt2z3EFl';

  const data = {
    model: 'jina-clip-v2',
    dimensions: 1024,
    normalized: true,
    embedding_type: 'float',
    input: [text]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': token
      },
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    return result.data[0].embedding;
  } catch (error) {
    console.error('Error getting Jina embedding:', error);
    throw error;
  }
};

const createCollection = async (similarityMetric: SimilarityMetric = "dot_product") => {
  try {
    const res = await db.createCollection("sspot1Collection", {
      vector: {
        dimension: 1024, // Updated to match Jina's embedding dimension
        metric: similarityMetric
      }
    });
    console.log("Collection created:", res);
  } catch (error) {
    console.error("Error creating collection:", error);
  }
};

const loadSampleData = async () => {
  try {
    const collection = await db.collection("sspot1Collection");
    for await (const url of Sspot1Data) {
      const content = await scrapePage(url);
      const chunks = await splitter.splitText(content);
      
      for await (const chunk of chunks) {
        try {
          const vector = await getJinaEmbedding(chunk);

          const res = await collection.insertOne({
            $vector: vector,
            text: chunk
          });
          console.log("Document inserted:", res);
        } catch (error) {
          console.error("Error processing chunk:", error);
        }
      }
    }
  } catch (error) {
    console.error("Error loading sample data:", error);
  }
};

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

const main = async () => {
  try {
    await createCollection();
    await loadSampleData();
  } catch (error) {
    console.error("Error in main execution:", error);
  }
};

main();