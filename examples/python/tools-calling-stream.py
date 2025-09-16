from openai import OpenAI

client = OpenAI(
  base_url="https://zenmux.ai/api/v1",
  api_key="<ZENMUX_API_KEY>",
)

tools = [{
    "type": "function",
    "function": {
        "name": "get_weather",
        "description": "获取给定位置的当前温度。",
        "parameters": {
            "type": "object",
            "properties": {
                "location": {
                    "type": "string",
                    "description": "城市和国家，例如 波哥大, 哥伦比亚"
                }
            },
            "required": [
                "location"
            ],
            "additionalProperties": False
        }
    }
}]

stream = client.chat.completions.create(
    model="moonshotai/kimi-k2",
    messages=[{"role": "user", "content": "巴黎今天的天气怎么样？"}],
    tools=tools,
    stream=True
)

final_tool_calls = {}

for event in stream:
    delta = event.choices[0].delta
    if delta.tool_calls and len(delta.tool_calls) > 0:
        tool_call = delta.tool_calls[0]
        if tool_call.type == "function":
            final_tool_calls[tool_call.index] = tool_call
        else:
            final_tool_calls[tool_call.index].function.arguments += tool_call.function.arguments

print("最终工具调用:")
for index, tool_call in final_tool_calls.items():
    print(f"Tool Call {index}:")
    print(tool_call.model_dump_json(indent=2))
