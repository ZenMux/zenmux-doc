<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, watch, computed } from "vue";
import { marked } from "marked";
import { useDocContext } from "./composables/use-doc-context";
import { useChatStream } from "./composables/use-chat-stream";
import { useImageAttach } from "./composables/use-image-attach";
import ChatFrame from "./icons/ChatFrame.vue";
import IconCollapse from "./icons/IconCollapse.vue";
import IconExpand from "./icons/IconExpand.vue";
import IconSync from "./icons/IconSync.vue";
import Close from "./icons/Close.vue";
import ImageIcon from "./icons/Image.vue";
import IconSendV5 from "./icons/IconSendV5.vue";
import IconStop from "./icons/IconStop.vue";

const panelOpen = ref(false);
const maximized = ref(false);
const inputText = ref("");
const messagesContainer = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLTextAreaElement | null>(null);
const fileInputRef = ref<HTMLInputElement | null>(null);
const isDragging = ref(false);

const { isZh } = useDocContext();
const { messages, isStreaming, sendMessage, stopStream, clearChat } =
  useChatStream();
const {
  pendingImages,
  errorMessage: imageError,
  addFiles,
  removeImage,
  clearImages,
} = useImageAttach();

const welcomeMessage = computed(() =>
  isZh.value
    ? "Hi! 我是 AI 助手，可以帮你解答关于 ZenMux 文档的问题。"
    : "Hi! I'm an AI assistant with access to documentation and other content.",
);

const inputPlaceholder = computed(() =>
  isZh.value ? "输入你的问题..." : "Ask AI a question...",
);

// --- Body class to push content ---

function updateBodyClass() {
  if (typeof document === "undefined") return;
  if (panelOpen.value) {
    document.documentElement.classList.add("ai-panel-open");
    if (maximized.value) {
      document.documentElement.classList.add("ai-panel-maximized");
    } else {
      document.documentElement.classList.remove("ai-panel-maximized");
    }
  } else {
    document.documentElement.classList.remove(
      "ai-panel-open",
      "ai-panel-maximized",
    );
  }
}

watch([panelOpen, maximized], updateBodyClass);

// --- Panel controls ---

function togglePanel() {
  panelOpen.value = !panelOpen.value;
  if (panelOpen.value) {
    nextTick(() => {
      inputRef.value?.focus();
      scrollToBottom();
    });
  }
}

function closePanel() {
  panelOpen.value = false;
}

function toggleMaximize() {
  maximized.value = !maximized.value;
}

function handleRefresh() {
  clearChat();
}

// --- Messaging ---

async function handleSend() {
  const text = inputText.value.trim();
  if ((!text && !pendingImages.value.length) || isStreaming.value) return;
  const images = pendingImages.value.length
    ? [...pendingImages.value]
    : undefined;
  inputText.value = "";
  clearImages();
  resetTextareaHeight();
  await sendMessage(text || "(image)", isZh.value ? "zh" : "en", images);
}

function handleStop() {
  stopStream();
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === "Enter" && !e.shiftKey && !e.isComposing) {
    e.preventDefault();
    handleSend();
  }
}

// --- Image attachment ---

function handlePaste(e: ClipboardEvent) {
  const files = Array.from(e.clipboardData?.files || []).filter((f) =>
    f.type.startsWith("image/"),
  );
  if (files.length) {
    e.preventDefault();
    addFiles(files);
  }
}

function handleDragOver(e: DragEvent) {
  e.preventDefault();
  isDragging.value = true;
}

function handleDragLeave() {
  isDragging.value = false;
}

function handleDrop(e: DragEvent) {
  e.preventDefault();
  isDragging.value = false;
  const files = Array.from(e.dataTransfer?.files || []).filter((f) =>
    f.type.startsWith("image/"),
  );
  if (files.length) addFiles(files);
}

function openFilePicker() {
  fileInputRef.value?.click();
}

function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement;
  if (input.files?.length) {
    addFiles(input.files);
    input.value = "";
  }
}

// --- Auto-scroll ---

let userScrolledUp = false;

function onMessagesScroll() {
  if (!messagesContainer.value) return;
  const el = messagesContainer.value;
  const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 50;
  userScrolledUp = !atBottom;
}

function scrollToBottom() {
  if (userScrolledUp) return;
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
    }
  });
}

watch(
  messages,
  () => {
    scrollToBottom();
  },
  { deep: true },
);

// --- Textarea auto-resize ---

function handleInput(e: Event) {
  const target = e.target as HTMLTextAreaElement;
  target.style.height = "auto";
  target.style.height = Math.min(target.scrollHeight, 120) + "px";
}

function resetTextareaHeight() {
  nextTick(() => {
    if (inputRef.value) {
      inputRef.value.style.height = "auto";
    }
  });
}

// --- Markdown rendering ---

function renderMarkdown(content: string): string {
  if (!content) return "";
  try {
    return marked.parse(content, { async: false }) as string;
  } catch {
    return content;
  }
}

// --- Keyboard shortcut ---

function handleGlobalKeydown(e: KeyboardEvent) {
  if ((e.metaKey || e.ctrlKey) && e.key === "j") {
    e.preventDefault();
    togglePanel();
    return;
  }
  if (e.key === "Escape" && panelOpen.value) {
    closePanel();
  }
}

onMounted(() => {
  document.addEventListener("keydown", handleGlobalKeydown);
  updateBodyClass();
});

onUnmounted(() => {
  document.removeEventListener("keydown", handleGlobalKeydown);
  document.documentElement.classList.remove(
    "ai-panel-open",
    "ai-panel-maximized",
  );
});
</script>

<template>
    <!-- Trigger button in navbar -->
    <div class="ai-trigger-divider" />
    <button
      class="ai-trigger"
      :class="{ active: panelOpen }"
      title="Ask AI (⌘J)"
      @click="togglePanel"
    >
      <ChatFrame class="ai-trigger-icon" />
    </button>

    <!-- Right sidebar panel -->
    <Teleport to="body">
      <Transition name="ai-sidebar">
        <div v-if="panelOpen" class="ai-sidebar" :class="{ maximized }">
          <!-- Header -->
          <div class="ai-sidebar-header">
            <div class="ai-sidebar-title">
              <ChatFrame width="14" height="14" />
              <span>Assistant</span>
            </div>
            <div class="ai-sidebar-actions">
              <button
                class="ai-icon-btn"
                :title="maximized ? 'Minimize' : 'Maximize'"
                @click="toggleMaximize"
              >
                <IconCollapse v-if="maximized" width="15" height="15" />
                <IconExpand v-else width="15" height="15" />
              </button>
              <button
                class="ai-icon-btn"
                title="New conversation"
                @click="handleRefresh"
              >
                <IconSync width="15" height="15" />
              </button>
              <button class="ai-icon-btn" title="Close" @click="closePanel">
                <Close width="15" height="15" />
              </button>
            </div>
          </div>

          <!-- Messages area -->
          <div
            ref="messagesContainer"
            class="ai-messages"
            @scroll="onMessagesScroll"
          >
            <!-- Welcome message -->
            <div v-if="messages.length === 0" class="ai-welcome">
              <p class="ai-welcome-text">{{ welcomeMessage }}</p>
              <p class="ai-welcome-tip">
                {{
                  isZh
                    ? "提示：你可以使用 ⌘ + J 来切换此面板"
                    : "Tip: You can toggle this pane with ⌘ + J"
                }}
              </p>
            </div>

            <!-- Message list -->
            <template v-for="msg in messages" :key="msg.id">
              <!-- User message -->
              <div v-if="msg.role === 'user'" class="ai-msg ai-msg-user">
                <div class="ai-msg-bubble-user">
                  <div v-if="msg.images?.length" class="ai-msg-images">
                    <img
                      v-for="(img, idx) in msg.images"
                      :key="idx"
                      :src="img"
                      class="ai-msg-image-thumb"
                      alt="Attached image"
                    />
                  </div>
                  {{ msg.content }}
                </div>
              </div>

              <!-- Assistant message -->
              <div v-else class="ai-msg ai-msg-assistant">
                <div v-if="msg.error" class="ai-msg-error">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <span>{{ msg.error }}</span>
                </div>
                <div
                  v-else-if="msg.content"
                  class="ai-msg-content vp-doc"
                  v-html="renderMarkdown(msg.content)"
                />
                <div v-else-if="msg.isStreaming" class="ai-msg-loading">
                  <span class="ai-dot" /><span class="ai-dot" /><span
                    class="ai-dot"
                  />
                </div>

                <!-- Source cards -->
                <div
                  v-if="!msg.isStreaming && msg.sources?.length"
                  class="ai-sources"
                >
                  <a
                    v-for="(src, idx) in msg.sources"
                    :key="src.path"
                    :href="src.path"
                    class="ai-source-card"
                  >
                    <span class="ai-source-index">{{ idx + 1 }}</span>
                    <span class="ai-source-info">
                      <span class="ai-source-title">{{ src.title }}</span>
                      <span class="ai-source-url">{{ src.url }}</span>
                    </span>
                  </a>
                </div>
              </div>
            </template>
          </div>

          <!-- Input area -->
          <input
            ref="fileInputRef"
            type="file"
            accept="image/png,image/jpeg,image/gif,image/webp"
            multiple
            style="display: none"
            @change="handleFileChange"
          />
          <div
            class="ai-input-area"
            :class="{ 'ai-drag-over': isDragging }"
            @dragover="handleDragOver"
            @dragleave="handleDragLeave"
            @drop="handleDrop"
          >
            <!-- Pending image previews -->
            <div v-if="pendingImages.length" class="ai-image-previews">
              <div
                v-for="(img, idx) in pendingImages"
                :key="idx"
                class="ai-image-preview"
              >
                <img :src="img" alt="Attached image" />
                <button class="ai-image-remove" @click="removeImage(idx)">
                  <svg
                    width="10"
                    height="10"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="3"
                  >
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>
            </div>
            <div v-if="imageError" class="ai-image-error">{{ imageError }}</div>
            <div class="ai-input-wrapper">
              <button
                class="ai-attach-btn"
                title="Attach image"
                @click="openFilePicker"
                :disabled="pendingImages.length >= 4"
              >
                <ImageIcon width="16" height="16" />
              </button>
              <textarea
                ref="inputRef"
                v-model="inputText"
                class="ai-input"
                :placeholder="inputPlaceholder"
                rows="1"
                @keydown="handleKeydown"
                @input="handleInput"
                @paste="handlePaste"
              />
              <button
                v-if="isStreaming"
                class="ai-send-btn ai-stop-btn"
                title="Stop"
                @click="handleStop"
              >
                <IconStop width="14" height="14" />
              </button>
              <button
                v-else
                class="ai-send-btn"
                :disabled="!inputText.trim() && !pendingImages.length"
                title="Send"
                @click="handleSend"
              >
                <IconSendV5 width="14" height="14" />
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
</template>

<style scoped>
/* --- Trigger button --- */
.ai-trigger {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  padding: 0;
  border: none;
  border-radius: 8px;
  background: none;
  color: var(--vp-c-text-2);
  cursor: pointer;
  transition: color 0.2s;
  margin-left: 4px;
}

.ai-trigger:hover {
  color: var(--vp-c-text-1);
}

.ai-trigger.active {
  color: var(--vp-c-brand-1);
}

.ai-trigger-divider {
  width: 1px;
  height: 24px;
  background-color: var(--vp-c-divider);
  margin-right: 8px;
  margin-left: 16px;
}

.ai-trigger-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

/* --- Sidebar panel --- */
.ai-sidebar {
  position: fixed;
  top: var(--vp-nav-height, 64px);
  right: 0;
  width: 380px;
  height: calc(100vh - var(--vp-nav-height, 64px));
  background: var(--vp-c-bg);
  border-left: 1px solid var(--vp-c-divider);
  border-top: 1px solid var(--vp-c-divider);
  display: flex;
  flex-direction: column;
  z-index: 30;
}

.ai-sidebar.maximized {
  width: 520px;
}

@media (max-width: 960px) {
  .ai-sidebar {
    width: 100%;
  }
  .ai-sidebar.maximized {
    width: 100%;
  }
}

/* --- Header --- */
.ai-sidebar-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 16px;
  border-bottom: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.ai-sidebar-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  font-weight: 600;
  color: var(--vp-c-text-1);
}

.ai-sidebar-actions {
  display: flex;
  align-items: center;
  gap: 2px;
}

.ai-icon-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--vp-c-text-3);
  border-radius: 6px;
  transition:
    background-color 0.2s,
    color 0.2s;
}

.ai-icon-btn:hover {
  background-color: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

/* --- Messages --- */
.ai-messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

/* Welcome state */
.ai-welcome {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  text-align: center;
  padding: 40px 20px;
  color: var(--vp-c-text-2);
}

.ai-welcome-text {
  font-size: 14px;
  line-height: 1.6;
  margin: 0 0 8px;
}

.ai-welcome-tip {
  font-size: 12px;
  color: var(--vp-c-text-3);
  margin: 0;
}

/* Messages */
.ai-msg {
  display: flex;
}

.ai-msg-user {
  justify-content: flex-end;
}

.ai-msg-assistant {
  justify-content: flex-start;
  flex-direction: column;
  min-width: 0;
  max-width: 100%;
}

.ai-msg-bubble-user {
  max-width: 85%;
  padding: 8px 14px;
  border-radius: 12px 12px 4px 12px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-1);
}

/* Assistant markdown content */
.ai-msg-content {
  max-width: 100%;
  min-width: 0;
  overflow: hidden;
  font-size: 14px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
  word-break: break-word;
}

.ai-msg-content :deep(p) {
  margin: 0 0 8px;
}

.ai-msg-content :deep(p:last-child) {
  margin-bottom: 0;
}

.ai-msg-content :deep(pre) {
  margin: 8px 0;
  padding: 10px 12px;
  border-radius: 8px;
  background: var(--vp-c-default-soft);
  overflow-x: auto;
  font-size: 13px;
  max-width: 100%;
}

.ai-msg-content :deep(pre code) {
  padding: 0;
  background: none;
  white-space: pre-wrap;
  word-break: break-all;
}

.ai-msg-content :deep(code) {
  font-size: 13px;
  padding: 1px 4px;
  border-radius: 4px;
  background: var(--vp-c-default-soft);
  word-break: break-all;
}

.ai-msg-content :deep(ul),
.ai-msg-content :deep(ol) {
  margin: 4px 0;
  padding-left: 20px;
}

.ai-msg-content :deep(a) {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
}

.ai-msg-content :deep(table) {
  border-collapse: collapse;
  margin: 8px 0;
  font-size: 13px;
  width: 100%;
}

.ai-msg-content :deep(th),
.ai-msg-content :deep(td) {
  border: 1px solid var(--vp-c-divider);
  padding: 4px 8px;
}

.ai-msg-content :deep(blockquote) {
  border-left: 3px solid var(--vp-c-divider);
  padding-left: 12px;
  margin: 8px 0;
  color: var(--vp-c-text-2);
}

.ai-msg-content :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 8px 0;
}

/* Source cards */
.ai-sources {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
  width: 100%;
}

.ai-source-card {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  border: 1px solid var(--vp-c-divider);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition:
    border-color 0.2s,
    background-color 0.2s;
  cursor: pointer;
}

.ai-source-card:hover {
  border-color: var(--vp-c-brand-1);
  background: var(--vp-c-brand-soft);
}

.ai-source-index {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 22px;
  height: 22px;
  border-radius: 6px;
  background: var(--vp-c-default-soft);
  color: var(--vp-c-text-2);
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.ai-source-info {
  display: flex;
  flex-direction: column;
  gap: 1px;
  min-width: 0;
}

.ai-source-title {
  font-size: 13px;
  font-weight: 500;
  color: var(--vp-c-text-1);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.ai-source-url {
  font-size: 11px;
  color: var(--vp-c-text-3);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Error message */
.ai-msg-error {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 8px;
  background: var(--vp-c-danger-soft);
  color: var(--vp-c-danger-1);
  font-size: 13px;
}

/* Loading dots */
.ai-msg-loading {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 4px;
}

.ai-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--vp-c-text-3);
  animation: ai-bounce 1.4s infinite ease-in-out both;
}

.ai-dot:nth-child(1) {
  animation-delay: -0.32s;
}
.ai-dot:nth-child(2) {
  animation-delay: -0.16s;
}
.ai-dot:nth-child(3) {
  animation-delay: 0s;
}

@keyframes ai-bounce {
  0%,
  80%,
  100% {
    transform: scale(0.6);
    opacity: 0.4;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}

/* --- Image attachment --- */
.ai-attach-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  background: none;
  cursor: pointer;
  color: var(--vp-c-text-3);
  border-radius: 6px;
  flex-shrink: 0;
  transition: color 0.2s;
}
.ai-attach-btn:hover:not(:disabled) {
  color: var(--vp-c-text-1);
}
.ai-attach-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.ai-drag-over {
  background: var(--vp-c-brand-soft);
  border-radius: 12px;
}

.ai-image-previews {
  display: flex;
  gap: 8px;
  padding: 0 16px 8px;
  flex-wrap: wrap;
}
.ai-image-preview {
  position: relative;
  width: 64px;
  height: 64px;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}
.ai-image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.ai-image-remove {
  position: absolute;
  top: 2px;
  right: 2px;
  width: 18px;
  height: 18px;
  border: none;
  border-radius: 50%;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.ai-image-remove:hover {
  background: rgba(0, 0, 0, 0.8);
}

.ai-image-error {
  font-size: 12px;
  color: var(--vp-c-danger-1);
  padding: 0 16px 4px;
}

.ai-msg-images {
  display: flex;
  gap: 6px;
  margin-bottom: 6px;
  flex-wrap: wrap;
}
.ai-msg-image-thumb {
  width: 120px;
  max-height: 120px;
  object-fit: cover;
  border-radius: 8px;
  border: 1px solid var(--vp-c-divider);
}

/* --- Input area --- */
.ai-input-area {
  padding: 12px 16px;
  border-top: 1px solid var(--vp-c-divider);
  flex-shrink: 0;
}

.ai-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: none;
  border: 1px solid var(--vp-c-divider);
  border-radius: 12px;
  padding: 8px 12px;
  transition: border-color 0.2s;
}

.ai-input-wrapper:focus-within {
  border-color: var(--vp-c-text-3);
}

.ai-input {
  flex: 1;
  border: none;
  background: none;
  color: var(--vp-c-text-1);
  font-size: 14px;
  line-height: 1.5;
  resize: none;
  outline: none;
  font-family: inherit;
  min-height: 21px;
  max-height: 120px;
}

.ai-input::placeholder {
  color: var(--vp-c-text-3);
}

.ai-send-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border: none;
  border-radius: 8px;
  background: none;
  color: #000;
  cursor: pointer;
  flex-shrink: 0;
  transition: opacity 0.2s;
}

.ai-send-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}

.ai-send-btn:not(:disabled):hover {
  opacity: 0.7;
}

/* --- Transition --- */
.ai-sidebar-enter-active {
  transition: transform 0.3s ease;
}

.ai-sidebar-leave-active {
  transition: transform 0.25s ease;
}

.ai-sidebar-enter-from {
  transform: translateX(100%);
}

.ai-sidebar-leave-to {
  transform: translateX(100%);
}
</style>
