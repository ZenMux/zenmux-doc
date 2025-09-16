from openai import OpenAI
import json

client = OpenAI(
  base_url="https://zenmux.ai/api/v1",
  api_key="<ZENMUX_API_KEY>",
)

# 1. 为模型定义可调用工具列表
tools = [
    {
        "type": "function",
        "function": {
            "name": "get_horoscope",
            "description": "获取某个星座的今日运势。",
            "parameters": {
                "type": "object",
                "properties": {
                    "sign": {
                        "type": "string",
                        "description": "星座名称，如金牛座或水瓶座",
                    },
                },
                "required": ["sign"],
            },
        },
    },
]

# 创建消息列表，我们将随时间添加消息到其中
input_list = [
    {"role": "user", "content": "我的运势如何？我是水瓶座。"}
]

# 2. 使用定义的工具提示模型
response = client.chat.completions.create(
    model="moonshotai/kimi-k2",
    tools=tools,
    messages=input_list,
)

# 保存函数调用输出以供后续请求使用
function_call = None
function_call_arguments = None
input_list.append({
  "role": "assistant",
  "content": response.choices[0].message.content,
  "tool_calls": [tool_call.model_dump() for tool_call in response.choices[0].message.tool_calls] if response.choices[0].message.tool_calls else None,
})

for item in response.choices[0].message.tool_calls:
    if item.type == "function":
        function_call = item
        function_call_arguments = json.loads(item.function.arguments)

def get_horoscope(sign):
    return f"{sign}：下周二你将结识一只小水獺。"

# 3. 执行 get_horoscope 的函数逻辑
result = {"horoscope": get_horoscope(function_call_arguments["sign"])}

# 4. 向模型提供函数调用结果
input_list.append({
    "role": "tool",
    "tool_call_id": function_call.id,
    "name": function_call.function.name,
    "content": json.dumps(result),
})

print("最终输入:")
print(json.dumps(input_list, indent=2, ensure_ascii=False))

response = client.chat.completions.create(
    model="moonshotai/kimi-k2",
    tools=tools,
    messages=input_list,
)

# 5. 模型现在应该能够给出响应！
print("最终输出:")
print(response.model_dump_json(indent=2))
print("\n" + response.choices[0].message.content)