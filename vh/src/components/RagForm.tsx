"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useRef, useEffect } from "react";
import Image from "next/image";

const formSchema = z.object({
	query: z
		.string()
		.min(10, "Question must be at least 10 characters")
		.max(500, "Question too long"),
});

type FormValues = z.infer<typeof formSchema>;

interface ContextItem {
	text: string;
	similarity: number;
}

interface Props {
	setQNav: (value: string) => void;
	qNav: string;
}

export default function RagForm({ setQNav, qNav }: Props) {
	const [response, setResponse] = useState<{
		answer?: string;
		error?: string;
		context?: ContextItem[];
	}>();
	const [chatHistory, setChatHistory] = useState<
		Array<{ type: "query" | "response"; content: string }>
	>([]);
	const chatEndRef = useRef<HTMLDivElement>(null);

	const { register, handleSubmit, formState, reset } = useForm<FormValues>({
		resolver: zodResolver(formSchema),
	});

	const onSubmit = async ({ query }: FormValues) => {
		setResponse(undefined);
		setChatHistory((prev) => [...prev, { type: "query", content: query }]);

		try {
			const res = await fetch("/api/rag", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ question: query }),
			});

			const data = await res.json();
			setResponse(res.ok ? data : { error: data.error });
			setChatHistory((prev) => [
				...prev,
				{ type: "response", content: res.ok ? data.answer : data.error },
			]);
		} catch (error) {
			console.log(error);
			setResponse({ error: "Failed to connect to server" });
			setChatHistory((prev) => [
				...prev,
				{ type: "response", content: "Failed to connect to server" },
			]);
		}
		reset();
	};

	useEffect(() => {
		chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [chatHistory]);

	return (
		<div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
			<header className="bg-white flex items-center justify-between gap-5 shadow-lg p-6 text-center">
				<div className={`relative w-10 h-10 overflow-hidden rounded-full`}>
					<Image
						src={"/ai.jpg"}
						alt="VSHub Logo"
						layout="fill"
						objectFit="cover"
						className="transition-transform duration-300 hover:scale-110"
					/>
				</div>

				<h1 className="cursor-pointer text-4xl font-bold font-[family-name:var(--ProtestGuerrilla)] text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2 hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-400 transition-all duration-300 hover:animate-[fadeInUp_1s_ease-in-out_forwards]">
        Sspot1 Q&A AI
      </h1>

				<div onClick={()=>setQNav(qNav!=="features"? "features":"")} className="cursor-pointer text-xl text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-2 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-pink-600 hover:to-purple-400  transition-colors duration-300 relative group">
					FEATURES
					<span className="absolute left-0 bottom-0 w-0 h-0.5 bg-gradient-to-r from-purple-400 to-pink-600 transition-all duration-300 group-hover:w-full"></span>
				</div>
			</header>

			<div className="flex-1 overflow-hidden flex flex-col">
				<div
					className="flex-1 overflow-y-auto p-6 space-y-4"
					id="chat-container"
				>
					{chatHistory.map((item, index) => (
						<div
							key={index}
							className={`flex ${
								item.type === "query" ? "justify-end" : "justify-start"
							} animate-fade-in-up`}
						>
							<div
								className={`max-w-[75%] p-4 rounded-2xl shadow-lg backdrop-blur-sm ${
									item.type === "query"
										? "bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-none"
										: "bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-bl-none"
								}`}
							>
								<p className="text-sm leading-relaxed">{item.content}</p>
							</div>
						</div>
					))}
					<div ref={chatEndRef} className="tranform translate-y-[-120px]" />
				</div>

				<div className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4">
					<form onSubmit={handleSubmit(onSubmit)} className="flex space-x-2">
						<div className="relative flex-1">
							<textarea
								{...register("query")}
								className={`w-full p-3 pr-12 border rounded-xl focus:ring-2 focus:ring-purple-400 dark:focus:ring-pink-400 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none ${
									formState.errors.query
										? "border-red-500"
										: "border-gray-300 dark:border-gray-600"
								}`}
								placeholder="Ask about SsPOT1..."
								rows={1}
								disabled={formState.isSubmitting}
							/>
							{formState.errors.query && (
								<p className="text-red-500 text-xs mt-1">
									{formState.errors.query.message}
								</p>
							)}
						</div>

						<button
							type="submit"
							disabled={formState.isSubmitting}
							className="p-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 disabled:opacity-50 transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-400 dark:focus:ring-pink-400"
						>
							{formState.isSubmitting ? (
								<svg
									className="animate-spin h-5 w-5"
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
								>
									<circle
										className="opacity-25"
										cx="12"
										cy="12"
										r="10"
										stroke="currentColor"
										strokeWidth="4"
									></circle>
									<path
										className="opacity-75"
										fill="currentColor"
										d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
									></path>
								</svg>
							) : (
								<svg
									className="h-5 w-5"
									fill="none"
									stroke="currentColor"
									viewBox="0 0 24 24"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										strokeWidth="2"
										d="M14 5l7 7m0 0l-7 7m7-7H3"
									></path>
								</svg>
							)}
						</button>
					</form>
				</div>
			</div>
			<div></div>

			{response && response.context && response.context.length > 0 && (
				<div className="bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 transition-all duration-300 ease-in-out">
					<h4 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
						Context Sources
					</h4>
					<div className="space-y-2 max-h-40 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
						{response.context.map((item, index) => (
							<div
								key={index}
								className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg text-sm transition-all duration-200 ease-in-out hover:shadow-md"
							>
								<div className="flex justify-between items-center mb-1">
									<span className="font-medium text-gray-700 dark:text-gray-300">
										Source {index + 1}
									</span>
									<span className="text-purple-600 dark:text-pink-400 font-semibold">
										{item.similarity}% match
									</span>
								</div>
								<p className="text-gray-600 dark:text-gray-400 line-clamp-2">
									{item.text}
								</p>
							</div>
						))}
					</div>
				</div>
			)}
			    <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .feature-card {
          opacity: 0;
        }
        .feature-visible {
          animation: fadeInUp 0.5s ease-out forwards;
        }
      `}</style>
		</div>
	);
}
