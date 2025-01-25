import { streamText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { queryDocuments } from '@/lib/embeddings';
import { NextResponse } from 'next/server';

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const lastMessage = messages[messages.length - 1];

    // Query relevant documents based on the user's question
    const relevantDocs = await queryDocuments(lastMessage.content);
    const context = relevantDocs.map(doc => doc.pageContent).join('\n\n');

    const result = await streamText({
      model: openai('gpt-4-turbo'),
      system: "You are a helpful AI assistant that answers questions based on the provided context. If the answer cannot be found in the context, say so clearly.",
      messages: [
        ...messages.slice(0, -1),
        {
          role: 'user',
          content: `Context: ${context}\n\nQuestion: ${lastMessage.content}`
        }
      ],
      temperature: 0.7,
      maxTokens: 500,
    });

    // Convert the stream to a Response object that can be returned from the API route
    return new Response(result.textStream, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
      },
    });
  } catch (error) {
    console.error('Error in chat route:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}