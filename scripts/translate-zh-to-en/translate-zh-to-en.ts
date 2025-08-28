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

// 检查路径是否包含 'zh' 目录
function isChinesePath(filePath: string): boolean {
  return filePath.includes('/zh/') || filePath.includes('\\zh\\');
}

// 将 zh 路径转换为对应的 en 路径
function convertZhToEnPath(zhPath: string): string {
  return zhPath.replace(/\/zh\//g, '/en/').replace(/\\zh\\/g, '\\en\\');
}

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

// 保存翻译结果
async function saveTranslation(content: string, targetPath: string): Promise<void> {
  try {
    ensureDirectoryExists(targetPath);
    fs.writeFileSync(targetPath, content, 'utf-8');
    console.log(`✅ 翻译结果已保存到: ${targetPath}`);
  } catch (error) {
    console.error(`❌ 保存文件时出错: ${error}`);
    throw error;
  }
}

// 加载系统提示词
function loadSystemPrompt(): string {
  const promptPath = path.join(__dirname, '../../.prompts/translation-zh-to-en.xml');
  
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

// 调用大模型进行翻译
async function translateContent(systemPrompt: string, markdownContent: string): Promise<string> {
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
  
  console.log("🚀 正在调用大模型进行翻译...");
  
  const completion = await client.chat.completions.create({
    // model: "anthropic/claude-sonnet-4",
    model: "openai/gpt-5",
    messages: messages,
  });
  
  const translatedContent = completion.choices[0].message.content;
  
  if (!translatedContent) {
    throw new Error("大模型返回内容为空");
  }
  
  return translatedContent;
}

async function main() {
  try {
    // 解析命令行参数
    const args = process.argv.slice(2);
    const forceOverwrite = args.includes('--force');
    const sourceFilePath = args.find(arg => !arg.startsWith('--'));
    
    if (!sourceFilePath) {
      console.error("❌ 请提供源文件路径作为命令行参数");
      console.log("使用方法: npm run translate <源文件路径> [--force]");
      console.log("示例: npm run translate docs_source/zh/index.md");
      console.log("示例: npm run translate docs_source/zh/index.md --force");
      console.log("");
      console.log("参数说明:");
      console.log("  --force  强制覆盖已存在的目标文件");
      console.log("");
      console.log("注意: 请确保已设置环境变量 ZENMUX_API_KEY");
      console.log("设置方法: export ZENMUX_API_KEY=your_api_key_here");
      process.exit(1);
    }
    
    // 转换为绝对路径
    const absoluteSourcePath = path.resolve(sourceFilePath);
    
    console.log("=== 中文文档翻译脚本 ===");
    console.log(`📁 源文件路径: ${absoluteSourcePath}`);
    
    // 检查路径是否包含 zh
    if (!isChinesePath(absoluteSourcePath)) {
      throw new Error("❌ 源文件路径必须包含 'zh' 目录");
    }
    
    // 生成目标路径（将 zh 替换为 en）
    const targetFilePath = convertZhToEnPath(absoluteSourcePath);
    console.log(`📁 目标文件路径: ${targetFilePath}`);
    
    // 检查目标文件是否已存在（除非使用 --force 参数）
    if (!forceOverwrite && checkTargetFileExists(targetFilePath)) {
      console.log("⚠️  目标文件已存在，跳过翻译");
      console.log(`📄 现有文件: ${targetFilePath}`);
      console.log("💡 如需强制覆盖，请使用 --force 参数");
      process.exit(0);
    } else if (forceOverwrite && checkTargetFileExists(targetFilePath)) {
      console.log("🔄 检测到 --force 参数，将覆盖现有文件");
      console.log(`📄 目标文件: ${targetFilePath}`);
    }
    
    // 加载系统提示词
    console.log("📋 加载系统提示词...");
    const systemPrompt = loadSystemPrompt();
    
    // 读取源markdown文件
    console.log("📖 读取源文件内容...");
    const markdownContent = readMarkdownFile(absoluteSourcePath);
    console.log(`📊 文件大小: ${markdownContent.length} 字符`);
    
    // 调用大模型翻译
    const translatedContent = await translateContent(systemPrompt, markdownContent);
    
    // 保存翻译结果
    await saveTranslation(translatedContent, targetFilePath);
    
    console.log("✨ 翻译完成！");
    
  } catch (error) {
    console.error(`❌ 处理出错: ${error}`);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);