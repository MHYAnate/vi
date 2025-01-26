
import RagForm from '@/components/RagForm';
// import { SSPOT1Scraper } from '@/lib/scraper';

import { loadSampleData } from '@/lib/scraper';

export default async function Home() {
  // await initializeApplication();

  await loadSampleData();
  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            SSPOT1 Knowledge Base
          </h1>
          <p className="text-xl text-gray-600">
            Real-time API Documentation Assistant
          </p>
        </header>
        <RagForm />
      </div>
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

// async function storeChunksInAstra(collection: any, chunks: string[]) {
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