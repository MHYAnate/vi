"use client";

import { useChat } from "ai/react";
import { ChatMessage } from "@/components/chat-message";


export function Chat() {
  const { messages, input, append, handleInputChange, handleSubmit, isLoading } =
    useChat();

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <div className="flex-1 overflow-y-auto p-4">
        {messages.map((message) => (
          <ChatMessage
          id={message.id}
            key={message.id}
            role={message.role === "user"? "user" : "assistant" }
            content={message.content}
          />
        ))}
      </div>
      <form onSubmit={handleSubmit} className="border-t p-4">
        <div className="flex gap-4">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Ask a question..."
            className="flex-1 rounded-lg border px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? (
              "Thinking..."
            ) : (
              <>
                Send 
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}