import { BaseOutputParser } from "@langchain/core/output_parsers";

import { ChatMessageModel } from "./types";

export type ParsedEventType = {
  type:
    | "functionCall"
    | "functionCallResult"
    | "content"
    | "abort"
    | "error"
    | "finalContent";
  response: ChatMessageModel;
};

export class CustomEventParser extends BaseOutputParser<ChatMessageModel> {
  private chatThreadId: string;
  private appName: string;

  constructor(chatThreadId: string, appName: string) {
    super();
    this.chatThreadId = chatThreadId;
    this.appName = appName;
  }

  lc_namespace = ["custom", "event"];

  getFormatInstructions(): string {
    return "Format as JSON with type and response fields.";
  }

  async parse(text: string): Promise<ChatMessageModel> {
    // TODO: Return events (ParsedEventType) instead of the chat message model
    const event = JSON.parse(text) as ChatMessageModel;
    return event;
  }
}
