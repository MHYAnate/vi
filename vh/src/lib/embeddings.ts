import { OpenAIEmbeddings } from "@langchain/openai";
import { PineconeStore } from "@langchain/pinecone";
import { Document } from '@langchain/core/documents';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API Key');
}

if (!process.env.PINECONE_API_KEY || !process.env.PINECONE_ENVIRONMENT || !process.env.PINECONE_INDEX) {
  throw new Error('Missing Pinecone API Key, Environment, or Index Name');
}

const embeddings = new OpenAIEmbeddings({
  openAIApiKey: process.env.OPENAI_API_KEY,
});

// Initialize Pinecone client with the correct configuration


export async function storeDocuments(documents: Document[]) {
  const vectorStore = await PineconeStore.fromDocuments(documents, embeddings, {
    pineconeConfig: {
      indexName: process.env.PINECONE_INDEX!,
      config: {
        apiKey: process.env.PINECONE_API_KEY!
      }
    },
    namespace: process.env.PINECONE_ENVIRONMENT
  });
  
  return vectorStore;
}

export async function queryDocuments(query: string, k: number = 4) {
  const vectorStore = await PineconeStore.fromExistingIndex(
    embeddings,
    {
      pineconeConfig: {
        indexName: process.env.PINECONE_INDEX!,
        config: {
          apiKey: process.env.PINECONE_API_KEY!
        }
      },
      namespace: process.env.PINECONE_ENVIRONMENT
    }
  );

  const results = await vectorStore.similaritySearch(query, k);
  return results;
}