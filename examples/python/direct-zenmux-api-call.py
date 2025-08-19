import httpx

api_key = "<Your ZENMUX_API_KEY>"
headers = {
    "Authorization": f"Bearer {api_key}", 
}
payload = {
    "model": "openai/gpt-5", 
    "messages": [
        {
            "role": "user",
            "content": "What's the meaning of life?"
        }
    ]
}

response = httpx.post(
    "https://zenmux.ai/api/v1/chat/completions", 
    headers=headers,
    json=payload,
    timeout=httpx.Timeout(60.0)
)

print(response.json())