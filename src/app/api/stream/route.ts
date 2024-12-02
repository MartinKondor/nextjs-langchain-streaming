import { HumanMessage } from "@langchain/core/messages";
import { getDefaultModel, getLangChainModel } from "@/app/lib/llm-config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("POST /api/stream");
  console.log(request.body);

  const formData = await request.formData();
  const content = JSON.parse(formData.get("content") as string) as {
    id: string;
    message: string;
  };

  if (!content.id || !content.message) {
    return new NextResponse("Invalid request", { status: 400 });
  }

  const model = getLangChainModel(getDefaultModel());
  const messages = [new HumanMessage(content.message)];

  const stream = await model.stream(messages, {
    signal: request.signal,
    callbacks: [
      {
        handleLLMStart: () => {
          console.log("Start streaming:", new Date().toISOString());
        },
        handleLLMEnd: (output: any) => {
          console.log("End streaming:", new Date().toISOString());
        },
      },
    ],
  });
  return new NextResponse(stream, {
    status: 200,
    headers: {
      "Content-Type": "text/event-stream",
      Connection: "keep-alive",
      "Cache-Control": "no-cache, no-transform",
    },
  });
}
