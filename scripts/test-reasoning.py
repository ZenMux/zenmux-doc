#!/usr/bin/env python3
"""
验证推理模型文档中各协议示例的正确性

测试内容：
1. OpenAI Chat Completion API - reasoning_effort
2. OpenAI Chat Completion API - reasoning (高级用法)
3. OpenAI Responses API - reasoning
4. Anthropic Messages API - thinking (Extended Thinking)
5. Google Vertex AI API - thinking_config

使用方法：
    export ZENMUX_API_KEY="your-api-key"
    python scripts/test-reasoning.py
"""

import os
import json
import sys
from typing import Any

# 测试用的数学问题
MATH_QUESTION = "Solve this math problem: 2x + 5 = 15. What is x?"


def print_result(test_name: str, success: bool, result: Any = None, error: str = None):
    """打印测试结果"""
    status = "✅ PASS" if success else "❌ FAIL"
    print(f"\n{'='*60}")
    print(f"{status} - {test_name}")
    print(f"{'='*60}")
    if success and result:
        if isinstance(result, str):
            # 截断过长的结果
            display = result[:500] + "..." if len(result) > 500 else result
            print(f"结果: {display}")
        else:
            print(f"结果: {json.dumps(result, ensure_ascii=False, indent=2)[:500]}")
    if error:
        print(f"错误: {error}")


def test_chat_completion_reasoning_effort():
    """测试 OpenAI Chat Completion API 的 reasoning_effort 参数"""
    test_name = "Chat Completion API (reasoning_effort)"
    
    try:
        from openai import OpenAI
        
        client = OpenAI(
            base_url="https://zenmux.ai/api/v1",
            api_key=os.environ.get("ZENMUX_API_KEY"),
        )
        
        completion = client.chat.completions.create(
            model="qwen/qwen3-max-preview",
            reasoning_effort="high",
            messages=[
                {
                    "role": "user",
                    "content": MATH_QUESTION
                }
            ]
        )
        
        message = completion.choices[0].message
        content = message.content
        
        # 检查是否有推理内容
        reasoning = getattr(message, 'reasoning', None)
        
        result = {
            "content": content,
            "has_reasoning": reasoning is not None,
            "reasoning_preview": str(reasoning)[:200] if reasoning else None
        }
        
        print_result(test_name, True, result)
        return True
        
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def test_chat_completion_reasoning_advanced():
    """测试 OpenAI Chat Completion API 的 reasoning 高级参数"""
    test_name = "Chat Completion API (reasoning 高级用法)"
    
    try:
        from openai import OpenAI
        
        client = OpenAI(
            base_url="https://zenmux.ai/api/v1",
            api_key=os.environ.get("ZENMUX_API_KEY"),
        )
        
        response = client.chat.completions.create(
            model="qwen/qwen3-max-preview",
            messages=[
                {"role": "user", "content": MATH_QUESTION}
            ],
            extra_body={
                "reasoning": {
                    "effort": "high",
                    "max_tokens": 2048
                }
            },
        )
        
        message = response.choices[0].message
        content = message.content
        reasoning = getattr(message, 'reasoning', None)
        
        result = {
            "content": content,
            "has_reasoning": reasoning is not None,
            "reasoning_preview": str(reasoning)[:200] if reasoning else None
        }
        
        print_result(test_name, True, result)
        return True
        
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def test_responses_api_reasoning():
    """测试 OpenAI Responses API 的 reasoning 参数"""
    test_name = "Responses API (reasoning)"
    
    # 尝试多个模型
    models_to_try = [
        "openai/gpt-5",
        "openai/gpt-4o",
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
                    input=MATH_QUESTION,
                    reasoning={
                        "effort": "high",
                        "summary": "detailed"
                    }
                )
                
                # 提取结果
                reasoning_summary = None
                final_answer = None
                
                for item in response.output:
                    if item.type == "reasoning":
                        reasoning_summary = getattr(item, 'summary', None)
                    elif item.type == "message":
                        for content in item.content:
                            if content.type == "output_text":
                                final_answer = content.text
                
                result = {
                    "model": model,
                    "has_reasoning": reasoning_summary is not None,
                    "reasoning_summary": str(reasoning_summary)[:200] if reasoning_summary else None,
                    "answer": final_answer[:200] if final_answer else None
                }
                
                print(f"  使用模型: {model}")
                print_result(test_name, True, result)
                return True
                
            except Exception as e:
                last_error = str(e)
                if "model_not_supported" not in str(e) and "invalid_model" not in str(e):
                    raise
                continue
        
        # 所有模型都不支持
        print(f"\n{'='*60}")
        print(f"⚠️  SKIP - {test_name}")
        print(f"{'='*60}")
        print(f"原因: 当前 API Key 可能没有支持 Responses API 的模型权限")
        return None
        
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def test_anthropic_thinking():
    """测试 Anthropic Messages API 的 Extended Thinking"""
    test_name = "Anthropic Messages API (Extended Thinking)"
    
    try:
        import anthropic
        
        client = anthropic.Anthropic(
            api_key=os.environ.get("ZENMUX_API_KEY"),
            base_url="https://zenmux.ai/api/anthropic"
        )
        
        message = client.messages.create(
            model="anthropic/claude-sonnet-4.5",
            max_tokens=16000,
            thinking={
                "type": "enabled",
                "budget_tokens": 10000
            },
            messages=[
                {
                    "role": "user",
                    "content": MATH_QUESTION
                }
            ]
        )
        
        # 提取思维过程和最终答案
        thinking_content = None
        text_content = None
        
        for block in message.content:
            if block.type == "thinking":
                thinking_content = block.thinking
            elif block.type == "text":
                text_content = block.text
        
        result = {
            "has_thinking": thinking_content is not None,
            "thinking_preview": thinking_content[:300] + "..." if thinking_content and len(thinking_content) > 300 else thinking_content,
            "answer": text_content[:200] if text_content else None
        }
        
        print_result(test_name, True, result)
        return True
        
    except Exception as e:
        print_result(test_name, False, error=str(e))
        return False


def test_vertex_ai_thinking():
    """测试 Google Vertex AI API 的 Thinking Mode"""
    test_name = "Vertex AI API (Thinking Mode)"
    
    # 尝试多个模型
    models_to_try = [
        ("google/gemini-2.5-pro", "thinking_budget", 16000),
        ("google/gemini-2.5-flash", "thinking_budget", 8000),
        ("google/gemini-3-pro", "thinking_level", "HIGH"),
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
        for model, config_type, config_value in models_to_try:
            try:
                # 根据配置类型构建 thinking_config
                if config_type == "thinking_budget":
                    thinking_config = types.ThinkingConfig(
                        thinking_budget=config_value
                    )
                else:  # thinking_level
                    thinking_config = types.ThinkingConfig(
                        thinking_level=types.ThinkingLevel.HIGH if config_value == "HIGH" else types.ThinkingLevel.LOW
                    )
                
                response = client.models.generate_content(
                    model=model,
                    contents=MATH_QUESTION,
                    config=types.GenerateContentConfig(
                        thinking_config=thinking_config
                    )
                )
                
                result = {
                    "model": model,
                    "config_type": config_type,
                    "answer": response.text[:300] if response.text else None
                }
                
                # 尝试获取思考总结
                if hasattr(response, 'candidates') and response.candidates:
                    candidate = response.candidates[0]
                    if hasattr(candidate, 'thinking_metadata'):
                        result["thinking_summary"] = str(candidate.thinking_metadata)[:200]
                
                print(f"  使用模型: {model}")
                print_result(test_name, True, result)
                return True
                
            except Exception as e:
                last_error = str(e)
                if "model_not_supported" not in str(e).lower() and "not supported" not in str(e).lower() and "invalid_model" not in str(e).lower():
                    raise
                continue
        
        # 所有模型都不支持
        print(f"\n{'='*60}")
        print(f"⚠️  SKIP - {test_name}")
        print(f"{'='*60}")
        print(f"原因: 当前 API Key 可能没有支持 Vertex AI 协议的模型权限")
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
    print("推理模型示例验证脚本")
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
    
    # 1. Chat Completion - reasoning_effort
    if dependencies["openai"]:
        results["chat_completion_effort"] = test_chat_completion_reasoning_effort()
    
    # 2. Chat Completion - reasoning (高级)
    if dependencies["openai"]:
        results["chat_completion_advanced"] = test_chat_completion_reasoning_advanced()
    
    # 3. Responses API - reasoning
    if dependencies["openai"]:
        results["responses_api"] = test_responses_api_reasoning()
    
    # 4. Anthropic - thinking
    if dependencies["anthropic"]:
        results["anthropic_thinking"] = test_anthropic_thinking()
    
    # 5. Vertex AI - thinking_config
    if dependencies["google-genai"]:
        results["vertex_ai_thinking"] = test_vertex_ai_thinking()
    
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
        "chat_completion_effort": "Chat Completion (reasoning_effort)",
        "chat_completion_advanced": "Chat Completion (reasoning 高级)",
        "responses_api": "Responses API (reasoning)",
        "anthropic_thinking": "Anthropic (Extended Thinking)",
        "vertex_ai_thinking": "Vertex AI (Thinking Mode)"
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
