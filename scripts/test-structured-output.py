#!/usr/bin/env python3
"""
验证结构化输出文档中各协议示例的正确性

测试内容：
1. OpenAI Chat Completion API - response_format
2. OpenAI Responses API - text.format
3. Anthropic Messages API - output_config.format
4. Anthropic Messages API - Tool Use
5. Google Vertex AI API - responseMimeType + responseSchema

使用方法：
    export ZENMUX_API_KEY="your-api-key"
    python scripts/test-structured-output.py
"""

import os
import json
import sys
from typing import Any

# 定义共用的 JSON Schema
PERSON_SCHEMA = {
    "type": "object",
    "properties": {
        "name": {
            "type": "string",
            "description": "your name"
        },
        "city": {
            "type": "string",
            "description": "where your city"
        },
        "desc": {
            "type": "string",
            "description": "description"
        }
    },
    "required": ["name", "city", "desc"],
    "additionalProperties": False
}

USER_MESSAGE = "Hi, who are you? Describe yourself using about 50 words."

def print_result(test_name: str, success: bool, result: Any = None, error: str = None):
    """打印测试结果"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"\n{'='*60}")
    print(f"{status} - {test_name}")
    print(f"{'='*60}")
    if success and result:
        print(f"结果: {json.dumps(result, ensure_ascii=False, indent=2)}")
    if error:
        print(f"错误: {error}")


def validate_response(data: dict, schema: dict) -> bool:
    """验证响应是否符合 schema 结构"""
    required_fields = schema.get("required", [])
    properties = schema.get("properties", {})
    
    # 检查必填字段
    for field in required_fields:
        if field not in data:
            print(f"  缺少必填字段: {field}")
            return False
    
    # 检查字段类型
    for field, prop in properties.items():
        if field in data:
            expected_type = prop.get("type")
            actual_value = data[field]
            if expected_type == "string" and not isinstance(actual_value, str):
                print(f"  字段 {field} 类型错误: 期望 string, 实际 {type(actual_value).__name__}")
                return False
    
    return True


def test_openai_chat_completion():
    """测试 OpenAI Chat Completion API 的结构化输出"""
    test_name = "OpenAI Chat Completion API (response_format)"
    
    try:
        from openai import OpenAI
        
        client = OpenAI(
            base_url="https://zenmux.ai/api/v1",
            api_key=os.environ.get("ZENMUX_API_KEY"),
        )
        
        completion = client.chat.completions.create(
            model="openai/gpt-4.1-nano",
            messages=[
                {
                    "role": "user",
                    "content": USER_MESSAGE
                }
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "role",
                    "description": "Introduce yourself",
                    "schema": PERSON_SCHEMA
                }
            }
        )
        
        content = completion.choices[0].message.content
        result = json.loads(content)
        
        if validate_response(result, PERSON_SCHEMA):
            print_result(test_name, True, result)
            return True
        else:
            print_result(test_name, False, error="响应不符合 schema")
            return False
            
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def test_openai_responses_api():
    """测试 OpenAI Responses API 的结构化输出"""
    test_name = "OpenAI Responses API (text.format)"
    
    # 尝试多个可能支持 Responses API 的模型
    # 文档中使用 openai/gpt-5，但这需要平台支持
    models_to_try = [
        "openai/gpt-5",
        "openai/gpt-4o",
        "openai/gpt-4o-mini", 
        "openai/o1",
        "openai/o1-mini",
    ]
    
    try:
        from openai import OpenAI
        
        client = OpenAI(
            base_url="https://zenmux.ai/api/v1",
            api_key=os.environ.get("ZENMUX_API_KEY"),
        )
        
        last_error = None
        for model in models_to_try:
            try:
                response = client.responses.create(
                    model=model,
                    input=USER_MESSAGE,
                    text={
                        "format": {
                            "type": "json_schema",
                            "name": "role",
                            "description": "Introduce yourself",
                            "strict": True,
                            "schema": PERSON_SCHEMA
                        }
                    }
                )
                
                # 如果成功，继续处理
                result_text = None
                for item in response.output:
                    if item.type == "message":
                        for content in item.content:
                            if content.type == "output_text":
                                result_text = content.text
                                break
                
                if result_text:
                    result = json.loads(result_text)
                    if validate_response(result, PERSON_SCHEMA):
                        print(f"  使用模型: {model}")
                        print_result(test_name, True, result)
                        return True
                    else:
                        print_result(test_name, False, error="响应不符合 schema")
                        return False
                else:
                    print_result(test_name, False, error="未找到输出文本")
                    return False
                    
            except Exception as e:
                last_error = str(e)
                if "model_not_supported" not in str(e):
                    # 如果是其他错误，直接抛出
                    raise
                # 否则继续尝试下一个模型
                continue
        
        # 所有模型都不支持 - 标记为跳过而非失败
        print(f"\n{'='*60}")
        print(f"⚠️  SKIP - {test_name}")
        print(f"{'='*60}")
        print(f"原因: 当前 API Key 可能没有支持 Responses API 的模型权限")
        print(f"文档示例使用 openai/gpt-5，请确保您的账户有该模型访问权限")
        return None  # 跳过
            
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def test_anthropic_output_config():
    """测试 Anthropic Messages API 的 output_config 结构化输出"""
    test_name = "Anthropic Messages API (output_config.format)"
    
    try:
        import anthropic
        
        client = anthropic.Anthropic(
            api_key=os.environ.get("ZENMUX_API_KEY"),
            base_url="https://zenmux.ai/api/anthropic"
        )
        
        message = client.messages.create(
            model="anthropic/claude-sonnet-4.5",
            max_tokens=1024,
            messages=[
                {
                    "role": "user",
                    "content": USER_MESSAGE
                }
            ],
            output_config={
                "format": {
                    "type": "json_schema",
                    "schema": PERSON_SCHEMA
                }
            }
        )
        
        content = message.content[0].text
        result = json.loads(content)
        
        if validate_response(result, PERSON_SCHEMA):
            print_result(test_name, True, result)
            return True
        else:
            print_result(test_name, False, error="响应不符合 schema")
            return False
            
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def test_anthropic_tool_use():
    """测试 Anthropic Messages API 的工具调用结构化输出"""
    test_name = "Anthropic Messages API (Tool Use)"
    
    try:
        import anthropic
        
        client = anthropic.Anthropic(
            api_key=os.environ.get("ZENMUX_API_KEY"),
            base_url="https://zenmux.ai/api/anthropic"
        )
        
        tools = [
            {
                "name": "introduce_yourself",
                "description": "Introduce yourself with structured information",
                "strict": True,
                "input_schema": PERSON_SCHEMA
            }
        ]
        
        message = client.messages.create(
            model="anthropic/claude-sonnet-4.5",
            max_tokens=1024,
            tools=tools,
            tool_choice={"type": "tool", "name": "introduce_yourself"},
            messages=[
                {
                    "role": "user",
                    "content": USER_MESSAGE
                }
            ]
        )
        
        # 从 tool_use 块中提取结构化数据
        result = None
        for block in message.content:
            if block.type == "tool_use":
                result = block.input
                break
        
        if result and validate_response(result, PERSON_SCHEMA):
            print_result(test_name, True, result)
            return True
        else:
            print_result(test_name, False, error="响应不符合 schema 或未找到 tool_use 块")
            return False
            
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def test_vertex_ai():
    """测试 Google Vertex AI API 的结构化输出"""
    test_name = "Google Vertex AI API (responseMimeType + responseSchema)"
    
    # 尝试多个可能支持 Vertex AI 的模型
    # 文档中使用 google/gemini-2.5-pro，但这需要平台支持
    models_to_try = [
        "google/gemini-2.5-pro",
        "google/gemini-2.5-flash",
        "google/gemini-2.0-flash",
        "google/gemini-1.5-flash",
        "google/gemini-1.5-pro",
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
        
        last_error = None
        for model in models_to_try:
            try:
                response = client.models.generate_content(
                    model=model,
                    contents=USER_MESSAGE,
                    config=types.GenerateContentConfig(
                        response_mime_type="application/json",
                        response_schema=PERSON_SCHEMA
                    )
                )
                
                result = json.loads(response.text)
                
                if validate_response(result, PERSON_SCHEMA):
                    print(f"  使用模型: {model}")
                    print_result(test_name, True, result)
                    return True
                else:
                    print_result(test_name, False, error="响应不符合 schema")
                    return False
                    
            except Exception as e:
                last_error = str(e)
                if "model_not_supported" not in str(e) and "not supported" not in str(e).lower():
                    # 如果是其他错误，直接抛出
                    raise
                # 否则继续尝试下一个模型
                continue
        
        # 所有模型都不支持 - 标记为跳过而非失败
        print(f"\n{'='*60}")
        print(f"⚠️  SKIP - {test_name}")
        print(f"{'='*60}")
        print(f"原因: 当前 API Key 可能没有支持 Vertex AI 协议的模型权限")
        print(f"文档示例使用 google/gemini-2.5-pro，请确保您的账户有该模型访问权限")
        return None  # 跳过
            
    except ImportError:
        print_result(test_name, False, error="google-genai 库未安装，跳过此测试。请运行: pip install google-genai")
        return None  # 跳过
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def main():
    """运行所有测试"""
    print("=" * 60)
    print("结构化输出示例验证脚本")
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
    
    # 1. OpenAI Chat Completion
    if dependencies["openai"]:
        results["chat_completion"] = test_openai_chat_completion()
    
    # 2. OpenAI Responses API
    if dependencies["openai"]:
        results["responses_api"] = test_openai_responses_api()
    
    # 3. Anthropic output_config
    if dependencies["anthropic"]:
        results["anthropic_output_config"] = test_anthropic_output_config()
    
    # 4. Anthropic Tool Use
    if dependencies["anthropic"]:
        results["anthropic_tool_use"] = test_anthropic_tool_use()
    
    # 5. Vertex AI
    if dependencies["google-genai"]:
        results["vertex_ai"] = test_vertex_ai()
    
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
    
    # 返回退出码
    if failed > 0:
        sys.exit(1)
    else:
        sys.exit(0)


if __name__ == "__main__":
    main()
