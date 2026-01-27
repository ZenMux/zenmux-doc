const fs = require("fs");
const path = require("path");
const glob = require("glob");

// 查找所有 markdown 文件
const docsDir = path.join(__dirname, "../docs_source");
const mdFiles = glob.sync("**/*.md", { cwd: docsDir });

console.log(`找到 ${mdFiles.length} 个 Markdown 文件`);

let updatedCount = 0;
let skippedCount = 0;

mdFiles.forEach((file) => {
  const filePath = path.join(docsDir, file);
  let content = fs.readFileSync(filePath, "utf-8");

  // 检查文件是否已经有 frontmatter
  const hasFrontmatter = content.startsWith("---");

  if (hasFrontmatter) {
    // 已有 frontmatter，检查是否有 head 配置
    const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (frontmatterMatch) {
      const frontmatter = frontmatterMatch[1];

      // 检查是否已经有 head 配置
      if (frontmatter.includes("head:")) {
        console.log(`跳过（已有 head）: ${file}`);
        skippedCount++;
        return;
      }

      // 基于文件路径和内容生成描述和关键词
      const description = generateDescription(file, content);
      const keywords = generateKeywords(file, content);

      // 在 frontmatter 末尾添加 head 配置
      const newFrontmatter =
        frontmatter +
        `\nhead:
  - - meta
    - name: description
      content: ${description}
  - - meta
    - name: keywords
      content: ${keywords}`;

      content = content.replace(
        /^---\n[\s\S]*?\n---/,
        `---\n${newFrontmatter}\n---`,
      );
    }
  } else {
    // 没有 frontmatter，创建新的
    const description = generateDescription(file, content);
    const keywords = generateKeywords(file, content);

    const newFrontmatter = `---
head:
  - - meta
    - name: description
      content: ${description}
  - - meta
    - name: keywords
      content: ${keywords}
---

`;
    content = newFrontmatter + content;
  }

  fs.writeFileSync(filePath, content, "utf-8");
  console.log(`✓ 更新: ${file}`);
  updatedCount++;
});

console.log(
  `\n完成！更新了 ${updatedCount} 个文件，跳过了 ${skippedCount} 个文件。`,
);

// 生成描述的辅助函数
function generateDescription(filePath, content) {
  // 提取第一个标题或段落作为描述
  const titleMatch = content.match(/^#\s+(.+)$/m);
  if (titleMatch) {
    return titleMatch[1].trim();
  }

  // 提取第一段文字
  const paragraphMatch = content.match(/\n\n([^#\n].{20,150})/);
  if (paragraphMatch) {
    return paragraphMatch[1].trim().substring(0, 150) + "...";
  }

  // 基于文件路径生成
  const fileName = path.basename(filePath, ".md");
  return `Zenmux documentation - ${fileName.replace(/-/g, " ")}`;
}

// 生成关键词的辅助函数
function generateKeywords(filePath, content) {
  const keywords = new Set(["Zenmux"]);

  // 基于路径添加关键词
  if (filePath.includes("/api/")) {
    keywords.add("API");
    keywords.add("documentation");
  }
  if (filePath.includes("/guide/")) {
    keywords.add("guide");
    keywords.add("tutorial");
  }
  if (filePath.includes("/best-practices/")) {
    keywords.add("best practices");
    keywords.add("integration");
  }
  if (filePath.includes("/about/")) {
    keywords.add("about");
  }
  if (filePath.includes("/help/")) {
    keywords.add("help");
    keywords.add("FAQ");
  }

  // 从文件名提取关键词
  const fileName = path.basename(filePath, ".md");
  fileName.split("-").forEach((word) => {
    if (word.length > 2) {
      keywords.add(word);
    }
  });

  // 添加常用关键词
  if (content.includes("OpenAI")) keywords.add("OpenAI");
  if (content.includes("Anthropic")) keywords.add("Anthropic");
  if (content.includes("Claude")) keywords.add("Claude");
  if (content.includes("GPT")) keywords.add("GPT");
  if (content.includes("API")) keywords.add("API");

  return Array.from(keywords).join(", ");
}
