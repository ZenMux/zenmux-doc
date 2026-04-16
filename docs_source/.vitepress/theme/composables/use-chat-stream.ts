import { ref } from 'vue'

export interface DocSource {
  title: string
  path: string
  url: string
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
  error?: string
  sources?: DocSource[]
}

let messageIdCounter = 0
function generateId() {
  return `msg_${Date.now()}_${++messageIdCounter}`
}

/**
 * API endpoint for docs AI chat.
 * This is a backend proxy on zenmux.ai that:
 *  - Stores the API key server-side (not exposed to frontend)
 *  - Enforces rate limiting (per IP / per session)
 *  - Performs RAG retrieval (keyword search + AI reranking)
 *  - Builds the system prompt server-side
 *  - Forwards to /api/v1/chat/completions with SSE streaming
 */
const API_ENDPOINT = process.env.NODE_ENV === 'development'
  ? '/api/docs/ai-chat'
  : 'https://zenmux.ai/api/docs/ai-chat'

export function useChatStream() {
  const messages = ref<ChatMessage[]>([])
  const isStreaming = ref(false)
  let abortController: AbortController | null = null

  async function sendMessage(content: string, locale: string) {
    if (isStreaming.value || !content.trim()) return

    // Add user message
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
    }
    messages.value = [...messages.value, userMsg]

    // Build conversation history (last 10 messages, user + assistant only)
    const history = messages.value
      .slice(-11, -1)
      .map(m => ({ role: m.role, content: m.content }))

    // Create assistant placeholder
    const assistantMsg: ChatMessage = {
      id: generateId(),
      role: 'assistant',
      content: '',
      isStreaming: true,
    }
    messages.value = [...messages.value, assistantMsg]

    isStreaming.value = true
    abortController = new AbortController()

    try {
      const requestBody = {
        messages: [
          ...history,
          { role: 'user', content: content.trim() },
        ],
        locale,
      }

      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(requestBody),
        signal: abortController.signal,
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => null)
        const status = response.status
        if (status === 429) {
          throw new Error('RATE_LIMITED')
        }
        const errorMsg = errorData?.error?.message || errorData?.error || `HTTP ${status}`
        throw new Error(typeof errorMsg === 'string' ? errorMsg : JSON.stringify(errorMsg))
      }

      if (!response.body) {
        throw new Error('No response body')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder('utf-8')
      let buffer = ''
      let fullContent = ''

      while (true) {
        const { done, value } = await reader.read()

        if (value) {
          buffer += decoder.decode(value, { stream: true })
        }

        const lines = buffer.split('\n\n')

        if (!done) {
          buffer = lines.pop() || ''
        } else {
          buffer = ''
        }

        for (const line of lines) {
          if (!line.startsWith('data:')) continue
          const data = line.replace('data:', '').trim()

          if (data === '[DONE]') {
            updateAssistantMessage(assistantMsg.id, fullContent, false)
            isStreaming.value = false
            abortController = null
            return
          }

          try {
            const json = JSON.parse(data)

            // Handle sources event from backend
            if (json.type === 'sources') {
              updateAssistantSources(assistantMsg.id, json.sources)
              continue
            }

            const text = json.choices?.[0]?.delta?.content
            const reasoning = json.choices?.[0]?.delta?.reasoning

            if (reasoning) {
              fullContent += reasoning
              updateAssistantMessage(assistantMsg.id, fullContent, true)
            }
            if (text) {
              fullContent += text
              updateAssistantMessage(assistantMsg.id, fullContent, true)
            }
          } catch {
            // Skip malformed JSON chunks
          }
        }

        if (done) break
      }

      // Fallback: stream ended without [DONE]
      updateAssistantMessage(assistantMsg.id, fullContent, false)
    } catch (err: any) {
      if (err.name === 'AbortError') {
        updateAssistantMessage(assistantMsg.id, assistantMsg.content || '', false)
      } else {
        const errorText = getErrorMessage(err.message)
        updateAssistantMessage(assistantMsg.id, '', false, errorText)
      }
    } finally {
      isStreaming.value = false
      abortController = null
    }
  }

  function updateAssistantMessage(id: string, content: string, streaming: boolean, error?: string) {
    messages.value = messages.value.map(m =>
      m.id === id ? { ...m, content, isStreaming: streaming, error } : m
    )
  }

  function updateAssistantSources(id: string, sources: DocSource[]) {
    messages.value = messages.value.map(m =>
      m.id === id ? { ...m, sources } : m
    )
  }

  function stopStream() {
    if (abortController) {
      abortController.abort()
      abortController = null
    }
  }

  function clearChat() {
    stopStream()
    messages.value = []
  }

  return {
    messages,
    isStreaming,
    sendMessage,
    stopStream,
    clearChat,
  }
}

function getErrorMessage(code: string): string {
  switch (code) {
    case 'RATE_LIMITED':
      return 'Too many requests. Please wait a moment and try again.'
    default:
      return code || 'An error occurred. Please try again.'
  }
}
