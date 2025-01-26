

'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

// Define interface for context sources
interface ContextSource {
  similarity: number;
  text: string;
}

const formSchema = z.object({
  question: z.string()
    .min(10, 'Question must be at least 10 characters')
    .max(500, 'Question too long (max 500 characters)')
});

// Infer TypeScript type from Zod schema
type FormData = z.infer<typeof formSchema>;

export default function RAGForm() {
  const [answer, setAnswer] = useState('');
  const [contexts, setContexts] = useState<ContextSource[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const { 
    register, 
    handleSubmit, 
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(formSchema)
  });

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Request failed: ${response.status}`);
      }

      const result = await response.json();
      setAnswer(result.answer);
      setContexts(result.contextSources);
      reset();

    } catch (error: unknown) {
      console.error('Submission error:', error);
      const message = error instanceof Error ? error.message : 'An unknown error occurred';
      setAnswer(`Error: ${message}`);
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
            className={`w-full p-4 border rounded-lg shadow-sm focus:ring-2 ${
              errors.question ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-blue-500'
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
          className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:hover:bg-blue-600"
        >
          {isLoading ? 'Processing...' : 'Ask Question'}
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
                  <li 
                    key={index}
                    className="text-sm text-gray-600 p-2 bg-gray-50 rounded"
                  >
                    <div className="flex justify-between">
                      <span className="font-medium">Source {index + 1}</span>
                      <span className="text-blue-600">
                        {context.similarity}% match
                      </span>
                    </div>
                    <p className="mt-1">{context.text}</p>
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