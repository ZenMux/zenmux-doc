import { inBrowser } from "vitepress";

const cache = new Map<string, string>();
const docsPrefix = "/docs";

function getDocsBasePath() {
  if (!inBrowser) return "/";

  const { pathname } = window.location;
  if (pathname === docsPrefix || pathname.startsWith(`${docsPrefix}/`)) {
    return `${docsPrefix}/`;
  }

  return "/";
}

export function getRawPageUrl(filePath: string) {
  const rawPath = filePath.replace(/\.md$/, ".txt").replace(/^\/+/, "");
  return `${getDocsBasePath()}raw/${rawPath}`;
}

export async function fetchPageContent(filePath: string): Promise<string> {
  if (!inBrowser || !filePath) return "";

  if (cache.has(filePath)) return cache.get(filePath)!;

  const url = getRawPageUrl(filePath);
  const res = await fetch(url);
  if (!res.ok) return "";

  const content = await res.text();
  cache.set(filePath, content);
  return content;
}
