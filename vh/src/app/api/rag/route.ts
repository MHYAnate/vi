// app/api/rag/route.ts
import { NextResponse } from 'next/server';
import { astraClient } from '@/lib/astra';


interface JinaEmbeddingResponse {
  data: Array<{ embedding: number[] }>;
}

interface DeepSeekResponse {
  choices: Array<{ message: { content: string } }>;
}

interface ContextItem {
  text: string;
  similarity: number;
}

export async function POST(req: Request) {
  try {
    const { question } = await req.json();
    const { context } = await processQuery(question);
    
    const answer = await generateAnswer(question, context);
    return formatSuccessResponse(answer, context);
    
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
      'Authorization': `Bearer ${"jina_b215f331b8e54727b7f41449fb0bacdbZj9-dOyxRkf-jTy6PzncMt2z3EFl"}`
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

const deepKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY

async function generateAnswer(question: string, context: ContextItem[]) {
  const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${deepKey}`
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
      temperature: 0.7
    })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(`DeepSeek API Error: ${error.error?.message || response.statusText}`);
  }

  const data: DeepSeekResponse = await response.json();
  return data.choices[0].message.content;
}

function formatSuccessResponse(answer: string, context: ContextItem[]) {
  return NextResponse.json({
    answer,
    context
  }, {
    headers: { 'Content-Type': 'application/json' }
  });
}

function handleError(error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  console.error('RAG Error:', message);
  return NextResponse.json(
    { error: message },
    { status: 500 }
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