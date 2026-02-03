#!/usr/bin/env python3
"""
验证工具调用各协议的响应格式

打印完整的 API 响应结构，用于核对文档中的响应格式示例
"""

import os
import json
import sys

WEATHER_QUESTION = "北京今天的天气怎么样？"


def print_section(title: str):
    print(f"\n{'='*70}")
    print(f"  {title}")
    print(f"{'='*70}")


def test_chat_completion_response_format():
    """测试 Chat Completion API 响应格式"""
    print_section("Chat Completion API - 响应格式")
    
    try:
        from openai import OpenAI
        
        client = OpenAI(
            base_url="https://zenmux.ai/api/v1",
            api_key=os.environ.get("ZENMUX_API_KEY"),
        )
        
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "get_weather",
                    "description": "获取给定位置的当前天气",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "location": {"type": "string", "description": "城市名称"}
                        },
                        "required": ["location"]
                    }
                }
            }
        ]
        
        response = client.chat.completions.create(
            model="openai/gpt-4.1-nano",
            messages=[{"role": "user", "content": WEATHER_QUESTION}],
            tools=tools
        )
        
        message = response.choices[0].message
        
        print("\n【完整响应 (简化)】")
        print(json.dumps({
            "id": response.id,
            "model": response.model,
            "choices": [{
                "index": 0,
                "message": {
                    "role": message.role,
                    "content": message.content,
                    "tool_calls": [
                        {
                            "id": tc.id,
                            "type": tc.type,
                            "function": {
                                "name": tc.function.name,
                                "arguments": tc.function.arguments
                            }
                        } for tc in (message.tool_calls or [])
                    ] if message.tool_calls else None
                },
                "finish_reason": response.choices[0].finish_reason
            }]
        }, ensure_ascii=False, indent=2))
        
        if message.tool_calls:
            print("\n【tool_calls 结构】")
            for tc in message.tool_calls:
                print(json.dumps({
                    "id": tc.id,
                    "type": tc.type,
                    "function": {
                        "name": tc.function.name,
                        "arguments": tc.function.arguments
                    }
                }, ensure_ascii=False, indent=2))
        
        return True
    except Exception as e:
        print(f"错误: {e}")
        return False


def test_responses_api_response_format():
    """测试 Responses API 响应格式"""
    print_section("Responses API - 响应格式")
    
    try:
        from openai import OpenAI
        
        client = OpenAI(
            base_url="https://zenmux.ai/api/v1",
            api_key=os.environ.get("ZENMUX_API_KEY"),
        )
        
        tools = [
            {
                "type": "function",
                "name": "get_weather",
                "description": "获取给定位置的当前天气",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string", "description": "城市名称"}
                    },
                    "required": ["location"]
                }
            }
        ]
        
        response = client.responses.create(
            model="openai/gpt-5",
            input=WEATHER_QUESTION,
            tools=tools
        )
        
        print("\n【完整响应 (简化)】")
        output_items = []
        for item in response.output:
            if item.type == "function_call":
                output_items.append({
                    "type": item.type,
                    "call_id": item.call_id,
                    "name": item.name,
                    "arguments": item.arguments
                })
            elif item.type == "message":
                content_items = []
                for c in item.content:
                    if c.type == "output_text":
                        content_items.append({
                            "type": c.type,
                            "text": c.text[:100] + "..." if len(c.text) > 100 else c.text
                        })
                    else:
                        content_items.append({"type": c.type})
                output_items.append({
                    "type": item.type,
                    "role": item.role,
                    "content": content_items
                })
            else:
                output_items.append({"type": item.type})
        
        print(json.dumps({
            "id": response.id,
            "output": output_items
        }, ensure_ascii=False, indent=2))
        
        # 检查是否有 function_call
        function_calls = [item for item in response.output if item.type == "function_call"]
        if function_calls:
            print("\n【function_call 结构】")
            for fc in function_calls:
                print(json.dumps({
                    "type": fc.type,
                    "call_id": fc.call_id,
                    "name": fc.name,
                    "arguments": fc.arguments
                }, ensure_ascii=False, indent=2))
        
        return True
    except Exception as e:
        print(f"错误: {e}")
        return False


def test_anthropic_response_format():
    """测试 Anthropic Messages API 响应格式"""
    print_section("Anthropic Messages API - 响应格式")
    
    try:
        import anthropic
        
        client = anthropic.Anthropic(
            api_key=os.environ.get("ZENMUX_API_KEY"),
            base_url="https://zenmux.ai/api/anthropic"
        )
        
        tools = [
            {
                "name": "get_weather",
                "description": "获取给定位置的当前天气",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {"type": "string", "description": "城市名称"}
                    },
                    "required": ["location"]
                }
            }
        ]
        
        message = client.messages.create(
            model="anthropic/claude-sonnet-4.5",
            max_tokens=1024,
            tools=tools,
            messages=[{"role": "user", "content": WEATHER_QUESTION}]
        )
        
        print("\n【完整响应 (简化)】")
        content_items = []
        for block in message.content:
            if block.type == "text":
                content_items.append({
                    "type": block.type,
                    "text": block.text[:100] + "..." if len(block.text) > 100 else block.text
                })
            elif block.type == "tool_use":
                content_items.append({
                    "type": block.type,
                    "id": block.id,
                    "name": block.name,
                    "input": block.input
                })
            else:
                content_items.append({"type": block.type})
        
        print(json.dumps({
            "id": message.id,
            "model": message.model,
            "stop_reason": message.stop_reason,
            "content": content_items
        }, ensure_ascii=False, indent=2))
        
        # 检查是否有 tool_use
        tool_use_blocks = [b for b in message.content if b.type == "tool_use"]
        if tool_use_blocks:
            print("\n【tool_use 结构】")
            for block in tool_use_blocks:
                print(json.dumps({
                    "type": block.type,
                    "id": block.id,
                    "name": block.name,
                    "input": block.input
                }, ensure_ascii=False, indent=2))
        
        return True
    except Exception as e:
        print(f"错误: {e}")
        return False


def test_vertex_ai_response_format():
    """测试 Vertex AI API 响应格式"""
    print_section("Vertex AI API - 响应格式")
    
    try:
        from google import genai
        from google.genai import types
        
        client = genai.Client(
            api_key=os.environ.get("ZENMUX_API_KEY"),
            vertexai=True,
            http_options=types.HttpOptions(
                api_version='v1',
                base_url='https://zenmux.ai/api/vertex-ai'
            ),
        )
        
        get_weather_func = types.FunctionDeclaration(
            name="get_weather",
            description="获取给定位置的当前天气",
            parameters={
                "type": "object",
                "properties": {
                    "location": {"type": "string", "description": "城市名称"}
                },
                "required": ["location"]
            }
        )
        tools = types.Tool(function_declarations=[get_weather_func])
        
        response = client.models.generate_content(
            model="google/gemini-2.5-pro",
            contents=WEATHER_QUESTION,
            config=types.GenerateContentConfig(
                tools=[tools]
            )
        )
        
        print("\n【完整响应 (简化)】")
        
        # 解析 candidates
        candidates_data = []
        for candidate in response.candidates:
            parts_data = []
            for part in candidate.content.parts:
                if hasattr(part, 'function_call') and part.function_call:
                    parts_data.append({
                        "functionCall": {
                            "name": part.function_call.name,
                            "args": dict(part.function_call.args) if part.function_call.args else {}
                        }
                    })
                elif hasattr(part, 'text') and part.text:
                    parts_data.append({
                        "text": part.text[:100] + "..." if len(part.text) > 100 else part.text
                    })
            
            candidates_data.append({
                "content": {
                    "role": candidate.content.role,
                    "parts": parts_data
                }
            })
        
        print(json.dumps({
            "candidates": candidates_data
        }, ensure_ascii=False, indent=2))
        
        # 检查是否有 function_call
        if response.function_calls:
            print("\n【functionCall 结构】")
            for fc in response.function_calls:
                print(json.dumps({
                    "functionCall": {
                        "name": fc.name,
                        "args": dict(fc.args) if fc.args else {}
                    }
                }, ensure_ascii=False, indent=2))
        
        return True
    except Exception as e:
        print(f"错误: {e}")
        return False


def main():
    print("=" * 70)
    print("  工具调用响应格式验证")
    print("=" * 70)
    
    api_key = os.environ.get("ZENMUX_API_KEY")
    if not api_key:
        print("❌ 错误: 请设置 ZENMUX_API_KEY 环境变量")
        sys.exit(1)
    
    results = []
    
    # 1. Chat Completion
    results.append(("Chat Completion", test_chat_completion_response_format()))
    
    # 2. Responses API
    results.append(("Responses API", test_responses_api_response_format()))
    
    # 3. Anthropic
    results.append(("Anthropic", test_anthropic_response_format()))
    
    # 4. Vertex AI
    results.append(("Vertex AI", test_vertex_ai_response_format()))
    
    # 汇总
    print_section("验证汇总")
    for name, success in results:
        status = "✅" if success else "❌"
        print(f"  {status} {name}")


if __name__ == "__main__":
    main()
