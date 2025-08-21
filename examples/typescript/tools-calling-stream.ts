import { OpenAI } from "openai";

const openai = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1',
  apiKey: '<ZENMUX_API_KEY>',
});

const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [{
    type: "function",
    function: {
        name: "get_weather",
        description: "获取提供坐标的当前温度（摄氏度）。",
        parameters: {
            type: "object",
            properties: {
                latitude: { type: "number" },
                longitude: { type: "number" }
            },
            required: ["latitude", "longitude"],
            additionalProperties: false
        },
        strict: true,
    },
}];

async function main() {
  const stream = await openai.chat.completions.create({
      model: "moonshotai/kimi-k2",
      messages: [{ role: "user", content: "巴黎今天的天气怎么样？" }],
      tools,
      stream: true,
  });

  const finalToolCalls: OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall[]  = [];

  for await (const event of stream) {
      const delta = event.choices[0].delta;
      if (delta.tool_calls && delta.tool_calls.length > 0) {
          const toolCall = delta.tool_calls[0] as OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall & {index: number};
          if (toolCall.type === "function") {
              finalToolCalls[toolCall.index] = toolCall;
          } else {
              finalToolCalls[toolCall.index].function.arguments += toolCall.function.arguments;
          }
      }
  }

  console.log("最终工具调用:");
  console.log(JSON.stringify(finalToolCalls, null, 2));
}

main();
