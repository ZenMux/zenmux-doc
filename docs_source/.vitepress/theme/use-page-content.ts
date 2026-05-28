import { inBrowser } from "vitepress";

const cache = new Map<string, string>();

export async function fetchPageContent(filePath: string): Promise<string> {
  if (!inBrowser || !filePath) return "";

  if (cache.has(filePath)) return cache.get(filePath)!;

  const url = `/raw/${filePath.replace(/\.md$/, '.txt')}`;
  const res = await fetch(url);
  if (!res.ok) return "";

  const content = await res.text();
  cache.set(filePath, content);
  return content;
}
