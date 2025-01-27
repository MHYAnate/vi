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