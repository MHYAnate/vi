// app/page.tsx
"use client";
import { useState, useRef, useEffect } from "react";
import RagForm from "@/components/RagForm";
import FeaturesComponent from "@/components/features";
import FooterComponent from "@/components/footer";

export default  function Home() {

// export default async function Home() {
	// await initializeApplication();

  	const [qNav, setQNav] = useState("");

	const q1 = useRef<HTMLDivElement>(null);
  const q2 = useRef<HTMLDivElement>(null);

  const qView1 = () => q1.current?.scrollIntoView({ behavior: "smooth" });

  const qView2 = () => q2.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
		if (qNav === "features") {
			qView1();
		}
    if (qNav === "header") {
			qView2();
		}
	}, [qNav, setQNav]);

	return (
		<main ref={q2} className="flex flex-col">
			<RagForm setQNav={setQNav} qNav={qNav} />
      <div ref={q1}>
      <FeaturesComponent />
      </div>
			<FooterComponent setQNav={setQNav} qNav={qNav} />
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
