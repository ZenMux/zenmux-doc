import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径（ES modules 兼容）
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 从环境变量获取API Key
const apiKey = process.env.ZENMUX_API_KEY;
if (!apiKey) {
  console.error("❌ 请设置环境变量 ZENMUX_API_KEY");
  console.log("示例: export ZENMUX_API_KEY=your_api_key_here");
  process.exit(1);
}

const client = new OpenAI({
  baseURL: 'https://zenmux.ai/api/v1',
  apiKey: apiKey,
});

// 检查目标文件是否已存在
function checkTargetFileExists(targetPath: string): boolean {
  return fs.existsSync(targetPath);
}

// 确保目标目录存在
function ensureDirectoryExists(filePath: string): void {
  const directory = path.dirname(filePath);
  if (!fs.existsSync(directory)) {
    fs.mkdirSync(directory, { recursive: true });
  }
}

// 保存优化结果
async function saveOptimizedContent(content: string, targetPath: string): Promise<void> {
  try {
    ensureDirectoryExists(targetPath);
    fs.writeFileSync(targetPath, content, 'utf-8');
    console.log(`✅ 优化结果已保存到: ${targetPath}`);
  } catch (error) {
    console.error(`❌ 保存文件时出错: ${error}`);
    throw error;
  }
}

// 加载系统提示词
function loadSystemPrompt(): string {
  // 在项目根目录的 .prompts 文件夹中查找提示词文件
  const promptPath = path.resolve(process.cwd(), '.prompts/optimize-chinese-docs.xml');
  
  if (!fs.existsSync(promptPath)) {
    throw new Error(`系统提示词文件不存在: ${promptPath}`);
  }
  
  return fs.readFileSync(promptPath, 'utf-8');
}

// 读取markdown文件
function readMarkdownFile(filePath: string): string {
  if (!fs.existsSync(filePath)) {
    throw new Error(`源文件不存在: ${filePath}`);
  }
  
  if (!path.extname(filePath).toLowerCase().includes('md')) {
    throw new Error(`文件不是markdown格式: ${filePath}`);
  }
  
  return fs.readFileSync(filePath, 'utf-8');
}

// 调用大模型进行文档优化
async function optimizeContent(systemPrompt: string, markdownContent: string): Promise<string> {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: systemPrompt
    },
    {
      role: "user", 
      content: markdownContent
    }
  ];
  
  console.log("🚀 正在调用大模型进行文档优化...");
  
  const completion = await client.chat.completions.create({
    model: "anthropic/claude-sonnet-4",
    messages: messages,
  });
  
  const optimizedContent = completion.choices[0].message.content;
  
  if (!optimizedContent) {
    throw new Error("大模型返回内容为空");
  }
  
  return optimizedContent;
}

async function main() {
  try {
    // 解析命令行参数
    const args = process.argv.slice(2);
    const forceOverwrite = args.includes('--force');
    const nonFlagArgs = args.filter(arg => !arg.startsWith('--'));
    
    if (nonFlagArgs.length !== 2) {
      console.error("❌ 请提供源文件路径和目标文件路径作为命令行参数");
      console.log("使用方法: pnpm run optimize <源文件路径> <目标文件路径> [--force]");
      console.log("示例: pnpm run optimize docs_source/zh/guide/draft.md docs_source/zh/guide/quickstart.md");
      console.log("示例: pnpm run optimize input.md output.md --force");
      console.log("");
      console.log("参数说明:");
      console.log("  <源文件路径>     需要优化的markdown文件路径");
      console.log("  <目标文件路径>   优化后保存的文件路径");
      console.log("  --force          强制覆盖已存在的目标文件");
      console.log("");
      console.log("注意: 请确保已设置环境变量 ZENMUX_API_KEY");
      console.log("设置方法: export ZENMUX_API_KEY=your_api_key_here");
      process.exit(1);
    }
    
    const sourceFilePath = nonFlagArgs[0];
    const targetFilePath = nonFlagArgs[1];
    
    // 转换为绝对路径
    const absoluteSourcePath = path.resolve(sourceFilePath);
    const absoluteTargetPath = path.resolve(targetFilePath);
    
    console.log("=== 中文文档优化脚本 ===");
    console.log(`📁 源文件路径: ${absoluteSourcePath}`);
    console.log(`📁 目标文件路径: ${absoluteTargetPath}`);
    
    // 检查目标文件是否已存在（除非使用 --force 参数）
    if (!forceOverwrite && checkTargetFileExists(absoluteTargetPath)) {
      console.log("⚠️  目标文件已存在，跳过优化");
      console.log(`📄 现有文件: ${absoluteTargetPath}`);
      console.log("💡 如需强制覆盖，请使用 --force 参数");
      process.exit(0);
    } else if (forceOverwrite && checkTargetFileExists(absoluteTargetPath)) {
      console.log("🔄 检测到 --force 参数，将覆盖现有文件");
      console.log(`📄 目标文件: ${absoluteTargetPath}`);
    }
    
    // 加载系统提示词
    console.log("📋 加载系统提示词...");
    const systemPrompt = loadSystemPrompt();
    
    // 读取源markdown文件
    console.log("📖 读取源文件内容...");
    const markdownContent = readMarkdownFile(absoluteSourcePath);
    console.log(`📊 文件大小: ${markdownContent.length} 字符`);
    
    // 调用大模型优化
    const optimizedContent = await optimizeContent(systemPrompt, markdownContent);
    
    // 保存优化结果
    await saveOptimizedContent(optimizedContent, absoluteTargetPath);
    
    console.log("✨ 文档优化完成！");
    
  } catch (error) {
    console.error(`❌ 处理出错: ${error}`);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);