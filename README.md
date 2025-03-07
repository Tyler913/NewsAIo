## NewsAIo - AI驱动的RSS阅读器 | AI-Powered RSS Reader

NewsAIo 是一款基于 Electron 和 Node.js 构建的本地化 RSS 阅读器，集成了最新 AI 技术，实现文章自动摘要和即时翻译等强大功能。该项目支持多种 AI 模型（如 OpenAI GPT-3.5/4、Anthropic Claude 和 DeepSeek），同时具备流式输出、自动摘要、快速翻译、暗色模式、毛玻璃效果以及本地缓存等特性，为用户提供现代化、流畅且高度可定制的阅读体验。

---

## 概述 | Overview

**中文说明**

NewsAIo 是一款高度可定制的 RSS 阅读器，通过集成先进的 AI 模型为新闻和文章提供自动摘要和翻译服务。项目实现了：

- **本地化运行**：所有核心功能均可在本地运行，同时通过缓存优化加载速度。
- **多模型支持**：支持 OpenAI、Anthropic 和 DeepSeek 等 AI 提供商，用户可根据需求选择合适的模型。
- **流式输出**：采用流式方式逐字显示 AI 生成的摘要或翻译，提升用户体验。
- **自动摘要 & 快速翻译**：可在文章加载时自动生成摘要，同时支持手动触发摘要与翻译功能（中英文互译）。
- **现代化界面**：采用三栏布局（RSS 源列表、文章列表、文章内容），拥有暗色/亮色模式、毛玻璃效果和流畅的动画过渡。
- **高度可定制**：支持字体大小调整、主题切换、摘要长度与语言设置等个性化配置。

**English Description**

NewsAIo is a highly customizable, local RSS reader built with Electron and Node.js. It integrates advanced AI features to automatically generate article summaries and offer instant translations. The project supports multiple AI model providers (such as OpenAI GPT-3.5/4, Anthropic Claude, and DeepSeek) and delivers a modern, fluid user experience with features including:

- **Local Operation & Caching**: All core functionalities run locally with optimized caching for fast loading.
- **Multiple AI Models**: Choose from providers like OpenAI, Anthropic, and DeepSeek based on your needs.
- **Streaming Output**: AI-generated summaries and translations are presented in a streaming (character-by-character) fashion for a dynamic experience.
- **Auto Summarization & Quick Translation**: Automatically generate summaries when an article is selected, and get fast translation between Chinese and English.
- **Modern Interface**: Enjoy a sleek three-column layout (feed list, articles list, content view) featuring dark/light modes, frosted glass effects, and smooth animations.
- **High Customizability**: Adjust font sizes, themes, summary length, language settings, and more.

---

## ✨ 特性 | Features

- **本地化运行 / Local Operation**: 离线工作，减少网络依赖，通过本地缓存提高响应速度。
- **多模型支持 / Multiple AI Models**: 支持 OpenAI GPT-3.5/4、Anthropic Claude 以及 DeepSeek API。
- **流式输出 / Streaming Output**: 实时逐字显示 AI 生成的摘要与翻译，提升交互体验。
- **自动摘要 / Auto Summarization**: 选择文章时可自动生成摘要，或者手动触发摘要生成。
- **快速翻译 / Quick Translation**: 支持中英文即时互译，方便阅读外语文章。
- **现代化界面 / Modern Interface**: 三栏布局、暗色模式、毛玻璃效果及动画过渡效果。
- **高度可定制 / Highly Customizable**: 提供字体大小、主题、摘要长度、语言等多项设置。

---

## 🚀 快速开始 | Quick Start

### 安装 | Installation

1. 下载最新的 [发行版](https://github.com/Tyler913/NewsAIo/releases) ，选择适合您系统的安装包：
   - Windows: `.exe` 或 `.msi`
   - macOS: `.dmg`
   - Linux: `.AppImage` 或 `.deb`

2. 安装并启动应用。

### 基本使用 | Basic Usage

- **添加 RSS 源**: 点击左侧面板顶部的"+"按钮，输入 RSS 链接后添加订阅。
- **浏览文章**: 从左侧选择 RSS 源，在中间选择文章，在右侧查看文章详情与 AI 摘要/翻译。
- **AI 功能**: 根据需要在阅读文章时点击"生成摘要"按钮或启用自动摘要；使用语言切换按钮实现中英文互译。

---

## ⚙️ 配置说明 | Configuration

### AI 功能配置 | AI Features Configuration

- **API 密钥设置**: 在 AI 设置页面输入您的 API 密钥。支持 OpenAI、DeepSeek 与 Anthropic Claude。
- **摘要选项**: 可设置摘要长度（简短、中等、详细）和输出语言（自动、中文、英文）；支持流式输出模式。

### 应用设置 | Application Settings

- 调整字体大小、切换暗色模式、设置应用界面语言等。

---

## 🔨 开发者指南 | Developer Guide

### 从源代码构建 | Building from Source

```bash
# 克隆代码库
git clone https://github.com/Tyler913/NewsAIo.git
cd NewsAIo

# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 打包应用
npm run make
```

### 技术栈 | Tech Stack

- Electron
- Node.js
- HTML/CSS/JavaScript
- OpenAI API
- Anthropic API
- DeepSeek API

---

## 🤝 贡献指南 | Contributing

欢迎提交 Pull Requests 与 Issues！在提交前，请确保：

1. Fork 项目并创建您的特性分支
2. 提交清晰的 commit 信息
3. 更新相关文档
4. 提交您的 Pull Request

---

## 📝 更新日志 | Changelog

查看 [CHANGELOG.md](CHANGELOG.md) 获取详细版本更新信息。

---

## 许可证 | License

[Apache License 2.0](LICENSE)

© 2024 TylerHong, BillXu
