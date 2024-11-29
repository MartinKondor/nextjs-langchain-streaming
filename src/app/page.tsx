"use client";

import { useState } from "react";
import { PlayCircle } from "lucide-react";

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);

  const handleStart = async () => {
    setIsLoading(true);

    try {
      // TODO: Implement streaming
      /* 
      const response = await fetch('/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      */
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
    </main>
  );
}
