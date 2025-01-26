// // "use client"

// // import React, { useState, useRef, useEffect } from 'react';
// // import {useChat} from "ai/react"
// // import { Message } from 'ai';

// // interface Msg {
// //   id: string;
// //   content: string;
// //   sender: 'user' | 'ai';
// //   timestamp: Date;
// // }

// // const IconSend = () => (
// //   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
// //   </svg>
// // );

// // const IconUser = () => (
// //   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-2 text-blue-500">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
// //   </svg>
// // );

// // const IconAI = () => (
// //   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4 mr-2 text-green-500">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
// //   </svg>
// // );

// // const IconSparkles = () => (
// //   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 mr-2 text-yellow-500">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
// //   </svg>
// // );

// // const IconClose = () => (
// //   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
// //   </svg>
// // );

// // const IconChevronDown = () => (
// //   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5">
// //     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
// //   </svg>
// // );

// // export default function Page() {

// //   const [messages, setMessages] = useState<Msg[]>([]);
// //   const [inputValue, setInputValue] = useState('');
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [showScrollButton, setShowScrollButton] = useState(false);
// //   const messagesEndRef = useRef<HTMLDivElement>(null);
// //   const chatContainerRef = useRef<HTMLDivElement>(null);

// //   const scrollToBottom = () => {
// //     messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
// //   };

// //   useEffect(() => {
// //     scrollToBottom();
// //     const chatContainer = chatContainerRef.current;
// //     if (chatContainer) {
// //       const handleScroll = () => {
// //         const { scrollTop, scrollHeight, clientHeight } = chatContainer;
// //         setShowScrollButton(scrollHeight - scrollTop - clientHeight > 100);
// //       };
// //       chatContainer.addEventListener('scroll', handleScroll);
// //       return () => chatContainer.removeEventListener('scroll', handleScroll);
// //     }
// //   }, [messages]);

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     if (!inputValue.trim()) return;

// //     const userMessage: Msg = {
// //       id: Date.now().toString(),
// //       content: inputValue,
// //       sender: 'user',
// //       timestamp: new Date(),
// //     };

// //     setMessages(prev => [...prev, userMessage]);
// //     setInputValue('');
// //     setIsLoading(true);

// //     // Simulate API call for RAG response
// //     setTimeout(() => {  
// //       const aiMessage: Msg = {
// //         id: (Date.now() + 1).toString(),
// //         content: "This is a simulated response from Sspot1 Q.Q AI. In a real implementation, this would be generated based on the user's query and relevant retrieved information.",
// //         sender: 'ai',
// //         timestamp: new Date(),
// //       };
// //       setMessages(prev => [...prev, aiMessage]);
// //       setIsLoading(false);
// //     }, 1500);
// //   };

// //   return (
// //     <div className="flex flex-col h-screen bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
// //       {/* Chat Header */}
// //       <header className="bg-white dark:bg-gray-800 shadow-lg p-4 flex items-center justify-between">
// //         <h1 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center">
// //           <IconSparkles />
// //           Sspot1 Q & A_A.I
// //         </h1>
// //         <button className="text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-white transition-colors duration-200">
// //           <IconClose />
// //         </button>
// //       </header>

// //       {/* Chat Messages */}
// //       <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200 dark:scrollbar-thumb-gray-600 dark:scrollbar-track-gray-700">
// //         {messages.map((message) => (
// //           <div
// //             key={message.id}
// //             className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in-up`}
// //           >
// //             <div
// //               className={`
// //                 max-w-[70%] p-3 rounded-lg shadow-md backdrop-blur-sm
// //                 ${message.sender === 'user'
// //                   ? 'bg-black bg-opacity-80 text-white rounded-br-none'
// //                   : 'bg-white dark:bg-gray-700 bg-opacity-80 text-gray-800 dark:text-white rounded-bl-none'
// //                 }
// //                 transition-all duration-300 ease-in-out hover:shadow-lg
// //               `}
// //             >
// //               <div className="flex items-center mb-1">
// //                 {message.sender === 'user' ? <IconUser /> : <IconAI />}
// //                 <span className="text-xs opacity-50">
// //                   {message.timestamp.toLocaleTimeString()}
// //                 </span>
// //               </div>
// //               <p className="text-sm leading-relaxed">{message.content}</p>
// //             </div>
// //           </div>
// //         ))}
// //         <div ref={messagesEndRef} />
// //       </div>

// //       {/* Input Area */}
// //       <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 shadow-lg">
// //         <div className="flex items-center space-x-2">
// //           <input
// //             type="text"
// //             value={inputValue}
// //             onChange={(e) => setInputValue(e.target.value)}
// //             placeholder="Type your question..."
// //             className="flex-1 p-3 rounded-full border border-gray-300 dark:border-gray-600 bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-black dark:focus:ring-white transition-all duration-300 ease-in-out placeholder-gray-500 dark:placeholder-gray-400"
// //           />
// //           <button
// //             type="submit"
// //             disabled={isLoading}
// //             className="bg-black dark:bg-white text-white dark:text-black rounded-full p-3 hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-all duration-300 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95"
// //           >
// //             {isLoading ? (
// //               <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //               </svg>
// //             ) : (
// //               <IconSend />
// //             )}
// //           </button>
// //         </div>
// //       </form>

// //       {/* Scroll to Bottom Button */}
// //       {showScrollButton && (
// //         <button
// //           onClick={scrollToBottom}
// //           className="fixed bottom-20 right-4 bg-black dark:bg-white text-white dark:text-black rounded-full p-2 hover:bg-gray-800 dark:hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black dark:focus:ring-white transition-all duration-300 ease-in-out shadow-lg transform hover:scale-110 active:scale-95"
// //         >
// //           <IconChevronDown />
// //         </button>
// //       )}
// //     </div>
// //   );
// // }

// // import RAGForm from '@/components/deepseek/ragForm';
// // import { initializeCollection } from '@/lib/astra';

// // export default async function Home() {
// //   await initializeCollection();
  
// //   return (
// //     <main className="min-h-screen bg-gray-50 py-12">
// //       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
// //         <div className="text-center mb-12">
// //           <h1 className="text-4xl font-bold text-gray-900 mb-4">
// //             SSPOT1 Knowledge Assistant
// //           </h1>
// //           <p className="text-xl text-gray-600">
// //             Powered by DeepSeek AI and Astra DB
// //           </p>
// //         </div>
// //         <RAGForm />
// //       </div>
// //     </main>
// //   );
// // }

// import RAGForm from '@/components/RagForm';
// import { initializeCollection } from '@/lib/astra';



// export default async function Home() {
//   try {
//     await initializeCollection();
//   } catch (error) {
//     console.error('DB initialization error:', error);
//   }

//   return (
    
//       <main className="min-h-screen bg-gray-50 py-12">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="text-center mb-12">
//             <h1 className="text-4xl font-bold text-gray-900 mb-4">
//               SSPOT1 Knowledge Base
//             </h1>
//             <p className="text-xl text-gray-600">
//               AI-powered technical support assistant
//             </p>
//           </div>
//           <RAGForm />
//         </div>
//       </main>
  
//   );
// }

import RAGForm from '@/components/RagForm';
import { initializeCollection } from '@/lib/astra';

export default async function Home() {
  try {
    await initializeCollection();
  } catch (error) {
    console.error('DB initialization error:', error);
  }

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">SSPOT1 Knowledge Base</h1>
          <p className="text-xl text-gray-600">AI-powered technical support assistant</p>
        </div>
        <RAGForm />
      </div>
    </main>
  );
}