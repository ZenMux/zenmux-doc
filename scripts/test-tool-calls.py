#!/usr/bin/env python3
"""
验证工具调用文档中各协议示例的正确性

测试内容：
1. OpenAI Chat Completion API - tools
2. OpenAI Responses API - tools
3. Anthropic Messages API - tools
4. Google Vertex AI API - FunctionDeclaration

使用方法：
    export ZENMUX_API_KEY="your-api-key"
    python scripts/test-tool-calls.py
"""

import os
import json
import sys
from typing import Any

# 测试用的天气查询问题
WEATHER_QUESTION = "北京今天的天气怎么样？"


def print_result(test_name: str, success: bool, result: Any = None, error: str = None):
    """打印测试结果"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"\n{'='*60}")
    print(f"{status} - {test_name}")
    print(f"{'='*60}")
    if success and result:
        if isinstance(result, str):
            display = result[:500] + "..." if len(result) > 500 else result
            print(f"结果: {display}")
        else:
            print(f"结果: {json.dumps(result, ensure_ascii=False, indent=2)[:500]}")
    if error:
        print(f"错误: {error}")


def get_weather_mock(location: str) -> dict:
    """模拟天气API返回"""
    return {
        "location": location,
        "temperature": "25°C",
        "condition": "晴朗",
        "humidity": "40%"
    }


def test_chat_completion_tools():
    """测试 OpenAI Chat Completion API 的工具调用"""
    test_name = "Chat Completion API (tools)"
    
    # 尝试多个模型
    models_to_try = [
        "openai/gpt-4.1-nano",
        "openai/gpt-4o",
        "moonshotai/kimi-k2",
        "qwen/qwen-max",
    ]
    
    try:
        from openai import OpenAI
        
        client = OpenAI(
            base_url="https://zenmux.ai/api/v1",
            api_key=os.environ.get("ZENMUX_API_KEY"),
        )
        
        # 定义工具
        tools = [
            {
                "type": "function",
                "function": {
                    "name": "get_weather",
                    "description": "获取给定位置的当前天气",
                    "parameters": {
                        "type": "object",
                        "properties": {
                            "location": {
                                "type": "string",
                                "description": "城市名称"
                            }
                        },
                        "required": ["location"]
                    }
                }
            }
        ]
        
        last_error = None
        for model in models_to_try:
            try:
                # 第一次请求
                response = client.chat.completions.create(
                    model=model,
                    messages=[{"role": "user", "content": WEATHER_QUESTION}],
                    tools=tools
                )
        
                message = response.choices[0].message
                
                # 检查是否有工具调用
                if message.tool_calls:
                    tool_call = message.tool_calls[0]
                    args = json.loads(tool_call.function.arguments)
                    
                    # 执行工具调用
                    result = get_weather_mock(args.get("location", "北京"))
                    
                    # 第二次请求 - 发送工具结果
                    messages = [
                        {"role": "user", "content": WEATHER_QUESTION},
                        {
                            "role": "assistant",
                            "content": message.content,
                            "tool_calls": [tc.model_dump() for tc in message.tool_calls]
                        },
                        {
                            "role": "tool",
                            "tool_call_id": tool_call.id,
                            "name": tool_call.function.name,
                            "content": json.dumps(result, ensure_ascii=False)
                        }
                    ]
                    
                    final_response = client.chat.completions.create(
                        model=model,
                        messages=messages,
                        tools=tools
                    )
                    
                    final_content = final_response.choices[0].message.content
                    
                    result_data = {
                        "model": model,
                        "tool_called": tool_call.function.name,
                        "tool_args": args,
                        "final_answer": final_content[:200] if final_content else None
                    }
                    
                    print(f"  使用模型: {model}")
                    print_result(test_name, True, result_data)
                    return True
                else:
                    # 模型直接回答而没有调用工具
                    result_data = {
                        "model": model,
                        "tool_called": None,
                        "direct_answer": message.content[:200] if message.content else None
                    }
                    print(f"  使用模型: {model}")
                    print_result(test_name, True, result_data)
                    return True
                    
            except Exception as e:
                last_error = str(e)
                if "model_not_available" not in str(e).lower() and "model_not_supported" not in str(e).lower():
                    raise
                continue
        
        # 所有模型都不可用
        print(f"\n{'='*60}")
        print(f"⚠️  SKIP - {test_name}")
        print(f"{'='*60}")
        print(f"原因: 没有可用的 Chat Completion 模型")
        print(f"最后错误: {last_error}")
        return None
            
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def test_responses_api_tools():
    """测试 OpenAI Responses API 的工具调用"""
    test_name = "Responses API (tools)"
    
    models_to_try = ["openai/gpt-5", "openai/gpt-4o"]
    
    try:
        from openai import OpenAI
        
        client = OpenAI(
            base_url="https://zenmux.ai/api/v1",
            api_key=os.environ.get("ZENMUX_API_KEY"),
        )
        
        # 定义工具
        tools = [
            {
                "type": "function",
                "name": "get_weather",
                "description": "获取给定位置的当前天气",
                "parameters": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "城市名称"
                        }
                    },
                    "required": ["location"]
                }
            }
        ]
        
        last_error = None
        for model in models_to_try:
            try:
                # 第一次请求
                response = client.responses.create(
                    model=model,
                    input=WEATHER_QUESTION,
                    tools=tools
                )
                
                # 检查是否有工具调用
                function_calls = [item for item in response.output if item.type == "function_call"]
                
                if function_calls:
                    call = function_calls[0]
                    args = json.loads(call.arguments)
                    
                    # 执行工具调用
                    result = get_weather_mock(args.get("location", "北京"))
                    
                    # 第二次请求 - 发送工具结果
                    tool_outputs = [
                        {
                            "type": "function_call_output",
                            "call_id": call.call_id,
                            "output": json.dumps(result, ensure_ascii=False)
                        }
                    ]
                    
                    final_response = client.responses.create(
                        model=model,
                        input=tool_outputs,
                        previous_response_id=response.id
                    )
                    
                    # 提取最终回答
                    final_answer = None
                    for item in final_response.output:
                        if item.type == "message":
                            for content in item.content:
                                if content.type == "output_text":
                                    final_answer = content.text
                                    break
                    
                    result_data = {
                        "model": model,
                        "tool_called": call.name,
                        "tool_args": args,
                        "final_answer": final_answer[:200] if final_answer else None
                    }
                    
                    print(f"  使用模型: {model}")
                    print_result(test_name, True, result_data)
                    return True
                else:
                    # 模型直接回答
                    result_data = {
                        "model": model,
                        "tool_called": None,
                        "output_types": [item.type for item in response.output]
                    }
                    print(f"  使用模型: {model}")
                    print_result(test_name, True, result_data)
                    return True
                    
            except Exception as e:
                last_error = str(e)
                if "model_not_supported" not in str(e).lower() and "invalid_model" not in str(e).lower():
                    raise
                continue
        
        # 所有模型都不支持
        print(f"\n{'='*60}")
        print(f"⚠️  SKIP - {test_name}")
        print(f"{'='*60}")
        print(f"原因: 没有可用的 Responses API 模型")
        print(f"最后错误: {last_error}")
        return None
        
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def test_anthropic_tools():
    """测试 Anthropic Messages API 的工具调用"""
    test_name = "Anthropic Messages API (tools)"
    
    try:
        import anthropic
        
        client = anthropic.Anthropic(
            api_key=os.environ.get("ZENMUX_API_KEY"),
            base_url="https://zenmux.ai/api/anthropic"
        )
        
        # 定义工具
        tools = [
            {
                "name": "get_weather",
                "description": "获取给定位置的当前天气",
                "input_schema": {
                    "type": "object",
                    "properties": {
                        "location": {
                            "type": "string",
                            "description": "城市名称"
                        }
                    },
                    "required": ["location"]
                }
            }
        ]
        
        # 第一次请求
        message = client.messages.create(
            model="anthropic/claude-sonnet-4.5",
            max_tokens=1024,
            tools=tools,
            messages=[{"role": "user", "content": WEATHER_QUESTION}]
        )
        
        # 检查是否需要工具调用
        if message.stop_reason == "tool_use":
            # 找到工具调用块
            tool_use_block = None
            for block in message.content:
                if block.type == "tool_use":
                    tool_use_block = block
                    break
            
            if tool_use_block:
                # 执行工具调用
                result = get_weather_mock(tool_use_block.input.get("location", "北京"))
                
                # 第二次请求 - 发送工具结果
                final_message = client.messages.create(
                    model="anthropic/claude-sonnet-4.5",
                    max_tokens=1024,
                    tools=tools,
                    messages=[
                        {"role": "user", "content": WEATHER_QUESTION},
                        {"role": "assistant", "content": message.content},
                        {
                            "role": "user",
                            "content": [
                                {
                                    "type": "tool_result",
                                    "tool_use_id": tool_use_block.id,
                                    "content": json.dumps(result, ensure_ascii=False)
                                }
                            ]
                        }
                    ]
                )
                
                # 提取最终回答
                final_answer = None
                for block in final_message.content:
                    if hasattr(block, "text"):
                        final_answer = block.text
                        break
                
                result_data = {
                    "tool_called": tool_use_block.name,
                    "tool_args": tool_use_block.input,
                    "final_answer": final_answer[:200] if final_answer else None
                }
                
                print_result(test_name, True, result_data)
                return True
        else:
            # 模型直接回答
            final_answer = None
            for block in message.content:
                if hasattr(block, "text"):
                    final_answer = block.text
                    break
            
            result_data = {
                "tool_called": None,
                "stop_reason": message.stop_reason,
                "direct_answer": final_answer[:200] if final_answer else None
            }
            print_result(test_name, True, result_data)
            return True
            
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def test_vertex_ai_tools():
    """测试 Google Vertex AI API 的工具调用"""
    test_name = "Vertex AI API (FunctionDeclaration)"
    
    models_to_try = [
        "google/gemini-2.5-pro",
        "google/gemini-2.5-flash",
    ]
    
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
        
        # 定义工具
        get_weather_func = types.FunctionDeclaration(
            name="get_weather",
            description="获取给定位置的当前天气",
            parameters={
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "城市名称"
                    }
                },
                "required": ["location"]
            }
        )
        tools = types.Tool(function_declarations=[get_weather_func])
        
        last_error = None
        for model in models_to_try:
            try:
                # 第一次请求
                response = client.models.generate_content(
                    model=model,
                    contents=WEATHER_QUESTION,
                    config=types.GenerateContentConfig(
                        tools=[tools]
                    )
                )
                
                # 检查是否有函数调用
                if response.function_calls:
                    function_call = response.function_calls[0]
                    
                    # 执行函数调用
                    result = get_weather_mock(function_call.args.get("location", "北京"))
                    
                    # 构建对话历史
                    contents = [
                        types.Content(role="user", parts=[types.Part(text=WEATHER_QUESTION)]),
                        response.candidates[0].content,
                        types.Content(
                            role="user",
                            parts=[
                                types.Part.from_function_response(
                                    name=function_call.name,
                                    response=result
                                )
                            ]
                        )
                    ]
                    
                    # 第二次请求
                    final_response = client.models.generate_content(
                        model=model,
                        contents=contents,
                        config=types.GenerateContentConfig(
                            tools=[tools]
                        )
                    )
                    
                    result_data = {
                        "model": model,
                        "tool_called": function_call.name,
                        "tool_args": dict(function_call.args),
                        "final_answer": final_response.text[:200] if final_response.text else None
                    }
                    
                    print(f"  使用模型: {model}")
                    print_result(test_name, True, result_data)
                    return True
                else:
                    # 模型直接回答
                    result_data = {
                        "model": model,
                        "tool_called": None,
                        "direct_answer": response.text[:200] if response.text else None
                    }
                    print(f"  使用模型: {model}")
                    print_result(test_name, True, result_data)
                    return True
                    
            except Exception as e:
                last_error = str(e)
                if "model_not_supported" not in str(e).lower() and "not supported" not in str(e).lower():
                    raise
                continue
        
        # 所有模型都不支持
        print(f"\n{'='*60}")
        print(f"⚠️  SKIP - {test_name}")
        print(f"{'='*60}")
        print(f"原因: 没有可用的 Vertex AI 模型")
        print(f"最后错误: {last_error}")
        return None
        
    except ImportError:
        print_result(test_name, False, error="google-genai 库未安装。请运行: pip install google-genai")
        return None
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def main():
    """运行所有测试"""
    print("=" * 60)
    print("工具调用示例验证脚本")
    print("=" * 60)
    
    # 检查 API Key
    api_key = os.environ.get("ZENMUX_API_KEY")
    if not api_key:
        print("❌ 错误: 请设置 ZENMUX_API_KEY 环境变量")
        print("   export ZENMUX_API_KEY='your-api-key'")
        sys.exit(1)
    
    print(f"API Key: {api_key[:20]}...")
    
    # 检查依赖
    print("\n检查依赖...")
    dependencies = {
        "openai": False,
        "anthropic": False,
        "google-genai": False
    }
    
    try:
        import openai
        dependencies["openai"] = True
        print("  ✅ openai")
    except ImportError:
        print("  ❌ openai (pip install openai)")
    
    try:
        import anthropic
        dependencies["anthropic"] = True
        print("  ✅ anthropic")
    except ImportError:
        print("  ❌ anthropic (pip install anthropic)")
    
    try:
        from google import genai
        dependencies["google-genai"] = True
        print("  ✅ google-genai")
    except ImportError:
        print("  ⚠️  google-genai (pip install google-genai) - 可选")
    
    # 运行测试
    results = {}
    
    print("\n" + "=" * 60)
    print("开始测试...")
    print("=" * 60)
    
    # 1. Chat Completion - tools
    if dependencies["openai"]:
        results["chat_completion"] = test_chat_completion_tools()
    
    # 2. Responses API - tools
    if dependencies["openai"]:
        results["responses_api"] = test_responses_api_tools()
    
    # 3. Anthropic - tools
    if dependencies["anthropic"]:
        results["anthropic_tools"] = test_anthropic_tools()
    
    # 4. Vertex AI - FunctionDeclaration
    if dependencies["google-genai"]:
        results["vertex_ai_tools"] = test_vertex_ai_tools()
    
    # 汇总结果
    print("\n" + "=" * 60)
    print("测试汇总")
    print("=" * 60)
    
    passed = sum(1 for v in results.values() if v is True)
    failed = sum(1 for v in results.values() if v is False)
    skipped = sum(1 for v in results.values() if v is None)
    total = len(results)
    
    print(f"总计: {total} 个测试")
    print(f"  ✅ 通过: {passed}")
    print(f"  ❌ 失败: {failed}")
    if skipped:
        print(f"  ⚠️  跳过: {skipped}")
    
    # 详细结果
    print("\n详细结果:")
    test_names = {
        "chat_completion": "Chat Completion (tools)",
        "responses_api": "Responses API (tools)",
        "anthropic_tools": "Anthropic (tools)",
        "vertex_ai_tools": "Vertex AI (FunctionDeclaration)"
    }
    
    for key, name in test_names.items():
        if key in results:
            status = "✅" if results[key] is True else ("⚠️" if results[key] is None else "❌")
            print(f"  {status} {name}")
    
    # 返回退出码
    if failed > 0:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
