<script setup lang="ts">
import { ref, onMounted, computed, watch, nextTick } from "vue";
import { ElMessage, ElSelect, ElOption } from "element-plus";
import { Copy as CopyIcon, Checked as CheckedIcon } from "./icons";
import { useData, inBrowser } from "vitepress";

const { frontmatter, page } = useData();

const isApiRequest = computed(() => frontmatter.value.pageClass === "api-page");

const requestCodes = ref<Record<string, string>>({});
const responseCodes = ref<Record<string, string>>({});
const currentLang = ref("");
const langOptions = ref<string[]>([]);
const currentExampleId = ref("");
const requestExamples = ref<RequestExample[]>([]);
const httpMethod = ref("GET");
const requestURL = ref("");
const docTitle = ref("");

const copiedReq = ref(false);
const copiedResp = ref(false);
const copiedPath = ref(false);
const langSelectRef = ref();

type RequestExample = {
  id: string;
  title: string;
  description: string;
  codes: Record<string, string>;
  langOptions: string[];
};

const languageTitles = new Set([
  "bash",
  "c",
  "cpp",
  "curl",
  "go",
  "html",
  "http",
  "java",
  "javascript",
  "js",
  "json",
  "php",
  "python",
  "ruby",
  "shell",
  "sh",
  "ts",
  "typescript",
  "xml",
  "yaml",
  "yml",
]);

const methodOrder = ["javascript", "python", "curl"];

const languageDisplayNames: Record<string, string> = {
  bash: "Bash",
  curl: "cURL",
  javascript: "JavaScript",
  js: "JavaScript",
  json: "JSON",
  python: "Python",
  ts: "TypeScript",
  typescript: "TypeScript",
};

function onLangWrapperClick(e: MouseEvent) {
  if (!(e.target as HTMLElement).closest(".el-select")) {
    langSelectRef.value?.$el?.querySelector(".el-select__wrapper")?.click();
  }
}

function isLanguageTitle(title: string, lang: string) {
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedLang = lang.trim().toLowerCase();
  return (
    normalizedTitle === normalizedLang ||
    languageTitles.has(normalizedTitle)
  );
}

function getLanguageKey(lang: string) {
  const normalized = lang.trim().toLowerCase();
  return normalized === "curl" ? "curl" : normalized;
}

function getLanguageDisplayName(lang: string) {
  return languageDisplayNames[getLanguageKey(lang)] || lang;
}

function createExample(title: string, description = ""): RequestExample {
  const id =
    title
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "") || `example-${requestExamples.value.length + 1}`;

  return {
    id,
    title,
    description: description || title,
    codes: {},
    langOptions: [],
  };
}

function setCurrentExample(example: RequestExample) {
  currentExampleId.value = example.id;
  currentLang.value = example.langOptions[0] || "";
}

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function toCodeHtml(code: string) {
  const lines = code.replace(/\n$/, "").split("\n");
  return `<code>${lines
    .map((line) => `<span class="line">${escapeHtml(line)}</span>`)
    .join("\n")}</code>`;
}

function addGeneratedCode(example: RequestExample, lang: string, code?: string) {
  if (!code || example.codes[lang]) return;
  example.codes[lang] = toCodeHtml(code);
  if (!example.langOptions.includes(lang)) {
    example.langOptions.push(lang);
  }
}

function sortLangOptions(example: RequestExample) {
  example.langOptions.sort((a, b) => {
    const aKey = getLanguageKey(a);
    const bKey = getLanguageKey(b);
    const aIndex = methodOrder.indexOf(aKey);
    const bIndex = methodOrder.indexOf(bKey);
    if (aIndex === -1 && bIndex === -1) {
      return getLanguageDisplayName(a).localeCompare(getLanguageDisplayName(b));
    }
    if (aIndex === -1) return 1;
    if (bIndex === -1) return -1;
    return aIndex - bIndex;
  });
}

function completeExampleMethods(example: RequestExample) {
  const title = example.title;

  if (requestURL.value.includes("/chat/completions")) {
    addGeneratedCode(example, "python", getOpenAIChatPython(title));
    addGeneratedCode(example, "cURL", getOpenAIChatCurl(title));
  } else if (requestURL.value.includes("/responses")) {
    addGeneratedCode(example, "python", getOpenAIResponsesPython(title));
    addGeneratedCode(example, "cURL", getOpenAIResponsesCurl(title));
  } else if (requestURL.value.includes("/anthropic")) {
    addGeneratedCode(example, "python", getAnthropicPython(title));
    addGeneratedCode(example, "cURL", getAnthropicCurl(title));
  } else if (requestURL.value.includes("/vertex-ai")) {
    addGeneratedCode(example, "python", getVertexPython(title));
    addGeneratedCode(example, "cURL", getVertexCurl(title));
  }

  sortLangOptions(example);
}

function getPageTitle() {
  if (!inBrowser) return "";
  const heading = document.querySelector<HTMLElement>(".VPDoc h1, main h1, h1");
  return (
    heading?.textContent
      ?.replace(/[\u200B-\u200D\uFEFF]/g, "")
      .trim() ||
    page.value.title ||
    frontmatter.value.title ||
    ""
  );
}

function getOpenAIChatPython(title: string) {
  const prefix = `from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<your_ZENMUX_API_KEY>",
)

`;

  const snippets: Record<string, string> = {
    "Image input": `${prefix}completion = client.chat.completions.create(
    model="openai/gpt-5",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this image."},
                {
                    "type": "image_url",
                    "image_url": {"url": "https://storage.googleapis.com/generativeai-downloads/images/scones.jpg"},
                },
            ],
        }
    ],
)

print(completion.choices[0].message.content)`,
    "Web search": `${prefix}completion = client.chat.completions.create(
    model="openai/gpt-5",
    web_search_options={},
    messages=[
        {"role": "user", "content": "What was a positive news story from today?"}
    ],
)

print(completion.choices[0].message.content)`,
    Streaming: `${prefix}stream = client.chat.completions.create(
    model="openai/gpt-5",
    stream=True,
    messages=[{"role": "user", "content": "Write a short product tagline."}],
)

for chunk in stream:
    print(chunk.choices[0].delta.content or "", end="")`,
    Functions: `${prefix}completion = client.chat.completions.create(
    model="openai/gpt-5",
    tools=[
        {
            "type": "function",
            "function": {
                "name": "get_weather",
                "description": "Get the current weather for a city.",
                "parameters": {
                    "type": "object",
                    "properties": {"location": {"type": "string"}},
                    "required": ["location"],
                    "additionalProperties": False,
                },
            },
        }
    ],
    messages=[{"role": "user", "content": "What is the weather in Shanghai?"}],
)

print(completion.choices[0].message.tool_calls)`,
    Reasoning: `${prefix}completion = client.chat.completions.create(
    model="openai/gpt-5",
    reasoning_effort="medium",
    messages=[
        {
            "role": "user",
            "content": "Compare two database indexing strategies for a write-heavy app.",
        }
    ],
)

print(completion.choices[0].message.content)`,
  };

  return snippets[title];
}

function getOpenAIChatCurl(title: string) {
  const bodies: Record<string, string> = {
    "Image input": `{
    "model": "openai/gpt-5",
    "messages": [
      {
        "role": "user",
        "content": [
          { "type": "text", "text": "Describe this image." },
          {
            "type": "image_url",
            "image_url": { "url": "https://storage.googleapis.com/generativeai-downloads/images/scones.jpg" }
          }
        ]
      }
    ]
  }`,
    "Web search": `{
    "model": "openai/gpt-5",
    "web_search_options": {},
    "messages": [
      {
        "role": "user",
        "content": "What was a positive news story from today?"
      }
    ]
  }`,
    Streaming: `{
    "model": "openai/gpt-5",
    "stream": true,
    "messages": [
      {
        "role": "user",
        "content": "Write a short product tagline."
      }
    ]
  }`,
    Functions: `{
    "model": "openai/gpt-5",
    "tools": [
      {
        "type": "function",
        "function": {
          "name": "get_weather",
          "description": "Get the current weather for a city.",
          "parameters": {
            "type": "object",
            "properties": {
              "location": { "type": "string" }
            },
            "required": ["location"],
            "additionalProperties": false
          }
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What is the weather in Shanghai?"
      }
    ]
  }`,
    Reasoning: `{
    "model": "openai/gpt-5",
    "reasoning_effort": "medium",
    "messages": [
      {
        "role": "user",
        "content": "Compare two database indexing strategies for a write-heavy app."
      }
    ]
  }`,
  };

  return bodies[title]
    ? `curl https://zenmux.ai/api/v1/chat/completions \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ZENMUX_API_KEY" \\
  -d '${bodies[title]}'`
    : undefined;
}

function getOpenAIResponsesPython(title: string) {
  const prefix = `from openai import OpenAI

client = OpenAI(
    base_url="https://zenmux.ai/api/v1",
    api_key="<your_ZENMUX_API_KEY>",
)

`;

  const snippets: Record<string, string> = {
    "Image input": `${prefix}response = client.responses.create(
    model="openai/gpt-5",
    input=[
        {
            "role": "user",
            "content": [
                {"type": "input_text", "text": "Describe this image."},
                {
                    "type": "input_image",
                    "image_url": "https://storage.googleapis.com/generativeai-downloads/images/scones.jpg",
                },
            ],
        }
    ],
)

print(response.output_text)`,
    "File input": `${prefix}response = client.responses.create(
    model="openai/gpt-5",
    input=[
        {
            "role": "user",
            "content": [
                {
                    "type": "input_file",
                    "file_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                },
                {"type": "input_text", "text": "Summarize this document."},
            ],
        }
    ],
)

print(response.output_text)`,
    "Web search": `${prefix}response = client.responses.create(
    model="openai/gpt-5",
    tools=[{"type": "web_search"}],
    input="What was a positive news story from today?",
)

print(response.output_text)`,
    Streaming: `${prefix}stream = client.responses.create(
    model="openai/gpt-5",
    input="Write a short bedtime story about a robot gardener.",
    stream=True,
)

for event in stream:
    if event.type == "response.output_text.delta":
        print(event.delta, end="")`,
    Functions: `${prefix}response = client.responses.create(
    model="openai/gpt-5",
    tools=[
        {
            "type": "function",
            "name": "get_weather",
            "description": "Get the current weather for a city.",
            "parameters": {
                "type": "object",
                "properties": {"location": {"type": "string"}},
                "required": ["location"],
                "additionalProperties": False,
            },
        }
    ],
    input="What is the weather in Shanghai?",
)

print(response.output)`,
    Reasoning: `${prefix}response = client.responses.create(
    model="openai/gpt-5",
    reasoning={"effort": "medium"},
    input="Compare two database indexing strategies for a write-heavy app.",
)

print(response.output_text)`,
  };

  return snippets[title];
}

function getOpenAIResponsesCurl(title: string) {
  const bodies: Record<string, string> = {
    "Image input": `{
    "model": "openai/gpt-5",
    "input": [
      {
        "role": "user",
        "content": [
          { "type": "input_text", "text": "Describe this image." },
          {
            "type": "input_image",
            "image_url": "https://storage.googleapis.com/generativeai-downloads/images/scones.jpg"
          }
        ]
      }
    ]
  }`,
    "File input": `{
    "model": "openai/gpt-5",
    "input": [
      {
        "role": "user",
        "content": [
          {
            "type": "input_file",
            "file_url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
          },
          { "type": "input_text", "text": "Summarize this document." }
        ]
      }
    ]
  }`,
    "Web search": `{
    "model": "openai/gpt-5",
    "tools": [{ "type": "web_search" }],
    "input": "What was a positive news story from today?"
  }`,
    Streaming: `{
    "model": "openai/gpt-5",
    "input": "Write a short bedtime story about a robot gardener.",
    "stream": true
  }`,
    Functions: `{
    "model": "openai/gpt-5",
    "tools": [
      {
        "type": "function",
        "name": "get_weather",
        "description": "Get the current weather for a city.",
        "parameters": {
          "type": "object",
          "properties": {
            "location": { "type": "string" }
          },
          "required": ["location"],
          "additionalProperties": false
        }
      }
    ],
    "input": "What is the weather in Shanghai?"
  }`,
    Reasoning: `{
    "model": "openai/gpt-5",
    "reasoning": { "effort": "medium" },
    "input": "Compare two database indexing strategies for a write-heavy app."
  }`,
  };

  return bodies[title]
    ? `curl https://zenmux.ai/api/v1/responses \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ZENMUX_API_KEY" \\
  -d '${bodies[title]}'`
    : undefined;
}

function getAnthropicPython(title: string) {
  const prefix = `import anthropic

client = anthropic.Anthropic(
    api_key="<YOUR_ZENMUX_API_KEY>",
    base_url="https://zenmux.ai/api/anthropic",
)

`;

  const snippets: Record<string, string> = {
    "Image input": `${prefix}message = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this image."},
                {
                    "type": "image",
                    "source": {
                        "type": "url",
                        "url": "https://storage.googleapis.com/generativeai-downloads/images/scones.jpg",
                    },
                },
            ],
        }
    ],
)

print(message.content)`,
    "File input": `${prefix}message = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=1024,
    messages=[
        {
            "role": "user",
            "content": [
                {
                    "type": "document",
                    "source": {
                        "type": "url",
                        "url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    },
                },
                {"type": "text", "text": "Summarize this document."},
            ],
        }
    ],
)

print(message.content)`,
    "Web search": `${prefix}message = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=1024,
    tools=[{"type": "web_search_20250305", "name": "web_search"}],
    messages=[
        {"role": "user", "content": "What was a positive news story from today?"}
    ],
)

print(message.content)`,
    Streaming: `${prefix}with client.messages.stream(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=1024,
    messages=[{"role": "user", "content": "Write a short product tagline."}],
) as stream:
    for text in stream.text_stream:
        print(text, end="")`,
    Tools: `${prefix}message = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=1024,
    tools=[
        {
            "name": "get_weather",
            "description": "Get the current weather for a city.",
            "input_schema": {
                "type": "object",
                "properties": {"location": {"type": "string"}},
                "required": ["location"],
            },
        }
    ],
    messages=[{"role": "user", "content": "What is the weather in Shanghai?"}],
)

print(message.content)`,
    Thinking: `${prefix}message = client.messages.create(
    model="anthropic/claude-sonnet-4.5",
    max_tokens=2048,
    thinking={"type": "enabled", "budget_tokens": 1024},
    messages=[
        {
            "role": "user",
            "content": "Compare two database indexing strategies for a write-heavy app.",
        }
    ],
)

print(message.content)`,
  };

  return snippets[title];
}

function getAnthropicCurl(title: string) {
  const bodies: Record<string, string> = {
    "Image input": `{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          { "type": "text", "text": "Describe this image." },
          {
            "type": "image",
            "source": {
              "type": "url",
              "url": "https://storage.googleapis.com/generativeai-downloads/images/scones.jpg"
            }
          }
        ]
      }
    ]
  }`,
    "File input": `{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 1024,
    "messages": [
      {
        "role": "user",
        "content": [
          {
            "type": "document",
            "source": {
              "type": "url",
              "url": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            }
          },
          { "type": "text", "text": "Summarize this document." }
        ]
      }
    ]
  }`,
    "Web search": `{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 1024,
    "tools": [
      { "type": "web_search_20250305", "name": "web_search" }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What was a positive news story from today?"
      }
    ]
  }`,
    Streaming: `{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 1024,
    "stream": true,
    "messages": [
      {
        "role": "user",
        "content": "Write a short product tagline."
      }
    ]
  }`,
    Tools: `{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 1024,
    "tools": [
      {
        "name": "get_weather",
        "description": "Get the current weather for a city.",
        "input_schema": {
          "type": "object",
          "properties": {
            "location": { "type": "string" }
          },
          "required": ["location"]
        }
      }
    ],
    "messages": [
      {
        "role": "user",
        "content": "What is the weather in Shanghai?"
      }
    ]
  }`,
    Thinking: `{
    "model": "anthropic/claude-sonnet-4.5",
    "max_tokens": 2048,
    "thinking": { "type": "enabled", "budget_tokens": 1024 },
    "messages": [
      {
        "role": "user",
        "content": "Compare two database indexing strategies for a write-heavy app."
      }
    ]
  }`,
  };

  return bodies[title]
    ? `curl https://zenmux.ai/api/anthropic/v1/messages \\
  -H "x-api-key: $ZENMUX_API_KEY" \\
  -H "anthropic-version: 2023-06-01" \\
  -H "content-type: application/json" \\
  -d '${bodies[title]}'`
    : undefined;
}

function getVertexPython(title: string) {
  const prefix = `from google import genai
from google.genai import types

client = genai.Client(
    api_key="<YOUR_ZENMUX_API_KEY>",
    vertexai=True,
    http_options=types.HttpOptions(
        api_version="v1",
        base_url="https://zenmux.ai/api/vertex-ai",
    ),
)

`;

  const snippets: Record<string, string> = {
    "Image input": `${prefix}response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents=[
        {
            "role": "user",
            "parts": [
                {"text": "Describe this image."},
                {
                    "file_data": {
                        "mime_type": "image/jpeg",
                        "file_uri": "https://storage.googleapis.com/generativeai-downloads/images/scones.jpg",
                    }
                },
            ],
        }
    ],
)

print(response.text)`,
    "File input": `${prefix}response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents=[
        {
            "role": "user",
            "parts": [
                {
                    "file_data": {
                        "mime_type": "application/pdf",
                        "file_uri": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
                    }
                },
                {"text": "Summarize this document."},
            ],
        }
    ],
)

print(response.text)`,
    "Web search": `${prefix}response = client.models.generate_content(
    model="google/gemini-2.5-flash",
    contents="What was a positive news story from today?",
    config=types.GenerateContentConfig(
        tools=[types.Tool(google_search=types.GoogleSearch())],
    ),
)

print(response.text)`,
    Streaming: `${prefix}stream = client.models.generate_content_stream(
    model="google/gemini-2.5-flash",
    contents="Write a short product tagline.",
)

for chunk in stream:
    print(chunk.text or "", end="")`,
    Functions: `${prefix}weather_tool = types.Tool(
    function_declarations=[
        types.FunctionDeclaration(
            name="get_weather",
            description="Get the current weather for a city.",
            parameters={
                "type": "object",
                "properties": {"location": {"type": "string"}},
                "required": ["location"],
            },
        )
    ]
)

response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents="What is the weather in Shanghai?",
    config=types.GenerateContentConfig(tools=[weather_tool]),
)

print(response.function_calls)`,
    Thinking: `${prefix}response = client.models.generate_content(
    model="google/gemini-2.5-pro",
    contents="Compare two database indexing strategies for a write-heavy app.",
    config=types.GenerateContentConfig(
        thinking_config=types.ThinkingConfig(thinking_budget=16000),
    ),
)

print(response.text)`,
  };

  return snippets[title];
}

function getVertexCurl(title: string) {
  const suffix =
    title === "Streaming" ? ":streamGenerateContent?alt=sse" : ":generateContent";
  const model = title === "Web search" || title === "Streaming"
    ? "gemini-2.5-flash"
    : "gemini-2.5-pro";
  const bodies: Record<string, string> = {
    "Image input": `{
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "Describe this image." },
          {
            "fileData": {
              "mimeType": "image/jpeg",
              "fileUri": "https://storage.googleapis.com/generativeai-downloads/images/scones.jpg"
            }
          }
        ]
      }
    ]
  }`,
    "File input": `{
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "fileData": {
              "mimeType": "application/pdf",
              "fileUri": "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf"
            }
          },
          { "text": "Summarize this document." }
        ]
      }
    ]
  }`,
    "Web search": `{
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "What was a positive news story from today?" }
        ]
      }
    ],
    "tools": [{ "googleSearch": {} }]
  }`,
    Streaming: `{
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "Write a short product tagline." }
        ]
      }
    ]
  }`,
    Functions: `{
    "contents": [
      {
        "role": "user",
        "parts": [
          { "text": "What is the weather in Shanghai?" }
        ]
      }
    ],
    "tools": [
      {
        "functionDeclarations": [
          {
            "name": "get_weather",
            "description": "Get the current weather for a city.",
            "parameters": {
              "type": "object",
              "properties": {
                "location": { "type": "string" }
              },
              "required": ["location"]
            }
          }
        ]
      }
    ]
  }`,
    Thinking: `{
    "contents": [
      {
        "role": "user",
        "parts": [
          {
            "text": "Compare two database indexing strategies for a write-heavy app."
          }
        ]
      }
    ],
    "generationConfig": {
      "thinkingConfig": {
        "thinkingBudget": 16000
      }
    }
  }`,
  };

  return bodies[title]
    ? `curl https://zenmux.ai/api/vertex-ai/v1/publishers/google/models/${model}${suffix} \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $ZENMUX_API_KEY" \\
  -d '${bodies[title]}'`
    : undefined;
}

function initRequestData() {
  if (!inBrowser) return;
  docTitle.value = getPageTitle();
  const dom = document.querySelector<HTMLElement>(".api-request");
  if (dom) {
    dom.dataset.info
      ?.trim()
      .toUpperCase()
      .split(" ")
      .forEach((part) => {
        if (
          part &&
          ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"].includes(
            part,
          )
        ) {
          httpMethod.value = part;
        } else if (part) {
          requestURL.value = part.toLowerCase();
        }
      });
  }
  const labels = Array.from(
    dom?.querySelectorAll<HTMLLabelElement>(".tabs label") || [],
  );
  const themes = Array.from(
    dom?.querySelectorAll<HTMLElement>(".vp-adaptive-theme") || [],
  );
  const blocks = themes
    .map((theme, index) => {
      const pre = theme.querySelector("pre");
      const lang = theme.querySelector(".lang")?.textContent?.trim() || "";
      const label = labels[index];
      const title =
        label?.dataset.title?.trim() || label?.textContent?.trim() || lang;
      const description = label?.dataset.description?.trim() || "";
      return {
        title,
        description,
        lang,
        html: pre?.innerHTML || "",
      };
    })
    .filter((block) => block.lang && block.html);

  const hasUsageTabs = blocks.some(
    (block) => !isLanguageTitle(block.title, block.lang),
  );

  if (hasUsageTabs) {
    const examples = new Map<string, RequestExample>();

    blocks.forEach((block) => {
      if (block.lang.toLowerCase() === "json" && !block.title) {
        responseCodes.value[block.lang] = block.html;
        return;
      }

      const title = block.title || block.lang;
      let example = examples.get(title);
      if (!example) {
        example = createExample(title, block.description);
        examples.set(title, example);
      }

      example.codes[block.lang] = block.html;
      if (!example.langOptions.includes(block.lang)) {
        example.langOptions.push(block.lang);
      }
      if (!example.description && block.description) {
        example.description = block.description;
      }
    });

    requestExamples.value = Array.from(examples.values()).map((example) => {
      completeExampleMethods(example);
      return example;
    });
    if (requestExamples.value.length) {
      setCurrentExample(requestExamples.value[0]);
    }
    return;
  }

  const fallbackExample = createExample("Request", requestURL.value || "Request");

  blocks.forEach((block) => {
    if (block.lang === "json") {
      responseCodes.value[block.lang] = block.html;
    } else {
      requestCodes.value[block.lang] = block.html;
      fallbackExample.codes[block.lang] = block.html;
      if (!langOptions.value.includes(block.lang)) {
        langOptions.value.push(block.lang);
      }
      if (!fallbackExample.langOptions.includes(block.lang)) {
        fallbackExample.langOptions.push(block.lang);
      }
    }
  });

  if (fallbackExample.langOptions.length) {
    completeExampleMethods(fallbackExample);
    requestExamples.value = [fallbackExample];
    setCurrentExample(fallbackExample);
  }
}

function resetRequestData() {
  requestCodes.value = {};
  responseCodes.value = {};
  currentLang.value = "";
  langOptions.value = [];
  currentExampleId.value = "";
  requestExamples.value = [];
  httpMethod.value = "GET";
  requestURL.value = "";
  docTitle.value = "";
  copiedReq.value = false;
  copiedResp.value = false;
  copiedPath.value = false;
}

onMounted(async () => {
  await nextTick();
  initRequestData();
});

watch(
  () => page.value.filePath,
  async () => {
    resetRequestData();
    await nextTick();
    initRequestData();
  },
);

const currentExample = computed(() => {
  return (
    requestExamples.value.find((example) => example.id === currentExampleId.value) ||
    requestExamples.value[0]
  );
});
const currentLangOptions = computed(() => currentExample.value?.langOptions || []);
const rendered = computed(() => currentExample.value?.codes[currentLang.value] || "");
const renderedPlain = computed(() => htmlToPlain(rendered.value));
const json = computed(() => responseCodes.value["json"] || "");
const jsonPlain = computed(() => htmlToPlain(json.value));
const requestTitle = computed(() => {
  return docTitle.value || page.value.title || requestURL.value || "Request";
});

watch(currentExampleId, () => {
  const options = currentLangOptions.value;
  if (options.length && !options.includes(currentLang.value)) {
    currentLang.value = options[0];
  }
});

function htmlToPlain(html: string) {
  if (!html) return "";
  if (!inBrowser) return html.replace(/<[^>]*>/g, ""); // SSR fallback: strip HTML tags
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent || "";
}

async function copyText(text: string) {
  if (!inBrowser) return; // Skip copy function during SSR
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
    } else {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
    }
  } catch (e) {
    console.warn("copy failed", e);
  }
}

async function copyRequest() {
  if (!renderedPlain.value) return;
  await copyText(renderedPlain.value);
  copiedReq.value = true;
  ElMessage.success("Request copied");
  setTimeout(() => (copiedReq.value = false), 2000);
}

async function copyResponse() {
  if (!jsonPlain.value) return;
  await copyText(jsonPlain.value);
  copiedResp.value = true;
  ElMessage.success("Response copied");
  setTimeout(() => (copiedResp.value = false), 2000);
}

async function copyPath() {
  if (!requestURL.value) return;
  await copyText(requestURL.value);
  copiedPath.value = true;
  ElMessage.success("Path copied");
  setTimeout(() => (copiedPath.value = false), 1500);
}
</script>

<template>
  <div v-if="isApiRequest && requestExamples.length" class="api-float-container">
    <div
      v-if="requestExamples.length > 1"
      class="api-example-tabs"
      role="tablist"
      aria-label="Request examples"
    >
      <button
        v-for="example in requestExamples"
        :key="example.id"
        type="button"
        class="api-example-tab"
        :class="{ active: example.id === currentExampleId }"
        role="tab"
        :aria-selected="example.id === currentExampleId"
        @click="currentExampleId = example.id"
      >
        {{ example.title }}
      </button>
    </div>

    <div class="api-request-container">
      <div class="api-header">
        <div class="left">
          <span class="http-path" :title="requestTitle">
            {{ requestTitle }}
          </span>
        </div>
        <div class="right">
          <div
            class="lang-select-wrapper"
            v-if="currentLangOptions.length > 1"
            @click="onLangWrapperClick"
          >
            <el-select
              ref="langSelectRef"
              v-model="currentLang"
              placeholder="Lang"
              size="small"
              popper-class="api-lang-dropdown"
            >
              <el-option
                v-for="l in currentLangOptions"
                :key="l"
                :label="getLanguageDisplayName(l)"
                :value="l"
              />
            </el-select>
            <svg
              class="chevron-updown"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5.33 6L8 3.33 10.67 6M5.33 10L8 12.67 10.67 10"
                stroke="currentColor"
                stroke-width="1.33"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </div>
          <div v-else-if="currentLang" class="lang-static-label">
            {{ getLanguageDisplayName(currentLang) }}
          </div>
          <CheckedIcon
            v-if="copiedReq"
            class="copy-action-icon copied-icon"
            title="Copied"
            @click="copyRequest"
          />
          <CopyIcon
            v-else
            class="copy-action-icon"
            title="Copy code"
            @click="copyRequest"
          />
        </div>
      </div>
      <div class="api-content">
        <pre class="vp-code" v-html="rendered"></pre>
      </div>
    </div>

    <div class="api-request-container" v-if="json">
      <div class="api-header">
        <div class="left">
          <span class="reponse-code">200</span>
        </div>
        <div class="right">
          <CheckedIcon
            v-if="copiedResp"
            class="copy-action-icon copied-icon"
            title="Copied"
            @click="copyResponse"
          />
          <CopyIcon
            v-else
            class="copy-action-icon"
            title="Copy response"
            @click="copyResponse"
          />
        </div>
      </div>
      <div class="api-content">
        <pre class="vp-code" v-html="json"></pre>
      </div>
    </div>
  </div>
</template>

<style>
/* ===== Hide markdown-rendered version ===== */
.api-request {
  display: none;
}

.api-float-container {
  width: 100%;
}

/* ===== Usage Tabs ===== */
.api-example-tabs {
  box-sizing: border-box;
  display: flex;
  align-items: center;
  gap: 2px;
  height: 34px;
  margin: 20px 0 8px;
  padding: 2px;
  background: #f2f2f2;
  border-radius: 10px;
  overflow-x: auto;
  scrollbar-width: none;
}

.api-example-tabs::-webkit-scrollbar {
  display: none;
}

.api-example-tab {
  flex: 0 0 auto;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  height: 30px;
  padding: 0 18px;
  border: 0.2px solid transparent;
  border-radius: 8px;
  background: transparent;
  font-family:
    "SF Pro",
    -apple-system,
    BlinkMacSystemFont,
    sans-serif;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  color: #666;
  white-space: nowrap;
  cursor: pointer;
  transition:
    background-color 0.2s,
    border-color 0.2s,
    color 0.2s;
}

.api-example-tab:hover {
  color: #000;
}

.api-example-tab.active {
  background: #fff;
  border-color: #e6e6e6;
  color: #000;
  font-weight: 700;
}

.dark .api-example-tabs {
  background: var(--zm-bg-secondary);
}

.dark .api-example-tab {
  color: var(--zm-text-secondary);
}

.dark .api-example-tab:hover,
.dark .api-example-tab.active {
  color: var(--zm-text-primary);
}

.dark .api-example-tab.active {
  background: var(--zm-bg-primary);
  border-color: var(--zm-border-primary);
}

/* ===== Request / Response Container ===== */
.api-float-container .api-request-container {
  margin: 20px 0;
  background: #fafafa;
  border: 0.5px solid #e6e6e6;
  border-radius: 12px;
  overflow: hidden;
}

.api-example-tabs + .api-request-container {
  margin-top: 8px;
}

.dark .api-float-container .api-request-container {
  background: var(--zm-bg-primary);
  border-color: var(--zm-border-primary);
}

.api-float-container .api-request-container pre {
  max-height: none;
  height: auto;
}

/* ===== Header Bar (44px) ===== */
.api-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  padding: 10px 8px 10px 20px;
  border-bottom: 0.5px solid #e6e6e6;
  margin-bottom: 0;
  gap: 12px;
}

.dark .api-header {
  border-bottom-color: var(--zm-border-primary);
}

/* Left: request title */
.api-header .left {
  display: flex;
  align-items: center;
  min-width: 0;
  flex: 1;
}

.api-header .left .http-path {
  font-family: "SF Mono", monospace;
  font-size: 13px;
  font-weight: 400;
  line-height: 16px;
  color: #666;
  cursor: pointer;
  padding: 0;
  border-radius: 0;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color 0.2s;
}

.api-header .left .http-path:hover {
  color: #333;
  background: transparent;
  box-shadow: none;
  text-decoration: none;
}

.dark .api-header .left .http-path {
  color: var(--zm-text-tertiary);
}

.dark .api-header .left .http-path:hover {
  color: var(--zm-text-secondary);
}

.api-header .left .http-path.copied {
  color: #52c41a;
  background: transparent;
  box-shadow: none;
}

.api-header .left .http-path.copied::after {
  content: none;
}

/* Response code badge */
.api-header .left .reponse-code {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px 6px;
  background: #fff;
  border: 0.5px solid #e6e6e6;
  border-radius: 4px;
  font-family: "SF Mono", monospace;
  font-size: 12px;
  font-weight: 400;
  line-height: 14px;
  color: #52c41a;
  flex-shrink: 0;
  box-shadow: none;
  min-width: auto;
  height: auto;
  letter-spacing: normal;
  user-select: none;
}

.dark .api-header .left .reponse-code {
  background: var(--zm-bg-tertiary);
  border-color: var(--zm-border-primary);
}

/* Right: dropdown + copy */
.api-header .right {
  display: flex;
  align-items: center;
  flex-shrink: 0;
  width: auto;
  gap: 4px;
}

.lang-static-label {
  display: inline-flex;
  align-items: center;
  height: 24px;
  padding: 0 8px;
  font-family:
    "SF Pro",
    -apple-system,
    sans-serif;
  font-size: 13px;
  line-height: 24px;
  color: #666;
}

.dark .lang-static-label {
  color: var(--zm-text-tertiary);
}

/* ===== Copy Icon ===== */
.copy-action-icon {
  width: 12px;
  height: 12px;
  padding: 6px;
  box-sizing: content-box;
  border-radius: 4px;
  cursor: pointer;
  color: #666;
  flex-shrink: 0;
  transition: background-color 0.2s;
}

.copy-action-icon:hover {
  background-color: #e6e6e6;
  color: #666;
}

.dark .copy-action-icon {
  color: var(--zm-text-secondary);
}

.dark .copy-action-icon:hover {
  background-color: var(--zm-bg-hover);
}

.copy-action-icon.copied-icon {
  color: #52c41a;
}

/* ===== Language Dropdown (el-select overrides for Element Plus 2.13) ===== */
.api-header .el-select {
  --el-select-width: auto;
  --el-select-input-focus-border-color: transparent;
  width: auto !important;
  display: inline-flex !important;
}

.api-header .el-select .el-select__wrapper {
  background-color: transparent !important;
  box-shadow: none !important;
  min-height: 24px !important;
  padding: 0 !important;
  gap: 0 !important;
  cursor: pointer;
}

.api-header .el-select .el-select__wrapper:hover,
.api-header .el-select .el-select__wrapper.is-hovering,
.api-header .el-select .el-select__wrapper.is-focused {
  box-shadow: none !important;
}

.api-header .el-select .el-select__selection {
  gap: 0 !important;
  min-width: 0;
}

.api-header .el-select .el-select__placeholder {
  position: relative !important;
  z-index: auto !important;
  transform: none !important;
  top: auto !important;
  font-family:
    "SF Pro",
    -apple-system,
    sans-serif;
  font-size: 13px !important;
  line-height: 24px !important;
  color: #666 !important;
}

.api-header .el-select .el-select__placeholder.is-transparent {
  color: #999 !important;
}

.dark .api-header .el-select .el-select__placeholder {
  color: var(--zm-text-tertiary) !important;
}

.dark .api-header .el-select .el-select__placeholder.is-transparent {
  color: var(--zm-text-tertiary) !important;
}

.api-header .el-select .el-select__suffix {
  display: none !important;
}

.api-header .el-select .el-select__input-wrapper {
  display: none !important;
}

/* Lang select wrapper: text + chevron inline */
.lang-select-wrapper {
  display: flex;
  align-items: center;
  gap: 0;
  height: 24px;
  padding: 0 8px;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.2s;
}

.lang-select-wrapper:hover {
  background: rgba(0, 0, 0, 0.04);
}

.dark .lang-select-wrapper:hover {
  background: var(--zm-bg-hover);
}

.lang-select-wrapper .el-select {
  position: static;
}

.lang-select-wrapper .chevron-updown {
  flex-shrink: 0;
  pointer-events: none;
  color: #999;
}

.dark .lang-select-wrapper .chevron-updown {
  color: var(--zm-text-tertiary);
}

/* Dropdown popup */
.api-lang-dropdown {
  background: #fff !important;
  border: 0.5px solid #e6e6e6 !important;
  border-radius: 12px !important;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.08) !important;
  padding: 4px !important;
}

.dark .api-lang-dropdown,
.api-lang-dropdown.is-dark {
  background: var(--zm-bg-secondary) !important;
  border-color: var(--zm-border-primary) !important;
  box-shadow: 0px 4px 16px rgba(0, 0, 0, 0.3) !important;
}

.api-lang-dropdown .el-select-dropdown {
  border: none !important;
  box-shadow: none !important;
  padding: 0 !important;
  margin: 0 !important;
}

.api-lang-dropdown .el-select-dropdown__wrap {
  max-height: none !important;
  margin: 0 !important;
  padding: 0 !important;
}

.api-lang-dropdown .el-select-dropdown__list {
  padding: 0 !important;
}

.api-lang-dropdown .el-select-dropdown__item {
  height: 36px;
  line-height: 36px;
  padding: 0 12px;
  border-radius: 8px;
  font-family: var(--zenmux-nav-font);
  font-size: 14px;
  font-weight: 400;
  color: rgba(102, 102, 102, 0.88);
}

.dark .api-lang-dropdown .el-select-dropdown__item,
.api-lang-dropdown.is-dark .el-select-dropdown__item {
  color: var(--zm-text-secondary);
}

.api-lang-dropdown .el-select-dropdown__item.is-selected,
.api-lang-dropdown .el-select-dropdown__item.hover,
.api-lang-dropdown .el-select-dropdown__item:hover {
  background: #f5f5f5;
  color: #000;
  font-weight: 400;
}

.dark .api-lang-dropdown .el-select-dropdown__item.is-selected,
.dark .api-lang-dropdown .el-select-dropdown__item.hover,
.dark .api-lang-dropdown .el-select-dropdown__item:hover,
.api-lang-dropdown.is-dark .el-select-dropdown__item.is-selected,
.api-lang-dropdown.is-dark .el-select-dropdown__item.hover,
.api-lang-dropdown.is-dark .el-select-dropdown__item:hover {
  background: var(--zm-bg-hover);
  color: var(--zm-text-primary);
}

.api-lang-dropdown .el-popper__arrow {
  display: none;
}

/* ===== Code Area (scoped under .api-float-container for specificity) ===== */
.api-float-container .api-content {
  min-height: auto;
  max-height: none;
  height: auto;
  background: transparent;
  overflow: visible;
  width: 100%;
  border-radius: 0;
}

.api-float-container .api-content pre {
  margin: 0;
  padding: 16px 20px;
  counter-reset: line-number;
}

.api-float-container .api-content pre code {
  display: block;
  padding: 0 !important;
  width: fit-content;
  min-width: 100%;
  font-family: "SF Mono", monospace;
  font-size: 0 !important;
  line-height: 0 !important;
  color: #000;
}

.dark .api-float-container .api-content pre code {
  color: var(--zm-text-primary);
}

/* Line numbers via CSS counters */
.api-float-container .api-content pre .line {
  display: block;
  font-size: 13px;
  line-height: 24px;
}

.api-float-container .api-content pre .line::before {
  counter-increment: line-number;
  content: counter(line-number);
  display: inline-block;
  width: 2ch;
  margin-right: 12px;
  text-align: right;
  color: #ccc;
  font-family: "SF Mono", monospace;
  font-size: 13px;
  line-height: 24px;
  user-select: none;
}

.dark .api-float-container .api-content pre .line::before {
  color: rgba(255, 255, 255, 0.2);
}

/* ===== Layout on API pages ===== */
.api-page .VPDoc .content {
  margin-right: min(400px, calc(100vw - 912px));
}

@media (min-width: 1520px) {
  .api-page .VPDoc .content {
    margin-right: min(554px, calc(100vw - 758px));
  }
  html.ai-panel-open .api-page .VPDoc .content {
    margin-right: min(400px, calc(100vw - 912px));
  }
}

@media (max-width: 1280px) {
  .api-page .VPDoc .content {
    margin-right: 0;
  }

  .VPDoc {
    padding-right: 20px;
  }
}
</style>
