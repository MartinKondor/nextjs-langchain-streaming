import { z } from "zod";

export const environmentSchema = z.object({
  DEFAULT_LLM: z.string(),
  AZURE_OPENAI_API_DEPLOYMENT_NAME: z.string(),
  AZURE_OPENAI_API_KEY: z.string(),
  AZURE_OPENAI_API_INSTANCE_NAME: z.string(),
  AZURE_OPENAI_API_VERSION: z.string(),
});

export type Environment = z.infer<typeof environmentSchema>;
export const env = environmentSchema.parse(process.env);
