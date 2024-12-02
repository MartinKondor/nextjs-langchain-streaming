import { z } from "zod";

// Added some mock fields to see if the structured output works
export const ChatMessageModelSchema = z.object({
  id: z.string().describe("The unique identifier for the chat message."),
  content: z.string().describe("The content of the chat message."),
  name: z.string().describe("The name of the chat message."),
  role: z
    .enum(["function", "tool", "assistant", "system", "user"])
    .describe("The role of the chat message."),
  createdAt: z.date().describe("The creation date of the chat message."),
  isDeleted: z.boolean().describe("Whether the chat message is deleted."),
  threadId: z.string().describe("The thread identifier for the chat message."),
  type: z.literal("CHAT_MESSAGE").describe("The type of the chat message."),
  userId: z.string().describe("The user identifier for the chat message."),
  multiModalImage: z
    .string()
    .describe("The multi-modal image for the chat message."),
});

export type ChatMessageModel = z.infer<typeof ChatMessageModelSchema>;

export const ChatResponseEventSchema = z.object({
  type: z
    .enum([
      "functionCall",
      "functionCallResult",
      "content",
      "abort",
      "error",
      "finalContent",
    ])
    .describe("The type of the chat response event."),
  response: z.string().describe("The response of the chat response event."),
});

export type ChatResponseEvent = z.infer<typeof ChatResponseEventSchema>;
