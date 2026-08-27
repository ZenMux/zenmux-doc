#!/bin/bash

# GitHub Pages 使用 docs/ 作为根目录
# 当前可以访问 /xx/xx.html (即 docs/xx/xx.html)
# 现在要让 /docs/xx/xx.html 也能访问（即创建 docs/docs/xx/xx.html）

cd docs

# 如果 docs/docs 目录不存在则创建
if [ ! -d "docs" ]; then
  mkdir -p docs
fi

# 复制所有子目录到 docs/docs/ 下（仅排除 docs 目录本身，避免自我递归）
# 注意：assets/ 必须一起复制。base=/docs/ 后资源 URL 为 /docs/assets/xxx，
# 而 zenmux.ai/docs/** 回源时保留完整路径，命中的是 docs/docs/ 这一份，
# 漏掉 assets 会导致文档站样式与 JS 全部 404。
for dir in */; do
  if [ "$dir" != "docs/" ]; then
    echo "Copying $dir to docs/$dir..."
    cp -r "$dir" "docs/$dir"
  fi
done

# 复制根目录的 HTML 文件到 docs/docs/
for file in *.html; do
  if [ -f "$file" ]; then
    echo "Copying $file to docs/..."
    cp "$file" "docs/$file"
  fi
done

# 复制根目录的静态资源文件（SVG、JSON、CSS 等）到 docs/docs/
for file in *.svg *.json *.css; do
  if [ -f "$file" ]; then
    echo "Copying $file to docs/..."
    cp "$file" "docs/$file"
  fi
done

# 复制其他必要文件
if [ -f "robots.txt" ]; then
  cp "robots.txt" "docs/robots.txt"
fi

if [ -f "sitemap.xml" ]; then
  cp "sitemap.xml" "docs/sitemap.xml"
fi

echo "Files copied to docs/docs/ successfully!"
