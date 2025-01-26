

// 'use client';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useState } from 'react';

// // Define interface for context sources
// interface ContextSource {
//   similarity: number;
//   text: string;
// }

// const formSchema = z.object({
//   question: z.string()
//     .min(10, 'Question must be at least 10 characters')
//     .max(500, 'Question too long (max 500 characters)')
// });

// // Infer TypeScript type from Zod schema
// type FormData = z.infer<typeof formSchema>;

// export default function RAGForm() {
//   const [answer, setAnswer] = useState('');
//   const [contexts, setContexts] = useState<ContextSource[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const { 
//     register, 
//     handleSubmit, 
//     formState: { errors },
//     reset
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema)
//   });

//   const onSubmit = async (data: FormData) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/rag', {
//         method: 'POST',
//         headers: { 
//           'Content-Type': 'application/json',
//           'Accept': 'application/json'
//         },
//         body: JSON.stringify(data)
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `Request failed: ${response.status}`);
//       }

//       const result = await response.json();
//       setAnswer(result.answer);
//       setContexts(result.contextSources);
//       reset();

//     } catch (error: unknown) {
//       console.error('Submission error:', error);
//       const message = error instanceof Error ? error.message : 'An unknown error occurred';
//       setAnswer(`Error: ${message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div>
//           <textarea
//             {...register('question')}
//             className={`w-full p-4 border rounded-lg shadow-sm focus:ring-2 ${
//               errors.question ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//             }`}
//             placeholder="Ask about SSPOT1..."
//             rows={4}
//             disabled={isLoading}
//           />
//           {errors.question && (
//             <p className="mt-2 text-sm text-red-600">
//               {errors.question.message?.toString()}
//             </p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-blue-600"
//         >
//           {isLoading ? 'Processing...' : 'Ask Question'}
//         </button>
//       </form>

//       {answer && (
//         <div className="mt-8 p-6 bg-white rounded-lg shadow">
//           <h3 className="text-xl font-semibold mb-4">Answer</h3>
//           <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
          
//           {contexts.length > 0 && (
//             <div className="mt-6 pt-4 border-t border-gray-200">
//               <h4 className="text-sm font-medium text-gray-500 mb-2">Sources</h4>
//               <ul className="space-y-2">
//                 {contexts.map((context, index) => (
//                   <li 
//                     key={index}
//                     className="text-sm text-gray-600 p-2 bg-gray-50 rounded"
//                   >
//                     <div className="flex justify-between">
//                       <span className="font-medium">Source {index + 1}</span>
//                       <span className="text-blue-600">
//                         {context.similarity}% match
//                       </span>
//                     </div>
//                     <p className="mt-1">{context.text}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// 'use client';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useState } from 'react';

// interface ContextSource {
//   similarity: number;
//   text: string;
// }

// const formSchema = z.object({
//   question: z
//     .string()
//     .min(10, 'Question must be at least 10 characters')
//     .max(500, 'Question too long (max 500 characters)'),
// });

// type FormData = z.infer<typeof formSchema>;

// export default function RAGForm() {
//   const [answer, setAnswer] = useState('');
//   const [contexts, setContexts] = useState<ContextSource[]>([]);
//   const [isLoading, setIsLoading] = useState(false);

//   const {
//     register,
//     handleSubmit,
//     formState: { errors },
//     reset,
//   } = useForm<FormData>({
//     resolver: zodResolver(formSchema),
//   });

//   const onSubmit = async (data: FormData) => {
//     setIsLoading(true);
//     try {
//       const response = await fetch('/api/rag', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           Accept: 'application/json',
//         },
//         body: JSON.stringify(data),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || `Request failed: ${response.status}`);
//       }

//       const result = await response.json();
//       setAnswer(result.answer);
//       setContexts(result.contextSources);
//       reset();
//     } catch (error: unknown) {
//       console.error('Submission error:', error);
//       const message = error instanceof Error ? error.message : 'An unknown error occurred';
//       setAnswer(`Error: ${message}`);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-6">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
//         <div>
//           <textarea
//             {...register('question')}
//             className={`w-full p-4 border rounded-lg shadow-sm focus:ring-2 ${
//               errors.question ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
//             }`}
//             placeholder="Ask about SSPOT1..."
//             rows={4}
//             disabled={isLoading}
//           />
//           {errors.question && (
//             <p className="mt-2 text-sm text-red-600">{errors.question.message?.toString()}</p>
//           )}
//         </div>

//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-blue-600"
//         >
//           {isLoading ? 'Processing...' : 'Ask Question'}
//         </button>
//       </form>

//       {answer && (
//         <div className="mt-8 p-6 bg-white rounded-lg shadow">
//           <h3 className="text-xl font-semibold mb-4">Answer</h3>
//           <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>

//           {contexts.length > 0 && (
//             <div className="mt-6 pt-4 border-t border-gray-200">
//               <h4 className="text-sm font-medium text-gray-500 mb-2">Sources</h4>
//               <ul className="space-y-2">
//                 {contexts.map((context, index) => (
//                   <li key={index} className="text-sm text-gray-600 p-2 bg-gray-50 rounded">
//                     <div className="flex justify-between">
//                       <span className="font-medium">Source {index + 1}</span>
//                       <span className="text-blue-600">{context.similarity}% match</span>
//                     </div>
//                     <p className="mt-1">{context.text}</p>
//                   </li>
//                 ))}
//               </ul>
//             </div>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// 'use client';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from '@hookform/resolvers/zod';
// import { z } from 'zod';
// import { useState } from 'react';

// const formSchema = z.object({
//   query: z.string()
//     .min(10, 'Query must be 10-500 characters')
//     .max(500)
// });

// type FormValues = z.infer<typeof formSchema>;

// export default function RagForm() {
//   const [response, setResponse] = useState<{
//     answer?: string;
//     error?: string;
//     context?: string[];
//   }>();
  
//   const { register, handleSubmit, formState } = useForm<FormValues>({
//     resolver: zodResolver(formSchema)
//   });

//   const submitHandler = async ({ query }: FormValues) => {
//     setResponse(undefined);
    
//     try {
//       const res = await fetch('/api/rag', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ question: query })
//       });

//       const data = await res.json();
//       setResponse(res.ok ? data : { error: data.error });
//     } catch (error) {
//       setResponse({ error: 'Failed to connect to the server' });
//     }
//   };

//   return (
//     <div className="max-w-3xl mx-auto p-4 space-y-6">
//       <form onSubmit={handleSubmit(submitHandler)} className="space-y-4">
//         <textarea
//           {...register('query')}
//           className={`w-full p-3 border rounded-lg focus:ring-2 ${
//             formState.errors.query ? 'border-red-500 ring-red-200' : 'border-gray-300 ring-blue-200'
//           }`}
//           placeholder="Ask about SSPOT1..."
//           rows={4}
//           disabled={formState.isSubmitting}
//         />
        
//         <button
//           type="submit"
//           disabled={formState.isSubmitting}
//           className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
//         >
//           {formState.isSubmitting ? 'Processing...' : 'Ask Question'}
//         </button>
//       </form>

//       {response && (
//         <div className="p-4 bg-white rounded-lg shadow">
//           {response.error ? (
//             <div className="text-red-600">
//               Error: {response.error}
//             </div>
//           ) : (
//             <>
//               <div className="mb-4">
//                 <h3 className="text-lg font-semibold mb-2">Answer</h3>
//                 <p className="text-gray-700 whitespace-pre-wrap">
//                   {response.answer}
//                 </p>
//               </div>
              
//               {response.context && (
//                 <div className="pt-4 border-t border-gray-200">
//                   <h4 className="text-sm font-medium text-gray-500 mb-2">
//                     Supporting Context
//                   </h4>
//                   <ul className="space-y-2 text-sm">
//                     {response.context.map((text, i) => (
//                       <li key={i} className="p-2 bg-gray-50 rounded">
//                         {text}
//                       </li>
//                     ))}
//                   </ul>
//                 </div>
//               )}
//             </>
//           )}
//         </div>
//       )}
//     </div>
//   );
// }

// components/RagForm.tsx
'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

const formSchema = z.object({
  query: z.string()
    .min(10, 'Question must be at least 10 characters')
    .max(500, 'Question too long')
});

type FormValues = z.infer<typeof formSchema>;

interface ContextItem {
  text: string;
  similarity: number;
}

export default function RagForm() {
  const [response, setResponse] = useState<{
    answer?: string;
    error?: string;
    context?: ContextItem[];
  }>();
  
  const { register, handleSubmit, formState } = useForm<FormValues>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async ({ query }: FormValues) => {
    setResponse(undefined);
    
    try {
      const res = await fetch('/api/rag', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: query })
      });

      const data = await res.json();
      setResponse(res.ok ? data : { error: data.error });
    } catch (error) {
      setResponse({ error: 'Failed to connect to server' });
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <textarea
          {...register('query')}
          className={`w-full p-4 border rounded-lg focus:ring-2 ${
            formState.errors.query ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="Ask about SSPOT1..."
          rows={4}
          disabled={formState.isSubmitting}
        />
        
        <button
          type="submit"
          disabled={formState.isSubmitting}
          className="w-full p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
        >
          {formState.isSubmitting ? 'Processing...' : 'Ask Question'}
        </button>
      </form>

      {response && (
        <div className="p-6 bg-white rounded-lg shadow">
          {response.error ? (
            <div className="text-red-600 p-4 rounded bg-red-50">
              Error: {response.error}
            </div>
          ) : (
            <>
              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-2">Answer</h3>
                <p className="text-gray-700 whitespace-pre-wrap">
                  {response.answer}
                </p>
              </div>
              
              {response.context && response.context.length > 0 && (
                <div className="pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-medium text-gray-500 mb-2">
                    Context Sources
                  </h4>
                  <ul className="space-y-3">
                    {response.context.map((item, index) => (
                      <li 
                        key={index}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex justify-between mb-1">
                          <span className="font-medium">Source {index + 1}</span>
                          <span className="text-blue-600">
                            {item.similarity}% match
                          </span>
                        </div>
                        <p className="text-gray-600 text-sm">{item.text}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}