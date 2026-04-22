<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";

interface Endpoint {
  title: string;
  path: string;
  iconType: "chat" | "models" | "generate" | "embeddings";
  docUrl?: string;
}

interface Provider {
  name: string;
  subtitle: string;
  baseUrl: string;
  supportedModels: {
    iconList: string[];
    url: string;
  };
  iconType: "openai" | "anthropic" | "google";
  endpoints: Endpoint[];
}

const providersData: Provider[] = [
  {
    name: "OpenAI",
    subtitle: "OpenAI Compatible",
    baseUrl: "https://zenmux.ai/api/v1",
    iconType: "openai",
    supportedModels: {
      iconList: [
        "https://cdn.marmot-cloud.com/storage/zenmux/2025/10/15/Mm7IePA/Property-1GPT.svg",
        "https://cdn.marmot-cloud.com/storage/zenmux/2025/10/15/tmeJLqx/Property-1deepseek.svg",
        "https://cdn.marmot-cloud.com/storage/zenmux/2025/10/15/fgcKbqA/Property-1Qwen.svg",
      ],
      url: "/models?supported_protocol=chat.completions",
    },
    endpoints: [
      {
        title: "Create Chat Completion",
        path: "/chat/completions",
        iconType: "chat",
        docUrl: "/docs/api/openai/create-chat-completion.html",
      },
      {
        title: "Responses",
        path: "/responses",
        iconType: "chat",
        docUrl: "/docs/api/openai/openai-responses.html",
      },
      {
        title: "Embeddings",
        path: "/embeddings",
        iconType: "embeddings",
        docUrl: "/docs/api/openai/create-embeddings.html",
      },
      {
        title: "List Models",
        path: "/models",
        iconType: "models",
        docUrl: "/docs/api/openai/openai-list-models.html",
      },
    ],
  },
  {
    name: "Anthropic",
    subtitle: "Anthropic Messages",
    baseUrl: "https://zenmux.ai/api/anthropic",
    iconType: "anthropic",
    supportedModels: {
      iconList: [
        "https://cdn.marmot-cloud.com/storage/zenmux/2025/10/15/dzvOyI0/Property-1Claude.svg",
        "https://cdn.marmot-cloud.com/storage/zenmux/2025/10/15/6NHK3N6/Property-1Grok.svg",
        "https://cdn.marmot-cloud.com/storage/zenmux/2025/10/15/mitcnMm/Property-1KIMI.svg",
      ],
      url: "/models?supported_protocol=messages",
    },
    endpoints: [
      {
        title: "Create a Message",
        path: "/v1/messages",
        iconType: "chat",
        docUrl: "/docs/api/anthropic/create-messages.html",
      },
      {
        title: "List Models",
        path: "/v1/models",
        iconType: "models",
        docUrl: "/docs/api/anthropic/anthropic-list-models.html",
      },
    ],
  },
  {
    name: "Google Vertex AI",
    subtitle: "Vertex AI Compatible",
    baseUrl: "https://zenmux.ai/api/vertex-ai",
    iconType: "google",
    supportedModels: {
      iconList: [
        "https://cdn.marmot-cloud.com/storage/zenmux/2025/12/25/XQVLSt6/Gemini-model-logo.svg",
        "https://cdn.marmot-cloud.com/storage/zenmux/2025/12/25/X7rFgso/Property-1Ling.svg",
      ],
      url: "/models?supported_protocol=gemini",
    },
    endpoints: [
      {
        title: "Generate Content",
        path: "/v1/publishers/{provider}/models/{model}:generateContent",
        iconType: "generate",
        docUrl: "/docs/api/vertexai/generate-content.html",
      },
      {
        title: "Stream Generate Content",
        path: "/v1/publishers/{provider}/models/{model}:streamGenerateContent",
        iconType: "generate",
        docUrl: "/docs/api/vertexai/generate-content.html",
      },
      {
        title: "List Models",
        path: "/v1beta/models",
        iconType: "models",
        docUrl: "/docs/api/vertexai/google-list-models.html",
      },
    ],
  },
];

const open = ref(false);
const copyTip = ref<string | null>(null);
const shareLinkCopied = ref(false);

const handleToggle = () => {
  open.value = !open.value;
};

const handleClose = () => {
  open.value = false;
};

const handleOverlayClick = (e: MouseEvent) => {
  if ((e.target as HTMLElement).classList.contains("endpoint-drawer-overlay")) {
    handleClose();
  }
};

const handleCopy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text);
    copyTip.value = text;
    setTimeout(() => {
      copyTip.value = null;
    }, 1500);
  } catch {
    // silently fail
  }
};

const openDoc = (url: string) => {
  if (typeof window !== "undefined") {
    window.open(url, "_blank");
  }
};

const handleCopyShareLink = async () => {
  try {
    const shareUrl = `${window.location.origin}${window.location.pathname}?endpoints=open`;
    await navigator.clipboard.writeText(shareUrl);
    shareLinkCopied.value = true;
    setTimeout(() => {
      shareLinkCopied.value = false;
    }, 1500);
  } catch {
    // silently fail
  }
};

const handleKeydown = (e: KeyboardEvent) => {
  if (e.key === "Escape") handleClose();
};

onMounted(() => {
  document.addEventListener("endpoints", handleToggle);
  document.addEventListener("keydown", handleKeydown);
});

onUnmounted(() => {
  document.removeEventListener("endpoints", handleToggle);
  document.removeEventListener("keydown", handleKeydown);
});
</script>

<template>
  <Teleport to="body">
    <Transition name="endpoint-drawer">
      <div
        v-if="open"
        class="endpoint-drawer-overlay"
        @click="handleOverlayClick"
      >
        <div class="endpoint-drawer">
          <div class="endpoint-drawer-header">
            <h2 class="endpoint-drawer-title">API Endpoints</h2>
            <div class="endpoint-drawer-header-actions">
              <button
                class="icon-btn share-link-btn"
                title="Copy share link"
                @click="handleCopyShareLink"
              >
                <!-- Link icon -->
                <svg
                  width="16"
                  height="16"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <path
                    d="M6.667 8.667a3.333 3.333 0 0 0 5.026.36l2-2a3.334 3.334 0 0 0-4.713-4.714L8 3.293"
                  />
                  <path
                    d="M9.333 7.333a3.333 3.333 0 0 0-5.026-.36l-2 2a3.334 3.334 0 0 0 4.713 4.714L8 12.707"
                  />
                </svg>
                <span v-if="shareLinkCopied" class="copy-tooltip">Copied!</span>
              </button>
              <button class="endpoint-drawer-close" @click="handleClose">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          </div>
          <div class="endpoint-drawer-body">
            <div
              v-for="(provider, idx) in providersData"
              :key="idx"
              class="provider-card"
            >
              <!-- Provider Header -->
              <div class="provider-header">
                <div class="provider-icon-wrapper">
                  <!-- OpenAI icon -->
                  <svg
                    v-if="provider.iconType === 'openai'"
                    width="20"
                    height="20"
                    viewBox="0 0 28 28"
                    fill="currentColor"
                  >
                    <path
                      d="M25.286 11.64a6.4 6.4 0 0 0-.564-5.319 6.66 6.66 0 0 0-5.757-3.289q-.705 0-1.394.146a6.6 6.6 0 0 0-2.218-1.609A6.6 6.6 0 0 0 12.66 1h-.041L12.604 1c-2.88 0-5.432 1.833-6.318 4.536a6.6 6.6 0 0 0-2.538 1.103 6.5 6.5 0 0 0-1.85 2.039A6.5 6.5 0 0 0 1 11.966c0 1.623.61 3.189 1.714 4.393a6.4 6.4 0 0 0 .563 5.32A6.6 6.6 0 0 0 6.333 24.4a6.72 6.72 0 0 0 4.095.421 6.6 6.6 0 0 0 2.219 1.608 6.6 6.6 0 0 0 2.691.57h.059c2.88 0 5.433-1.833 6.318-4.538a6.6 6.6 0 0 0 2.539-1.104 6.5 6.5 0 0 0 1.85-2.039 6.48 6.48 0 0 0-.818-7.678M15.382 25.3h-.007a4.97 4.97 0 0 1-3.155-1.128q.08-.04.156-.087l5.247-2.99a.85.85 0 0 0 .431-.732V13.06l2.218 1.264a.08.08 0 0 1 .043.06v6.044c-.003 2.687-2.21 4.867-4.933 4.872m-10.61-4.47a4.8 4.8 0 0 1-.59-3.266l.156.092 5.247 2.99a.86.86 0 0 0 .862 0l6.406-3.65v2.532a.08.08 0 0 1-.032.063l-5.304 3.021a5 5 0 0 1-4.936-.001 4.9 4.9 0 0 1-1.81-1.782M3.392 9.527a4.9 4.9 0 0 1 2.57-2.137l-.003.179v5.985a.83.83 0 0 0 .43.731l6.407 3.65-2.218 1.262a.08.08 0 0 1-.075.007L5.2 16.181a4.9 4.9 0 0 1-1.805-1.785 4.83 4.83 0 0 1-.002-4.868m18.22 4.183-6.406-3.65L17.424 8.8a.08.08 0 0 1 .075-.007l5.304 3.022a4.9 4.9 0 0 1 1.807 1.784c.433.74.661 1.58.662 2.436 0 2.041-1.291 3.868-3.232 4.573V14.44a.83.83 0 0 0-.428-.729m2.207-3.278-.156-.091-5.247-2.99a.87.87 0 0 0-.861 0L11.149 11V8.469c0-.024.012-.048.032-.062l5.304-3.02a5 5 0 0 1 2.467-.65c2.727 0 4.938 2.181 4.938 4.872q0 .415-.071.824M9.943 14.937l-2.218-1.263a.08.08 0 0 1-.043-.06V7.569C7.683 4.88 9.895 2.7 12.62 2.7c1.154.001 2.272.4 3.16 1.129-.04.021-.11.06-.156.087l-5.247 2.99a.85.85 0 0 0-.431.731v.005zm1.205-2.563L14 10.748l2.853 1.625v3.251L14 17.249l-2.853-1.625z"
                    />
                  </svg>
                  <!-- Anthropic icon -->
                  <svg
                    v-else-if="provider.iconType === 'anthropic'"
                    width="20"
                    height="20"
                    viewBox="0 0 28 28"
                    fill="currentColor"
                    fill-rule="evenodd"
                    clip-rule="evenodd"
                  >
                    <path
                      d="M15.827 5.5h3.603L26 21.98h-3.603zm-7.258 0h3.767l6.57 16.48h-3.674l-1.343-3.461H7.017l-1.344 3.46H2L8.57 5.502zm4.132 9.959-2.248-5.792-2.248 5.793H12.7z"
                    />
                  </svg>
                  <!-- Google icon -->
                  <img
                    v-else
                    src="https://cdn.marmot-cloud.com/storage/zenmux/2026/01/21/gUA1fLu/Property-1Google.svg"
                    :alt="provider.iconType"
                    width="20"
                    height="20"
                  />
                </div>
                <div>
                  <div class="provider-name">{{ provider.name }}</div>
                  <div class="provider-subtitle">{{ provider.subtitle }}</div>
                </div>
              </div>

              <hr class="provider-divider" />

              <!-- Base URL -->
              <div class="section-label">Base URL</div>
              <div class="base-url-box">
                <span class="base-url-text">{{ provider.baseUrl }}</span>
                <button
                  class="icon-btn"
                  title="Copy"
                  @click="handleCopy(provider.baseUrl)"
                >
                  <svg
                    width="14"
                    height="15"
                    viewBox="0 0 14 15"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.167"
                  >
                    <path
                      d="M3.791 4v-.292c0-.966.784-1.75 1.75-1.75h5.25c.966 0 1.75.784 1.75 1.75v5.25a1.75 1.75 0 0 1-1.75 1.75h-.292M8.166 4.585h-5.25a1.75 1.75 0 0 0-1.75 1.75v5.25c0 .966.784 1.75 1.75 1.75h5.25a1.75 1.75 0 0 0 1.75-1.75v-5.25a1.75 1.75 0 0 0-1.75-1.75"
                    />
                  </svg>
                  <span v-if="copyTip === provider.baseUrl" class="copy-tooltip"
                    >Copied!</span
                  >
                </button>
              </div>

              <!-- Endpoints -->
              <div class="section-label">Endpoints</div>
              <div class="endpoints-grid">
                <div
                  v-for="(endpoint, eIdx) in provider.endpoints"
                  :key="eIdx"
                  class="endpoint-item"
                >
                  <div class="endpoint-info">
                    <div class="endpoint-icon-wrapper">
                      <!-- Chat icon -->
                      <svg
                        v-if="endpoint.iconType === 'chat'"
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M17.503 9.515c0-3.604-3.276-6.67-7.504-6.67S2.496 5.91 2.496 9.515c0 1.675.695 3.216 1.867 4.401.41.414.62 1.037.45 1.657l-.355 1.302v.002l.003.003 5.766-.68a1 1 0 0 1 .16-.024l.376-.026c3.855-.344 6.74-3.251 6.74-6.635M6.675 9.102a.83.83 0 0 1 0 1.66h-.009a.83.83 0 0 1 0-1.66zm3.333 0a.83.83 0 0 1 0 1.66h-.009a.83.83 0 0 1 0-1.66zm3.333 0a.83.83 0 0 1 0 1.66h-.008a.83.83 0 0 1 0-1.66zm5.822.413c0 4.497-3.87 8.043-8.584 8.311q-.034.009-.07.014l-5.853.688a1.664 1.664 0 0 1-1.8-2.09l.356-1.301-.002-.01a.1.1 0 0 0-.027-.044C1.733 13.618.836 11.667.836 9.515c0-4.68 4.187-8.33 9.163-8.33s9.164 3.649 9.164 8.33"
                        />
                      </svg>
                      <!-- Models icon -->
                      <svg
                        v-else-if="endpoint.iconType === 'models'"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path
                          d="M10 14.666V14H8.666v.666a.667.667 0 1 1-1.333 0V14H6v.666a.667.667 0 0 1-1.334 0v-.734a3.34 3.34 0 0 1-2.6-2.599h-.733a.667.667 0 0 1 0-1.333H2V8.666h-.667a.667.667 0 1 1 0-1.333H2V6h-.667a.667.667 0 0 1 0-1.334h.734a3.34 3.34 0 0 1 2.6-2.6v-.733a.667.667 0 0 1 1.333 0V2h1.333v-.667a.667.667 0 0 1 1.333 0V2H10v-.667a.667.667 0 1 1 1.333 0v.734a3.34 3.34 0 0 1 2.6 2.6h.733a.667.667 0 0 1 0 1.333H14v1.333h.666a.667.667 0 0 1 0 1.333H14V10h.666a.667.667 0 1 1 0 1.333h-.733a3.34 3.34 0 0 1-2.6 2.599v.734a.667.667 0 0 1-1.333 0M5.333 3.333a2 2 0 0 0-2 2v5.333a2 2 0 0 0 2 2h5.333a2 2 0 0 0 2-2V5.333a2 2 0 0 0-2-2zm1.333 3.333v2.667h2.667V6.666zm4 2.667c0 .737-.596 1.333-1.333 1.333H6.666a1.333 1.333 0 0 1-1.333-1.333V6.666c0-.736.597-1.333 1.333-1.333h2.667c.736 0 1.333.597 1.333 1.333z"
                        />
                      </svg>
                      <!-- Embeddings icon -->
                      <svg
                        v-else-if="endpoint.iconType === 'embeddings'"
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="currentColor"
                      >
                        <path d="M2 3.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m4.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m4.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0M2 8a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m4.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m4.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0M2 12.5a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m4.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0m4.5 0a1.5 1.5 0 1 1 3 0 1.5 1.5 0 0 1-3 0" />
                      </svg>
                      <!-- Generate icon -->
                      <svg
                        v-else
                        width="16"
                        height="16"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          d="M8.447 2.229a1.128 1.128 0 0 1 1.884 0l.084.156L12.5 6.999l4.615 2.086c.884.399.884 1.654 0 2.053L12.5 13.222l-2.085 4.615c-.399.884-1.654.884-2.053 0l-2.085-4.615-4.614-2.084c-.884-.4-.884-1.654 0-2.053l4.614-2.086 2.085-4.614zm-.778 5.6c-.113.25-.313.45-.563.562l-3.808 1.72 3.808 1.72c.25.113.45.313.563.563l1.72 3.807 1.72-3.807.046-.091c.117-.208.298-.373.516-.472l3.808-1.72-3.808-1.72a1.13 1.13 0 0 1-.562-.562L9.389 4.02zM15.861.943c.356-.633 1.33-.587 1.598.135l.477 1.29 1.29.478c.77.285.77 1.374 0 1.66l-1.29.477-.477 1.29c-.286.77-1.375.77-1.66 0l-.478-1.29-1.29-.478c-.77-.285-.77-1.374 0-1.66l1.29-.478.478-1.29zm.478 1.92a.88.88 0 0 1-.523.522l-.783.29.783.29a.89.89 0 0 1 .485.434l.038.09.29.782.29-.783.038-.089c.1-.2.273-.355.485-.433l.782-.29-.782-.29a.88.88 0 0 1-.523-.523l-.29-.784z"
                        />
                      </svg>
                    </div>
                    <div class="endpoint-text">
                      <div class="endpoint-title">{{ endpoint.title }}</div>
                      <div class="endpoint-path">{{ endpoint.path }}</div>
                    </div>
                  </div>
                  <div class="endpoint-actions">
                    <button
                      v-if="endpoint.docUrl"
                      class="icon-btn"
                      title="Docs"
                      @click="openDoc(endpoint.docUrl!)"
                    >
                      <!-- IconPdf -->
                      <svg
                        width="14"
                        height="14"
                        viewBox="0 0 16 16"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-width="1.333"
                      >
                        <path
                          d="M5.333 8H8m1.667-6v2c0 .736.597 1.333 1.333 1.333h2.333m-8 5.334H10m-.724-9.334H4a2 2 0 0 0-2 2v9.334a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V5.603a2 2 0 0 0-.72-1.536l-2.724-2.27a2 2 0 0 0-1.28-.464Z"
                        />
                      </svg>
                    </button>
                    <button
                      class="icon-btn"
                      title="Copy"
                      @click="handleCopy(endpoint.path)"
                    >
                      <svg
                        width="14"
                        height="15"
                        viewBox="0 0 14 15"
                        fill="none"
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="1.167"
                      >
                        <path
                          d="M3.791 4v-.292c0-.966.784-1.75 1.75-1.75h5.25c.966 0 1.75.784 1.75 1.75v5.25a1.75 1.75 0 0 1-1.75 1.75h-.292M8.166 4.585h-5.25a1.75 1.75 0 0 0-1.75 1.75v5.25c0 .966.784 1.75 1.75 1.75h5.25a1.75 1.75 0 0 0 1.75-1.75v-5.25a1.75 1.75 0 0 0-1.75-1.75"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- Supported Models -->
              <div class="section-label">Supported Models</div>
              <div class="supported-models">
                <div class="avatar-group">
                  <img
                    v-for="(avatar, aIdx) in provider.supportedModels.iconList"
                    :key="aIdx"
                    :src="avatar.trim()"
                    class="model-avatar"
                    width="20"
                    height="20"
                  />
                  <span class="model-avatar-more">···</span>
                </div>
                <a
                  :href="provider.supportedModels.url"
                  target="_blank"
                  rel="noreferrer"
                  class="explore-models-link"
                >
                  Explore All Models
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 14 14"
                    fill="currentColor"
                  >
                    <path
                      d="M1.167 10.5V4.667A2.334 2.334 0 0 1 3.5 2.333h2.886a.584.584 0 0 1 0 1.167H3.5c-.644 0-1.167.523-1.167 1.167V10.5c0 .644.523 1.167 1.167 1.167h5.833c.644 0 1.167-.523 1.167-1.167V7.629a.584.584 0 0 1 1.167 0V10.5a2.334 2.334 0 0 1-2.334 2.333H3.5A2.333 2.333 0 0 1 1.167 10.5m11.666-5.833a.583.583 0 0 1-1.166 0v-1.51L7.121 7.704a.584.584 0 0 1-.825-.825l4.547-4.546h-1.51a.583.583 0 0 1 0-1.166h2.625c.483 0 .875.392.875.875z"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.endpoint-drawer-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  z-index: 200;
  display: flex;
  justify-content: flex-end;
}

.endpoint-drawer {
  width: 50%;
  max-width: 100%;
  height: 100%;
  background: var(--vp-c-bg);
  box-shadow: -6px 0 16px rgba(0, 0, 0, 0.08);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

@media (max-width: 768px) {
  .endpoint-drawer {
    width: 100%;
  }
}

.endpoint-drawer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid var(--vp-c-divider);
}

.endpoint-drawer-title {
  margin: 0;
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.endpoint-drawer-header-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.share-link-btn {
  position: relative;
}

.endpoint-drawer-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--vp-c-text-2);
  border-radius: 4px;
  transition: background-color 0.2s;
}

.endpoint-drawer-close:hover {
  background-color: var(--vp-c-default-soft);
}

.endpoint-drawer-desc {
  padding: 16px 24px 0;
  font-size: 14px;
  color: var(--vp-c-text-2);
}

.endpoint-drawer-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  text-decoration: underline;
  color: var(--vp-c-text-1);
  margin-left: 8px;
}

.endpoint-drawer-body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.provider-card {
  border: 1px solid var(--vp-c-divider);
  border-radius: 16px;
  padding: 20px;
}

.provider-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.provider-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: var(--vp-c-default-soft);
  flex-shrink: 0;
}

.provider-name {
  font-size: 16px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.provider-subtitle {
  font-size: 12px;
  color: var(--vp-c-text-3);
}

.provider-divider {
  border: none;
  border-top: 1px dashed var(--vp-c-divider);
  margin: 24px 0;
}

.section-label {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin-bottom: 12px;
}

.base-url-box {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  padding: 0 12px;
  height: 40px;
  margin-bottom: 24px;
}

.base-url-text {
  font-size: 14px;
  color: var(--vp-c-text-1);
}

.icon-btn {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--vp-c-text-3);
  padding: 4px;
  border-radius: 4px;
  transition: color 0.2s;
}

.icon-btn:hover {
  color: var(--vp-c-text-2);
}

.copy-tooltip {
  position: absolute;
  top: -28px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--vp-c-text-1);
  color: var(--vp-c-bg);
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
  white-space: nowrap;
  pointer-events: none;
}

.endpoints-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-bottom: 24px;
}

@media (max-width: 640px) {
  .endpoints-grid {
    grid-template-columns: 1fr;
  }
}

.endpoint-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
}

.endpoint-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.endpoint-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
  background: var(--vp-c-default-soft);
  border-radius: 8px;
  color: var(--vp-c-text-2);
  flex-shrink: 0;
}

.endpoint-text {
  flex: 1;
}

.endpoint-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
  line-height: 17px;
  color: var(--vp-c-text-1);
}

.endpoint-path {
  font-size: 12px;
  color: var(--vp-c-text-3);
  word-break: break-all;
  line-height: 14px;
}

.endpoint-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  opacity: 0;
  transition: opacity 0.2s;
}

.endpoint-item:hover .endpoint-actions {
  opacity: 1;
}

.supported-models {
  display: flex;
  align-items: center;
  gap: 6px;
}

.avatar-group {
  display: flex;
  align-items: center;
}

.model-avatar {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: 1px solid #fff;
  margin-left: -4px;
}

.model-avatar:first-child {
  margin-left: 0;
}

.dark .model-avatar {
  border-color: var(--vp-c-bg);
}

.model-avatar-more {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #f0f0f0;
  border: 1px solid #fff;
  margin-left: -4px;
  font-size: 12px;
  line-height: 16px;
  color: var(--vp-c-text-2);
}

.dark .model-avatar-more {
  background: #333;
  border-color: var(--vp-c-bg);
}

.explore-models-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 13px;
  text-decoration: underline;
  cursor: pointer;
  color: var(--vp-c-text-1);
}

/* Transition animations */
.endpoint-drawer-enter-active {
  transition: opacity 0.3s ease;
}

.endpoint-drawer-enter-active .endpoint-drawer {
  transition: transform 0.3s ease;
}

.endpoint-drawer-leave-active {
  transition: opacity 0.3s ease;
}

.endpoint-drawer-leave-active .endpoint-drawer {
  transition: transform 0.3s ease;
}

.endpoint-drawer-enter-from {
  opacity: 0;
}

.endpoint-drawer-enter-from .endpoint-drawer {
  transform: translateX(100%);
}

.endpoint-drawer-leave-to {
  opacity: 0;
}

.endpoint-drawer-leave-to .endpoint-drawer {
  transform: translateX(100%);
}
</style>
