// import { useForm } from 'react-hook-form';
// import { useState } from 'react';

// type FormData = {
//   question: string;
// };

// export default function RAGForm() {
//   const [answer, setAnswer] = useState('');
//   const {
//     register,
//     handleSubmit,
//     formState: { errors, isSubmitting },
//   } = useForm<FormData>();

//   const onSubmit = async (data: FormData) => {
//     try {
//       const response = await fetch('/api/rag', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json'
//         },
//         body: JSON.stringify({ question: data.question })
//       });

//       const result = await response.json();
//       setAnswer(result.answer);
//     } catch (error) {
//       console.error('Error:', error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-4">
//       <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
//         <div>
//           <textarea
//             {...register('question', { required: 'Question is required' })}
//             className={`w-full p-2 border rounded ${
//               errors.question ? 'border-red-500' : 'border-gray-300'
//             }`}
//             placeholder="Enter your question..."
//             rows={4}
//           />
//           {errors.question && (
//             <p className="text-red-500 text-sm mt-1">
//               {errors.question.message}
//             </p>
//           )}
//         </div>
        
//         <button
//           type="submit"
//           disabled={isSubmitting}
//           className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed"
//         >
//           {isSubmitting ? 'Processing...' : 'Ask'}
//         </button>
//       </form>

//       {answer && (
//         <div className="mt-6 p-4 bg-gray-50 rounded">
//           <h3 className="text-lg font-semibold mb-2">Answer:</h3>
//           <p className="whitespace-pre-wrap">{answer}</p>
//         </div>
//       )}
//     </div>
//   );
// }

'use client';
import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  question: z.string().min(10, 'Question must be at least 10 characters')
});

export default function RAGForm() {
  const [answer, setAnswer] = useState('');
  const [contexts, setContexts] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm({
    resolver: zodResolver(formSchema)
  });
  const onSubmit = async (data: any) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/rag', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        throw new Error('Invalid response format');
      }
  
      const result = await response.json();
      setAnswer(result.answer);
      setContexts(result.contextSources);
      reset();
      
    } catch (error) {
      console.error('Submission error:', error);
      setAnswer('Sorry, we encountered an error processing your request');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <textarea
            {...register('question')}
            className={`w-full p-4 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 ${
              errors.question ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ask about SSPOT1..."
            rows={4}
            disabled={isLoading}
          />
          {errors.question && (
            <p className="mt-2 text-sm text-red-600">
              {errors.question.message?.toString()}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Analyzing...' : 'Ask Question'}
        </button>
      </form>

      {answer && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h3 className="text-xl font-semibold mb-4">Answer</h3>
          <p className="text-gray-700 whitespace-pre-wrap">{answer}</p>
          
          {contexts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-200">
              <h4 className="text-sm font-medium text-gray-500 mb-2">Sources</h4>
              <ul className="space-y-2">
                {contexts.map((context, index) => (
                  <li key={index} className="text-sm text-gray-600">
                    <span className="font-medium">Source {index + 1}:</span> 
                    <span className="ml-2">{context.text}</span>
                    <span className="ml-2 text-blue-600">
                      (Similarity: {Math.round(context.similarity * 100)}%)
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}