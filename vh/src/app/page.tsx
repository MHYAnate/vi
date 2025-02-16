// app/page.tsx
import RagForm from '@/components/RagForm';

// import {  SomeDoc } from '@datastax/astra-db-ts';


// interface VectorSchema extends SomeDoc {

//   metadata?: Record<string, unknown>;
// }

export default async function Home() {
  // await initializeApplication();
  return (
    <main>
      
       
        <RagForm />
     
    </main>
  );
}

// async function initializeApplication() {
//   try {
//     const scraper = new SSPOT1Scraper();
//     const { chunks } = await scraper.scrapeFreshData();
    
//     const collection = await astraClient.getCollection();
//     await storeChunksInAstra(collection, chunks);
//   } catch (error) {
//     console.error('Initialization error:', error);
//   }
// }

// async function storeChunksInAstra(collection: VectorSchema, chunks: string[]) {
//   for (const chunk of chunks) {
//     try {
//       const embedding = await getJinaEmbedding(chunk);
//       await collection.insertOne({
//         $vector: embedding,
//         text: chunk
//       });
//     } catch (error) {
//       console.error('Error storing chunk:', error);
//     }
//   }
// }

// async function getJinaEmbedding(text: string): Promise<number[]> {
//   const response = await fetch('https://api.jina.ai/v1/embeddings', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${process.env.JINA_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: 'jina-clip-v2',
//       input: [text]
//     })
//   });

//   if (!response.ok) throw new Error('Embedding failed');
//   const data = await response.json();
//   return data.data[0].embedding;
// }