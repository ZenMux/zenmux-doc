#!/usr/bin/env node

import fs from 'fs';
import { glob } from 'glob';

/**
 * 自动格式化 Markdown 文档中的图片
 * 为不同类型的图片添加统一的 HTML 标签和样式
 */

// 图片尺寸配置
const IMAGE_CONFIGS = {
  // 界面截图类图片 - 大图展示
  screenshot: {
    width: '100%',
    maxWidth: '800px',
    style: 'border-radius: 8px; box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1); margin: 20px 0;'
  },
  // 小图标或按钮截图 - 小图展示
  icon: {
    width: 'auto',
    maxWidth: '400px',
    style: 'border-radius: 4px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); margin: 16px 0;'
  },
  // 流程图或架构图 - 中等尺寸
  diagram: {
    width: '100%',
    maxWidth: '600px',
    style: 'border-radius: 8px; margin: 20px 0; background: white; padding: 10px;'
  },
  // 默认配置
  default: {
    width: '100%',
    maxWidth: '700px',
    style: 'border-radius: 6px; box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1); margin: 18px 0;'
  }
};

/**
 * 根据图片 URL 和描述判断图片类型
 */
function detectImageType(alt) {
  const altLower = alt.toLowerCase();
  
  // 检查是否为图标类
  if (altLower.includes('图标') || 
      altLower.includes('icon') || 
      altLower.includes('按钮') ||
      altLower.includes('复制') ||
      altLower.includes('slug')) {
    return 'icon';
  }
  
  // 检查是否为流程图
  if (altLower.includes('图表') || 
      altLower.includes('diagram') || 
      altLower.includes('步骤') ||
      altLower.includes('流程')) {
    return 'diagram';
  }
  
  // 检查是否为截图
  if (altLower.includes('界面') || 
      altLower.includes('页面') || 
      altLower.includes('效果') ||
      altLower.includes('展示') ||
      altLower.includes('详情') ||
      altLower.includes('列表')) {
    return 'screenshot';
  }
  
  return 'default';
}

/**
 * 将 Markdown 图片语法转换为 HTML img 标签
 */
function formatImageMarkdown(content) {
  // 匹配 Markdown 图片语法: ![alt](src)
  const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
  
  return content.replace(imageRegex, (match, alt, src) => {
    // 检查是否已经被 HTML 标签包裹，避免重复处理
    const beforeMatch = content.substring(0, content.indexOf(match));
    if (beforeMatch.endsWith('<img ') || beforeMatch.includes('<img ')) {
      return match; // 已经是 HTML 格式，跳过
    }
    
    const imageType = detectImageType(alt);
    const config = IMAGE_CONFIGS[imageType];
    
    // 生成 HTML 图片标签
    const htmlImg = `<div style="text-align: center;">
  <img src="${src}" 
       alt="${alt}" 
       style="width: ${config.width}; max-width: ${config.maxWidth}; ${config.style}"
       loading="lazy" />
</div>`;
    
    return htmlImg;
  });
}

/**
 * 处理单个 Markdown 文件
 */
function processMarkdownFile(filePath) {
  console.log(`处理文件: ${filePath}`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // 格式化图片
    content = formatImageMarkdown(content);
    
    // 只有内容发生变化时才写入文件
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ 已更新: ${filePath}`);
    } else {
      console.log(`⏭️  无需更新: ${filePath}`);
    }
  } catch (error) {
    console.error(`❌ 处理文件失败 ${filePath}:`, error.message);
  }
}

/**
 * 主函数
 */
async function main() {
  console.log('🚀 开始批量格式化图片...\n');
  
  try {
    // 查找所有 Markdown 文件
    const markdownFiles = await glob('docs_source/**/*.md', {
      ignore: ['**/node_modules/**', '**/dist/**', '**/cache/**']
    });
    
    console.log(`找到 ${markdownFiles.length} 个 Markdown 文件\n`);
    
    // 处理每个文件
    for (const file of markdownFiles) {
      processMarkdownFile(file);
    }
    
    console.log('\n✨ 图片格式化完成!');
    
  } catch (error) {
    console.error('❌ 执行失败:', error);
    process.exit(1);
  }
}

// 检查是否直接运行此脚本
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { formatImageMarkdown, processMarkdownFile };