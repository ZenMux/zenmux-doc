export const OPEN_AI_ASSISTANT_EVENT = "open-ai-assistant";

export interface OpenAiAssistantDetail {
  query?: string;
  autoSend?: boolean;
}

export function openAiAssistant(detail: OpenAiAssistantDetail = {}) {
  document.dispatchEvent(
    new CustomEvent<OpenAiAssistantDetail>(OPEN_AI_ASSISTANT_EVENT, {
      detail,
    }),
  );
}

export function getOpenAiAssistantDetail(
  event: Event,
): OpenAiAssistantDetail {
  if (!(event instanceof CustomEvent)) {
    return {};
  }

  const detail: unknown = event.detail;
  if (!detail || typeof detail !== "object") {
    return {};
  }

  const candidate = detail as {
    query?: unknown;
    autoSend?: unknown;
  };

  return {
    query: typeof candidate.query === "string" ? candidate.query : undefined,
    autoSend:
      typeof candidate.autoSend === "boolean"
        ? candidate.autoSend
        : undefined,
  };
}
