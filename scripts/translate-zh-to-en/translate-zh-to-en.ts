import OpenAI from 'openai';
import * as fs from 'fs';
import * as path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';

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
  return filePath.includes('/zh/') || filePath.includes('\\zh\\') || 
         filePath.endsWith('/zh') || filePath.endsWith('\\zh');
}

// 将 zh 路径转换为对应的 en 路径
function convertZhToEnPath(zhPath: string): string {
  return zhPath
    .replace(/\/zh\//g, '/en/')
    .replace(/\\zh\\/g, '\\en\\')
    .replace(/\/zh$/g, '/en')
    .replace(/\\zh$/g, '\\en');
}

// 检查目标文件是否已存在
function checkTargetFileExists(targetPath: string): boolean {
  return fs.existsSync(targetPath);
}

// 递归获取文件夹下所有的markdown文件
function getMarkdownFiles(dirPath: string): string[] {
  if (!fs.existsSync(dirPath)) {
    throw new Error(`目录不存在: ${dirPath}`);
  }
  
  const stats = fs.statSync(dirPath);
  
  if (stats.isFile()) {
    // 如果是文件，检查是否为markdown
    if (path.extname(dirPath).toLowerCase().includes('md')) {
      return [dirPath];
    } else {
      throw new Error(`文件不是markdown格式: ${dirPath}`);
    }
  } else if (stats.isDirectory()) {
    // 如果是目录，递归查找所有markdown文件
    const pattern = path.join(dirPath, '**/*.md').replace(/\\/g, '/');
    const files = glob.sync(pattern);
    return files;
  } else {
    throw new Error(`路径既不是文件也不是目录: ${dirPath}`);
  }
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

// 翻译单个文件
async function translateFile(sourceFile: string, systemPrompt: string, forceOverwrite: boolean): Promise<void> {
  try {
    console.log(`📖 开始翻译: ${sourceFile}`);
    
    // 生成目标路径
    const targetFile = convertZhToEnPath(sourceFile);
    
    // 检查目标文件是否已存在
    if (!forceOverwrite && checkTargetFileExists(targetFile)) {
      console.log(`⚠️  目标文件已存在，跳过: ${targetFile}`);
      return;
    } else if (forceOverwrite && checkTargetFileExists(targetFile)) {
      console.log(`🔄 强制覆盖: ${targetFile}`);
    }
    
    // 读取源文件
    const markdownContent = readMarkdownFile(sourceFile);
    
    // 翻译内容
    const translatedContent = await translateContent(systemPrompt, markdownContent);
    
    // 保存翻译结果
    await saveTranslation(translatedContent, targetFile);
    
    console.log(`✅ 翻译完成: ${sourceFile} -> ${targetFile}`);
  } catch (error) {
    console.error(`❌ 翻译文件失败 ${sourceFile}: ${error}`);
    throw error;
  }
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
    model: "anthropic/claude-sonnet-4.5",
    // model: "openai/gpt-5",
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
    const concurrency = parseInt(args.find(arg => arg.startsWith('--concurrency='))?.split('=')[1] || '5');
    const sourceInput = args.find(arg => !arg.startsWith('--'));
    
    if (!sourceInput) {
      console.error("❌ 请提供源文件或文件夹路径作为命令行参数");
      console.log("使用方法: pnpm run translate <源路径> [--force] [--concurrency=5]");
      console.log("示例: pnpm run translate docs_source/zh/index.md");
      console.log("示例: pnpm run translate docs_source/zh/");
      console.log("示例: pnpm run translate docs_source/zh/ --force --concurrency=10");
      console.log("");
      console.log("参数说明:");
      console.log("  --force         强制覆盖已存在的目标文件");
      console.log("  --concurrency=N 设置并发翻译数量 (默认: 5)");
      console.log("");
      console.log("注意: 请确保已设置环境变量 ZENMUX_API_KEY");
      console.log("设置方法: export ZENMUX_API_KEY=your_api_key_here");
      process.exit(1);
    }
    
    // 转换为绝对路径
    const absoluteSourcePath = path.resolve(sourceInput);
    
    console.log("=== 中文文档翻译脚本 ===");
    console.log(`📁 源路径: ${absoluteSourcePath}`);
    console.log(`🔄 并发数量: ${concurrency}`);
    
    // 检查路径是否包含 zh
    if (!isChinesePath(absoluteSourcePath)) {
      throw new Error("❌ 源路径必须包含 'zh' 目录");
    }
    
    // 获取所有需要翻译的markdown文件
    console.log("🔍 扫描markdown文件...");
    const markdownFiles = getMarkdownFiles(absoluteSourcePath);
    console.log(`📄 找到 ${markdownFiles.length} 个markdown文件`);
    
    if (markdownFiles.length === 0) {
      console.log("⚠️  没有找到需要翻译的markdown文件");
      process.exit(0);
    }
    
    // 加载系统提示词
    console.log("📋 加载系统提示词...");
    const systemPrompt = loadSystemPrompt();
    
    // 并行处理翻译任务
    console.log(`🚀 开始并行翻译 ${markdownFiles.length} 个文件...`);
    
    const translatePromises: Promise<void>[] = [];
    const semaphore: Promise<void>[] = [];
    
    for (const file of markdownFiles) {
      // 控制并发数量
      while (semaphore.length >= concurrency) {
        const completed = await Promise.race(semaphore.map((p, index) => p.then(() => index)));
        semaphore.splice(completed, 1);
      }
      
      const promise = translateFile(file, systemPrompt, forceOverwrite).finally(() => {
        // 从信号量中移除已完成的任务
        const index = semaphore.indexOf(promise);
        if (index > -1) {
          semaphore.splice(index, 1);
        }
      });
      
      semaphore.push(promise);
      translatePromises.push(promise);
    }
    
    // 等待所有翻译任务完成
    const results = await Promise.allSettled(translatePromises);
    
    // 统计结果
    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.filter(r => r.status === 'rejected').length;
    
    console.log("\n=== 翻译结果统计 ===");
    console.log(`✅ 成功: ${successful} 个文件`);
    console.log(`❌ 失败: ${failed} 个文件`);
    
    if (failed > 0) {
      console.log("\n❌ 失败的文件:");
      results.forEach((result, index) => {
        if (result.status === 'rejected') {
          console.log(`  - ${markdownFiles[index]}: ${result.reason}`);
        }
      });
      process.exit(1);
    }
    
    console.log("\n✨ 所有文件翻译完成！");
    
  } catch (error) {
    console.error(`❌ 处理出错: ${error}`);
    process.exit(1);
  }
}

// 运行主函数
main().catch(console.error);