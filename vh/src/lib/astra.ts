// import { DataAPIClient } from '@datastax/astra-db-ts';

// const client = new DataAPIClient("AstraCS:EEvrbZTXwmHJejApxGijBOeF:cb3d67986d2d79c5929e56b2c58bebe1f4131646a2c4c8b3ebf2689791d9519a");
// export const db = client.db("https://3b27e26f-9189-4bcf-ba28-6f8ad31526a5-us-east-2.apps.astra.datastax.com", {
//   namespace: "default_keyspace"
// });

// export const initializeCollection = async () => {
//   try {
//     await db.createCollection("sspot1Collection", {
//       vector: {
//         dimension: 1024,
//         metric: "dot_product"
//       }
//     });
//     console.log("Collection initialized");
//   } catch (error) {
//     console.log("Collection already exists");
//   }
// };

// import { NextResponse } from 'next/server';
// // import { db } from '@/lib/astra';
// import { scrapePage } from '@/lib/scrapper';

// export const POST = async (req: Request) => {
//   try {
//     const { question } = await req.json();
    
//     // Get Jina embedding
//     const jinaResponse = await fetch('https://api.jina.ai/v1/embeddings', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${"jina_61cbb148769d469ba46ac9bbc2f191b6AdGiBsLDsVUUXcIJZpNdF3baKee6"}`
//       },
//       body: JSON.stringify({
//         model: 'jina-clip-v2',
//         input: [question]
//       })
//     });
    
//     const jinaData = await jinaResponse.json();
//     const queryVector = jinaData.data[0].embedding;

//     // Query Astra DB
//     const collection = await db.collection("sspot1Collection");
//     const cursor = await collection.find({}, {
//       sort: { $vector: queryVector },
//       limit: 3,
//       includeSimilarity: true
//     });
    
//     const documents = await cursor.toArray();
//     const context = documents.map(doc => doc.text).join('\n\n');

//     // Query DeepSeek
//     const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${"sk-91ed665166764ab8b269c344c8bbccd8"}`
//       },
//       body: JSON.stringify({
//         model: 'deepseek-chat',
//         messages: [{
//           role: "system",
//           content: `Answer using this context:\n${context}\n\nIf unsure, say you don't know.`
//         }, {
//           role: "user",
//           content: question
//         }],
//         temperature: 0.7
//       })
//     });

//     const result = await deepseekResponse.json();
//     return NextResponse.json({
//       answer: result.choices[0].message.content,
//       contextSources: documents.map(doc => ({
//         text: doc.text.slice(0, 150) + '...',
//         similarity: doc.$similarity
//       }))
//     });
    
//   } catch (error) {
//     console.error('RAG Error:', error);
//     return NextResponse.json(
//       { error: 'Failed to process question' },
//       { status: 500 }
//     );
//   }
// };

import { DataAPIClient } from '@datastax/astra-db-ts';

interface AstraConfig {
  endpoint: string;
  token: string;
}

const validateAstraConfig = (): AstraConfig => {
  const endpoint = "3b27e26f-9189-4bcf-ba28-6f8ad31526a5-us-east-2.apps.astra.datastax.com";
  const token = "AstraCS:EEvrbZTXwmHJejApxGijBOeF:cb3d67986d2d79c5929e56b2c58bebe1f4131646a2c4c8b3ebf2689791d9519a";

  if (!endpoint || !token) {
    throw new Error('Missing Astra DB configuration');
  }

  try {
    const fullEndpoint = `https://${endpoint}`;
    new URL(fullEndpoint);
    return { endpoint: fullEndpoint, token };
  } catch (error) {
    throw new Error(`Invalid Astra DB endpoint: ${endpoint}`);
  }
};

const astraConfig = validateAstraConfig();
const client = new DataAPIClient(astraConfig.token);

export const db = client.db(astraConfig.endpoint, {
  namespace: "default_keyspace"
});

export const initializeCollection = async () => {
  try {
    await db.createCollection("sspot1Collection", {
      vector: {
        dimension: 1024,
        metric: "dot_product"
      }
    });
  } catch (error: any) {
    if (!error.message.includes('already exists')) {
      throw new Error(`Collection init failed: ${error.message}`);
    }
  }
};

console.log('Astra Config:', {
  endpoint: process.env.NEXT_PUBLIC_ASTRA_DB_ENDPOINT,
  token: process.env.NEXT_PUBLIC_ASTRA_DB_APPLICATION_TOKEN?.slice(0, 10) + '...'
});