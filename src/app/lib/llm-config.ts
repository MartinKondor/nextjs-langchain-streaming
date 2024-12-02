import {
  AIMessage,
  HumanMessage,
  SystemMessage,
} from "@langchain/core/messages";
import { AzureChatOpenAI } from "@langchain/openai";
import { env } from "../env";
import { ChatResponseEventSchema } from "./types";

export const getDefaultModel = () =>
  env.DEFAULT_LLM ?? env.AZURE_OPENAI_API_DEPLOYMENT_NAME ?? "gpt-4o";

// TODO: Add new models with dynamic modelId
export const getLangChainModel = (modelId: string) => {
  const model = new AzureChatOpenAI({
    streaming: true,
    topP: 1.0,
    temperature: 1.0,
    azureOpenAIApiKey: env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: env.AZURE_OPENAI_API_VERSION,
  });
  return model.withStructuredOutput(ChatResponseEventSchema);
};

export type LangChainMessage = HumanMessage | SystemMessage | AIMessage;

export type LangChainModel = AzureChatOpenAI;
