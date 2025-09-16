import OpenAI from "openai";
const openai = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1',
  apiKey: '<ZENMUX_API_KEY>',
});

// 1. 为模型定义可调用工具列表
const tools: OpenAI.Chat.Completions.ChatCompletionTool[] = [
  {
    type: "function",
    function: {
      name: "get_horoscope",
      description: "获取某个星座的今日运势。",
      parameters: {
        type: "object",
        properties: {
          sign: {
            type: "string",
            description: "星座名称，如金牛座或水瓶座",
          },
        },
        required: ["sign"],
      },
    },
  },
];

// 创建消息列表，我们将随时间添加消息到其中
let input: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
  { role: "user", content: "我的运势如何？我是水瓶座。" },
];

async function main() {
  // 2. 使用有工具调用能力的模型
  let response = await openai.chat.completions.create({
    model: "moonshotai/kimi-k2",
    tools,
    messages: input,
  });

  // 保存函数调用输出以供后续请求使用
  let functionCall: OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall | undefined;
  let functionCallArguments: Record<string, string> | undefined;
  input = input.concat(response.choices.map((c) => c.message));

  response.choices.forEach((item) => {
    if (item.message.tool_calls && item.message.tool_calls.length > 0) {
      functionCall = item.message.tool_calls[0] as OpenAI.Chat.Completions.ChatCompletionMessageFunctionToolCall;
      functionCallArguments = JSON.parse(functionCall.function.arguments) as Record<string, string>;
    }
  });

  // 3. 执行 get_horoscope 的函数逻辑
  function getHoroscope(sign: string) {
    return sign + " 下周二你将结识一只小水獺。";
  }

  if (!functionCall || !functionCallArguments) {
    throw new Error("模型没有返回函数调用");
  }

  const result = { horoscope: getHoroscope(functionCallArguments.sign) };

  // 4. 向模型提供函数调用结果
  input.push({
    role: 'tool',
    tool_call_id: functionCall.id,
    // @ts-expect-error must have name
    name: functionCall.function.name,
    content: JSON.stringify(result),
  });
  console.log("最终输入:");
  console.log(JSON.stringify(input, null, 2));

  response = await openai.chat.completions.create({
    model: "moonshotai/kimi-k2",
    tools,
    messages: input,
  });

  // 5. 模型现在应该能够给出响应！
  console.log("最终输出:");
  console.log(JSON.stringify(response.choices.map(v => v.message), null, 2));
}

main();
