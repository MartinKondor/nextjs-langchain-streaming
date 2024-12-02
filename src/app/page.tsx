"use client";

import { MessageCircle, PlayCircle } from "lucide-react";
import { useState } from "react";

import { CustomEventParser } from "./lib/custom-parser";
import { ChatMessageModel } from "./lib/types";

export default function Home() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<ChatMessageModel | undefined>();
  const controller = new AbortController();

  const handleStart = async () => {
    setIsLoading(true);
    setMessage(undefined);

    try {
      const formData = new FormData();
      const body = JSON.stringify({
        id: "1",
        message:
          "Hey! Please tell me 5 jokes about animals. Ensure they're funny and child-friendly.",
      });
      formData.append("content", body);

      const response = await fetch("/api/stream", {
        method: "POST",
        body: formData,
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        throw new Error("Failed to fetch");
      }

      const parser = new CustomEventParser("default-thread", "Assistant");
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
          try {
            const chunkValue = decoder.decode(value);
            const parsed = await parser.parse(chunkValue);
            setMessage(parsed);
          } catch (error) {}
        }
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
          LangChain Streaming POC
        </h1>

        <button
          onClick={handleStart}
          disabled={isLoading}
          className={`
            w-full py-3 px-4 flex items-center justify-center gap-2
            bg-blue-600 hover:bg-blue-700 text-white font-medium
            rounded-lg transition-colors duration-200
            disabled:opacity-50 disabled:cursor-not-allowed
          `}
        >
          <PlayCircle className="w-5 h-5" />
          {isLoading ? "Processing..." : "Start"}
        </button>
      </div>
      <div className="max-w-[450px]">
        <div className="text-gray-500 font-semibold text-xl mt-16 flex flex-col gap-4">
          {message && (
            <div className="flex items-start gap-2">
              <MessageCircle className="w-5 h-5 mt-1" />
              <div>
                <div className="text-sm text-gray-400">{message.role}</div>
                <p>{message.content}</p>
                <br />
                <pre>{JSON.stringify(message, null, 2)}</pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
