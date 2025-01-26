// import { DataAPIClient } from '@datastax/astra-db-ts';
// import type { NextApiRequest, NextApiResponse } from 'next';

// const client = new DataAPIClient(process.env.ASTRA_DB_ACCESS_TOKEN!);
// const db = client.db(process.env.ASTRA_DB_ENDPOINT!, {
//   namespace: "default_keyspace"
// });

// const getJinaEmbedding = async (text: string): Promise<number[]> => {
//   const response = await fetch('https://api.jina.ai/v1/embeddings', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${"jina_61cbb148769d469ba46ac9bbc2f191b6AdGiBsLDsVUUXcIJZpNdF3baKee6"}`
//     },
//     body: JSON.stringify({
//       model: 'jina-clip-v2',
//       input: [text]
//     })
//   });

//   const data = await response.json();
//   return data.data[0].embedding;
// };

// const queryDeepSeek = async (context: string, question: string) => {
//   const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${"sk-91ed665166764ab8b269c344c8bbccd8"}`
//     },
//     body: JSON.stringify({
//       model: 'deepseek-chat',
//       messages: [{
//         role: "system",
//         content: `Answer the question based on the following context:\n\n${context}`
//       }, {
//         role: "user",
//         content: question
//       }],
//       temperature: 0.7
//     })
//   });

//   return response.json();
// };

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   if (req.method !== 'POST') {
//     return res.status(405).json({ error: 'Method not allowed' });
//   }

//   try {
//     const { question } = req.body;
    
//     // Get query embedding
//     const queryVector = await getJinaEmbedding(question);
    
//     // Search Astra DB
//     const collection = await db.collection("sspot1Collection");
//     const results = await collection.find({}, {
//       sort: { $vector: queryVector },
//       limit: 3,
//       includeSimilarity: true
//     });

//     // Convert cursor to array of documents
//     const documents = await results.toArray();
    
//     // Combine context from top results
//     const context = documents.map(doc => doc.text).join('\n\n');
    
//     // Query DeepSeek with context
//     const deepseekResponse = await queryDeepSeek(context, question);
    
//     res.status(200).json({
//       answer: deepseekResponse.choices[0].message.content,
//       context: context
//     });
//   } catch (error) {
//     console.error('RAG error:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// }

// import { NextResponse } from 'next/server';
// import { db } from '@/lib/astra';
// import { config } from '@/lib/config';

// export const POST = async (req: Request) => {
//   try {
//     const { question } = await req.json();
    
//     // Get Jina embedding
//     const jinaResponse = await fetch('https://api.jina.ai/v1/embeddings', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${config.jina.apiKey}`
//       },
//       body: JSON.stringify({
//         model: 'jina-clip-v2',
//         input: [question]
//       })
//     });

//     if (!jinaResponse.ok) {
//       throw new Error(`Jina API error: ${jinaResponse.statusText}`);
//     }

//     const jinaData = await jinaResponse.json();
//     const queryVector = jinaData.data[0].embedding;

//     // Query Astra DB
//     const collection = await db.collection("sspot1Collection");
//     const cursor = await collection.find({}, {
//       sort: { $vector: queryVector },
//       limit: 3,
//       includeSimilarity: true
//     });
    
//      const documents = await cursor.toArray();
//     const context = documents.map(doc => doc.text).join('\n\n');

//     // Query DeepSeek
//     const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${config.deepseek.apiKey}`
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

//     if (!deepseekResponse.ok) {
//       throw new Error(`DeepSeek API error: ${deepseekResponse.statusText}`);
//     }

//     const result = await deepseekResponse.json();
    
//     return NextResponse.json({
//       answer: result.choices[0].message.content,
//       contextSources: documents.map(doc => ({
//         text: doc.text.slice(0, 150) + '...',
//         similarity: Math.round(doc.$similarity * 100)
//       }))
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//       }
//     });

//   } catch (error: any) {
//     console.error('RAG Error:', error);
//     return NextResponse.json(
//       { error: error.message || 'Internal Server Error' },
//       { 
//         status: 500,
//         headers: {
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Origin': '*'
//         }
//       }
//     );
//   }
// };

// export const OPTIONS = () => {
//   return NextResponse.json({}, {
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type'
//     }
//   });
// };


// import { NextResponse } from 'next/server';
// import { db } from '@/lib/astra';
// import { config } from '@/lib/config';

// interface JinaEmbeddingResponse {
//   data: Array<{
//     embedding: number[];
//   }>;
// }

// interface DeepSeekResponse {
//   choices: Array<{
//     message: {
//       content: string;
//     };
//   }>;
// }

// export const POST = async (req: Request) => {
//   try {
//     const { question } = await req.json();
    
//     // Get Jina embedding
//     const jinaResponse = await fetch('https://api.jina.ai/v1/embeddings', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${config.jina.apiKey}`
//       },
//       body: JSON.stringify({
//         model: 'jina-clip-v2',
//         input: [question]
//       })
//     });

//     if (!jinaResponse.ok) {
//       throw new Error(`Jina API error: ${jinaResponse.statusText}`);
//     }

//     const jinaData: JinaEmbeddingResponse = await jinaResponse.json();
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
//         'Authorization': `Bearer ${config.deepseek.apiKey}`
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

//     if (!deepseekResponse.ok) {
//       throw new Error(`DeepSeek API error: ${deepseekResponse.statusText}`);
//     }

//     const result: DeepSeekResponse = await deepseekResponse.json();
    
//     return NextResponse.json({
//       answer: result.choices[0].message.content,
//       contextSources: documents.map(doc => ({
//         text: doc.text.slice(0, 150) + '...',
//         similarity: Math.round(doc.$similarity * 100)
//       }))
//     }, {
//       headers: {
//         'Content-Type': 'application/json',
//         'Access-Control-Allow-Origin': '*'
//       }
//     });

//   } catch (error: unknown) {
//     console.error('RAG Error:', error);
//     const errorMessage = error instanceof Error 
//       ? error.message 
//       : 'An unexpected error occurred';
      
//     return NextResponse.json(
//       { error: errorMessage },
//       { 
//         status: 500,
//         headers: {
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Origin': '*'
//         }
//       }
//     );
//   }
// };

// export const OPTIONS = () => {
//   return NextResponse.json({}, {
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type'
//     }
//   });
// };

// import { NextResponse } from 'next/server';
// import { db } from '@/lib/astra';
// import { config } from '@/lib/config';

// interface JinaEmbeddingResponse {
//   data: Array<{
//     embedding: number[];
//   }>;
// }

// interface DeepSeekResponse {
//   choices: Array<{
//     message: {
//       content: string;
//     };
//   }>;
// }

// export const POST = async (req: Request) => {
//   try {
//     const { question } = await req.json();

//     // Get Jina embedding
//     const jinaResponse = await fetch('https://api.jina.ai/v1/embeddings', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${config.jina.apiKey}`,
//       },
//       body: JSON.stringify({
//         model: 'jina-clip-v2',
//         input: [question],
//       }),
//     });

//     if (!jinaResponse.ok) {
//       throw new Error(`Jina API error: ${jinaResponse.statusText}`);
//     }

//     const jinaData: JinaEmbeddingResponse = await jinaResponse.json();
//     const queryVector = jinaData.data[0].embedding;

//     // Query Astra DB
//     const collection = await db.collection('sspot1Collection');
//     const cursor = await collection.find(
//       {},
//       {
//         sort: { $vector: queryVector },
//         limit: 3,
//         includeSimilarity: true,
//       },
//     );

//     const documents = await cursor.toArray();
//     const context = documents.map((doc) => doc.text).join('\n\n');

//     // Query DeepSeek
//     const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         Authorization: `Bearer ${config.deepseek.apiKey}`,
//       },
//       body: JSON.stringify({
//         model: 'deepseek-chat',
//         messages: [
//           {
//             role: 'system',
//             content: `Answer using this context:\n${context}\n\nIf unsure, say you don't know.`,
//           },
//           {
//             role: 'user',
//             content: question,
//           },
//         ],
//         temperature: 0.7,
//       }),
//     });

//     if (!deepseekResponse.ok) {
//       throw new Error(`DeepSeek API error: ${deepseekResponse.statusText}`);
//     }

//     const result: DeepSeekResponse = await deepseekResponse.json();

//     return NextResponse.json(
//       {
//         answer: result.choices[0].message.content,
//         contextSources: documents.map((doc) => ({
//           text: doc.text.slice(0, 150) + '...',
//           similarity: Math.round(doc.$similarity * 100),
//         })),
//       },
//       {
//         headers: {
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Origin': '*',
//         },
//       },
//     );
//   } catch (error: unknown) {
//     console.error('RAG Error:', error);
//     const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';

//     return NextResponse.json(
//       { error: errorMessage },
//       {
//         status: 500,
//         headers: {
//           'Content-Type': 'application/json',
//           'Access-Control-Allow-Origin': '*',
//         },
//       },
//     );
//   }
// };

// export const OPTIONS = () => {
//   return NextResponse.json(
//     {},
//     {
//       headers: {
//         'Access-Control-Allow-Origin': '*',
//         'Access-Control-Allow-Methods': 'POST, OPTIONS',
//         'Access-Control-Allow-Headers': 'Content-Type',
//       },
//     },
//   );
// };

// import { NextResponse } from 'next/server';
// import { astraClient } from '@/lib/astra';
// import { config } from '@/lib/config';

// interface JinaEmbedding {
//   embedding: number[];
// }

// interface DeepSeekMessage {
//   role: 'system' | 'user';
//   content: string;
// }

// export const POST = async (req: Request) => {
//   try {
//     const { question } = await req.json();
    
//     // Get Jina embedding

//     const jinaResponse = await fetch('https://api.jina.ai/v1/embeddings', {
//   method: 'POST',
//   headers: {
//     'Content-Type': 'application/json',
//     'Authorization': `Bearer ${config.jina.apiKey}`
//   },
//   body: JSON.stringify({
//     model: 'jina-embeddings-v2-base-en',
//     input: [question]
//   })
// });

//     if (!jinaResponse.ok) {
//       const error = await jinaResponse.json();
//       throw new Error(`Jina API Error: ${error.detail || jinaResponse.statusText}`);
//     }

//     const { data: [{ embedding }] } = await jinaResponse.json() as { data: JinaEmbedding[] };

//     // Vector search in Astra DB
//     const collection = await astraClient.getCollection('sspot1Collection');
//     const results = await collection.find({}, {
//       sort: { $vector: embedding },
//       limit: 3,
//       includeSimilarity: true
//     });

//     // Generate answer with DeepSeek
//     const context = (await results.toArray())
//       .map(d => `${d.text} (Similarity: ${Math.round(d.$similarity * 100)}%)`)
//       .join('\n\n');

//     const deepseekResponse = await fetch('https://api.deepseek.com/v1/chat/completions', {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//         'Authorization': `Bearer ${config.deepseek.apiKey}`
//       },
//       body: JSON.stringify({
//         model: 'deepseek-chat',
//         messages: [
//           {
//             role: 'system',
//             content: `Answer concisely using this context. If unsure, state you don't know:\n${context}`
//           },
//           {
//             role: 'user',
//             content: question
//           }
//         ],
//         temperature: 0.7,
//         max_tokens: 500
//       })
//     });

//     if (!deepseekResponse.ok) {
//       const error = await deepseekResponse.json();
//       throw new Error(`DeepSeek API Error: ${error.error?.message || deepseekResponse.statusText}`);
//     }

//     const { choices: [{ message }] } = await deepseekResponse.json();

//     return NextResponse.json({
//       answer: message.content,
//       context: JSON.parse(context)
//     });

//   } catch (error: any) {
//     console.error('RAG Pipeline Error:', error);
//     return NextResponse.json(
//       { error: error.message || 'An unexpected error occurred' },
//       { status: 500 }
//     );
//   }
// };

// export const OPTIONS = () => new NextResponse(null, {
//   headers: {
//     'Access-Control-Allow-Origin': '*',
//     'Access-Control-Allow-Methods': 'POST, OPTIONS',
//     'Access-Control-Allow-Headers': 'Content-Type'
//   }
// });

// app/api/rag/route.ts
// import { NextResponse } from 'next/server';
// import { astraClient } from '@/lib/astra';
// import { config } from '@/lib/config';
// import { SSPOT1Scraper } from '@/lib/scraper';

// interface JinaEmbeddingResponse {
//   data: Array<{ embedding: number[] }>;
// }

// interface DeepSeekResponse {
//   choices: Array<{ message: { content: string } }>;
// }

// export async function POST(req: Request) {
//   try {
//     const { question } = await req.json();
//     const { embedding, context } = await processQuery(question);
    
//     const answer = await generateAnswer(question, context);
//     return formatSuccessResponse(answer, context);
    
//   } catch (error) {
//     return handleError(error);
//   }
// }

// async function processQuery(question: string) {
//   const embedding = await getJinaEmbedding(question);
//   const collection = await astraClient.getCollection();
  
//   const results = await collection.find({}, {
//     sort: { $vector: embedding },
//     limit: 3,
//     includeSimilarity: true
//   });

//   const context = (await results.toArray()).map(doc => ({
//     text: doc.text.slice(0, 150) + '...',
//     similarity: Math.round(doc.$similarity * 100)
//   }));

//   return { embedding, context };
// }

// async function getJinaEmbedding(text: string): Promise<number[]> {
//   const response = await fetch('https://api.jina.ai/v1/embeddings', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${config.jina.apiKey}`
//     },
//     body: JSON.stringify({
//       model: 'jina-clip-v2',
//       input: [text]
//     })
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(`Jina API Error: ${error.detail || response.statusText}`);
//   }

//   const data: JinaEmbeddingResponse = await response.json();
//   return data.data[0].embedding;
// }

// async function generateAnswer(question: string, context: any[]) {
//   const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${config.deepseek.apiKey}`
//     },
//     body: JSON.stringify({
//       model: 'deepseek-chat',
//       messages: [{
//         role: 'system',
//         content: `Answer using this context:\n${JSON.stringify(context)}\n\nIf unsure, say you don't know.`
//       }, {
//         role: 'user',
//         content: question
//       }],
//       temperature: 0.7
//     })
//   });

//   if (!response.ok) {
//     const error = await response.json();
//     throw new Error(`DeepSeek API Error: ${error.error?.message || response.statusText}`);
//   }

//   const data: DeepSeekResponse = await response.json();
//   return data.choices[0].message.content;
// }

// function formatSuccessResponse(answer: string, context: any[]) {
//   return NextResponse.json({
//     answer,
//     context
//   }, {
//     headers: { 'Content-Type': 'application/json' }
//   });
// }

// function handleError(error: unknown) {
//   const message = error instanceof Error ? error.message : 'Unknown error';
//   console.error('RAG Error:', message);
//   return NextResponse.json(
//     { error: message },
//     { status: 500 }
//   );
// }

// export function OPTIONS() {
//   return new NextResponse(null, {
//     headers: {
//       'Access-Control-Allow-Origin': '*',
//       'Access-Control-Allow-Methods': 'POST, OPTIONS',
//       'Access-Control-Allow-Headers': 'Content-Type'
//     }
//   });
// }

// app/api/route.ts
import { NextResponse } from 'next/server';
import { astraClient } from '@/lib/astra';
import { config } from '@/lib/config';

interface JinaEmbeddingResponse {
  data: Array<{ embedding: number[] }>;
}

interface DeepSeekResponse {
  choices: Array<{ message: { content: string } }>;
}

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    const { embedding, context } = await processQuery(question);
    const answer = await generateAnswer(question, context);
    
    return NextResponse.json({
      answer,
      contextSources: context
    }, {
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    });
    
  } catch (error) {
    return handleError(error);
  }
}

async function processQuery(question: string) {
  const embedding = await getJinaEmbedding(question);
  const collection = await astraClient.getCollection();
  
  const results = await collection.find({}, {
    sort: { $vector: embedding },
    limit: 3,
    includeSimilarity: true
  });

  const context = (await results.toArray()).map(doc => ({
    text: doc.text.slice(0, 150) + '...',
    similarity: Math.round(doc.$similarity * 100)
  }));

  return { embedding, context };
}

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
    const error = await response.json();
    throw new Error(`Jina API Error: ${error.detail || response.statusText}`);
  }

  const data: JinaEmbeddingResponse = await response.json();
  return data.data[0].embedding;
}

async function generateAnswer(question: string, context: any[]) {
  const response = await fetch(`${config.deepseek.baseUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${config.deepseek.apiKey}`
    },
    body: JSON.stringify({
      model: 'deepseek-chat',
      messages: [{
        role: 'system',
        content: `Answer using this context:\n${JSON.stringify(context)}\n\nIf unsure, say you don't know.`
      }, {
        role: 'user',
        content: question
      }],
      temperature: 0.7,
      max_tokens: 500
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`DeepSeek API Error: ${error.error?.message || response.statusText}`);
  }

  const data: DeepSeekResponse = await response.json();
  return data.choices[0].message.content;
}

function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error('RAG Error:', message);
  return NextResponse.json(
    { error: message },
    { 
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      }
    }
  );
}

export function OPTIONS() {
  return new NextResponse(null, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    }
  });
}