/** Shared shape for OpenAI-compatible chat completion responses. */
export type ChatCompletionResult = {
  content: string;
  totalTokens?: number;
};
