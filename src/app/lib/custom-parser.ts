import { BaseOutputParser } from "@langchain/core/output_parsers";

import { ChatResponseEvent } from "./types";

export class CustomEventParser extends BaseOutputParser<ChatResponseEvent> {
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

  async parse(text: string): Promise<ChatResponseEvent> {
    const event = JSON.parse(text) as ChatResponseEvent;

    switch (event.type) {
      case "abort":
        console.warn("Abort event received");
        break;
      case "error":
        console.error("Error event received");
        break;
      case "finalContent":
        console.log("Final content event received");
        break;
      default:
        break;
    }

    return event;
  }
}
