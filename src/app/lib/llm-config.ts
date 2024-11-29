import { AzureChatOpenAI } from "@langchain/openai";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { IterableReadableStream } from "@langchain/core/utils/stream";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { env } from "../env";

export type LangChainMessage = HumanMessage | SystemMessage | AIMessage;
export type LangChainModel = AzureChatOpenAI;
export type LangChainStream = IterableReadableStream<any>;

export const getDefaultModel = () =>
  env.DEFAULT_LLM ?? env.AZURE_OPENAI_API_DEPLOYMENT_NAME ?? "gpt-4o";

// TODO: Add new models with dynamic modelId
export const getLangChainModel = (modelId: string) => {
  const model = new AzureChatOpenAI({
    streaming: true,
    temperature: 1.0,
    azureOpenAIApiKey: env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiInstanceName: env.AZURE_OPENAI_API_INSTANCE_NAME,
    azureOpenAIApiDeploymentName: env.AZURE_OPENAI_API_DEPLOYMENT_NAME,
    azureOpenAIApiVersion: env.AZURE_OPENAI_API_VERSION,
  });
  return model.pipe(new StringOutputParser());
};
