import { NextRequest, NextResponse } from "next/server";

import { getDefaultModel, getLangChainModel } from "@/app/lib/llm-config";
import { ChatPromptTemplate } from "@langchain/core/prompts";

const encoder = new TextEncoder();

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const content = JSON.parse(formData.get("content") as string) as {
    id: string;
    message: string;
  };

  if (!content.id || !content.message) {
    return new NextResponse("Invalid request", { status: 400 });
  }

  const model = getLangChainModel(getDefaultModel());
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful assistant. Use the tools provided to best assist the user.`,
    ],
    ["human", content.message],
  ]);

  const stream = new TransformStream();
  const writer = stream.writable.getWriter();
  const encoder = new TextEncoder();
  const chain = prompt.pipe(model);

  (async () => {
    try {
      const llmStream = await chain.stream({
        signal: request.signal,
        callbacks: [
          {
            handleLLMStart: () => {
              console.log("Start streaming:", new Date().toISOString());
            },
            handleLLMEnd: async (output: any) => {
              console.log("End streaming:", new Date().toISOString());
            },
            handleLLMError: async (error: Error) => {
              console.error("Streaming error:", error);
            },
          },
        ],
      });

      for await (const chunk of llmStream) {
        console.log("Chunk:", chunk);
        await writer.write(encoder.encode(JSON.stringify(chunk)));
      }
    } catch (error) {
      console.error("Stream error:", error);
    } finally {
      await writer.close();
    }
  })();

  return new NextResponse(stream.readable, {
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
