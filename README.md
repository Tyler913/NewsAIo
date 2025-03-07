# NewsAIo - AI驱动的RSS阅读器 | AI-Powered RSS Reader

<div align="center">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platform - Windows, macOS, Linux">
  <img src="https://img.shields.io/badge/license-Apache--2.0-green" alt="License: Apache-2.0">
  <img src="https://img.shields.io/badge/Electron-v34.0.2-teal" alt="Electron v34.0.2">
  <img src="https://img.shields.io/badge/Node.js-v20.0.0+-orange" alt="Node.js v20.0.0+">
  <img src="https://img.shields.io/badge/OpenAI-GPT--4%20Ready-purple" alt="OpenAI GPT-4 Ready">
  <img src="https://img.shields.io/badge/Claude-3%20Ready-blueviolet" alt="Claude-3 Ready">
</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/Tyler913/NewsAIo/main/assets/logo.png" alt="NewsAIo Logo" width="180">
</p>

[English](#english) | [中文](#中文)

---

## 中文

NewsAIo 是一款功能强大的本地化 RSS 阅读器，集成了多种 AI 功能，可以自动或手动为文章生成摘要。它完全在本地运行，支持多种知名 AI 模型服务商，提供现代化的界面和流畅的用户体验。

### ✨ 特性

- 🌐 **本地化运行** - 所有核心功能无需联网即可使用，RSS 数据本地缓存
- 🤖 **多种 AI 模型支持** 
  - OpenAI GPT-3.5/4
  - Anthropic Claude 3
  - DeepSeek
- 🌊 **流式输出** - 类似官方网站的实时逐字输出效果
- 🌍 **多语言支持** - 界面支持中文和英文，AI 摘要可自动转换语言
- 🎨 **现代化界面** 
  - 毛玻璃效果
  - 流畅动画过渡
  - 优雅的暗色/亮色模式
  - 自适应布局
- 💾 **本地缓存文章** - 减少网络请求，快速加载文章内容
- ⚙️ **高度可定制** 
  - 字体大小调节
  - 颜色主题切换
  - 摘要长度控制
  - AI 模型选择
  - 多语言切换

### 🚀 快速开始

#### 安装

下载最新的 [发行版](https://github.com/Tyler913/NewsAIo/releases) 并按照您的操作系统选择合适的安装包：

- Windows: `.exe` 或 `.msi` 安装程序
- macOS: `.dmg` 安装包
- Linux: `.AppImage` 或 `.deb` 包

#### 基本使用

1. **添加 RSS 源**
   - 点击左侧面板顶部的 `+` 按钮
   - 输入 RSS 订阅链接并点击"添加订阅"

2. **浏览文章**
   - 从左侧选择 RSS 源
   - 点击中间面板中的文章查看内容

3. **AI 摘要功能**
   - **自动摘要**: 在设置中启用"自动总结文章"选项
   - **手动摘要**: 在阅读文章时点击"生成摘要"按钮
   - **快速翻译**: 支持中英文互译

### ⚙️ 配置说明

#### AI 功能配置

1. **API 密钥设置**
   - 在 AI 设置页面输入您的 API 密钥
   - 支持 OpenAI、DeepSeek 和 Anthropic Claude

2. **摘要选项**
   - 长度：简短(2-3句)、中等(4-5句)或详细(6-8句)
   - 语言：自动(与文章相同)、中文或英文
   - 输出模式：流式(逐字显示)或一次性显示

#### 系统要求

- 操作系统：Windows 10+, macOS 10.13+, 或 Linux
- 内存：最低 4GB RAM
- 存储：至少 500MB 可用空间
- Node.js：v20.0.0 或更高版本

### 🔨 开发者指南

#### 从源代码构建

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

#### 技术栈

- Electron
- Node.js
- HTML/CSS/JavaScript
- OpenAI API
- Anthropic API
- DeepSeek API

### 🤝 贡献指南

欢迎提交 Pull Requests 和 Issues！在提交之前，请确保：

1. Fork 项目并创建您的特性分支
2. 添加清晰的提交信息
3. 更新相关文档
4. 提交 Pull Request

### 📝 更新日志

查看 [CHANGELOG.md](CHANGELOG.md) 了解详细的版本更新历史。

---

## English

NewsAIo is a powerful local RSS reader with integrated AI capabilities that can automatically or manually generate summaries for articles. It runs completely locally, supports multiple well-known AI model providers, and offers a modern interface with a smooth user experience.

### ✨ Features

- 🌐 **Local Operation** - All core functionality works offline, RSS data cached locally
- 🤖 **Multiple AI Models** 
  - OpenAI GPT-3.5/4
  - Anthropic Claude 3
  - DeepSeek
- 🌊 **Stream Output** - Real-time character-by-character output
- 🌍 **Multilingual Support** - UI in Chinese/English, AI summaries in multiple languages
- 🎨 **Modern Interface** 
  - Frosted glass effects
  - Smooth animations
  - Elegant dark/light mode
  - Responsive layout
- 💾 **Local Article Cache** - Reduced network requests, fast loading
- ⚙️ **Highly Customizable** 
  - Font size adjustment
  - Color themes
  - Summary length control
  - AI model selection
  - Language switching

### 🚀 Quick Start

#### Installation

Download the latest [release](https://github.com/Tyler913/NewsAIo/releases) and choose the appropriate installer:

- Windows: `.exe` or `.msi` installer
- macOS: `.dmg` package
- Linux: `.AppImage` or `.deb` package

#### Basic Usage

1. **Add RSS Sources**
   - Click the `+` button at the top of the left panel
   - Enter the RSS feed URL and click "Add Feed"

2. **Browse Articles**
   - Select an RSS source from the left panel
   - Click on an article in the middle panel to view its content

3. **AI Features**
   - **Auto Summary**: Enable "Auto-summarize articles" in settings
   - **Manual Summary**: Click "Generate Summary" when reading
   - **Quick Translation**: Support for Chinese/English translation

### ⚙️ Configuration

#### AI Features Setup

1. **API Key Setup**
   - Enter your API keys on the AI Settings page
   - Supports OpenAI, DeepSeek, and Anthropic Claude

2. **Summary Options**
   - Length: Short (2-3 sentences), Medium (4-5), or Long (6-8)
   - Language: Auto (same as article), Chinese, or English
   - Output mode: Streaming or all at once

#### System Requirements

- OS: Windows 10+, macOS 10.13+, or Linux
- Memory: 4GB RAM minimum
- Storage: 500MB free space
- Node.js: v20.0.0 or higher

### 🔨 Developer Guide

#### Build from Source

```bash
# Clone the repository
git clone https://github.com/Tyler913/NewsAIo.git
cd NewsAIo

# Install dependencies
npm install

# Start development server
npm run dev

# Package the application
npm run make
```

#### Tech Stack

- Electron
- Node.js
- HTML/CSS/JavaScript
- OpenAI API
- Anthropic API
- DeepSeek API

### 🤝 Contributing

Pull requests and Issues are welcome! Before submitting, please:

1. Fork the project and create your feature branch
2. Add clear commit messages
3. Update relevant documentation
4. Submit a Pull Request

### 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## 版权和许可 | License

[Apache License 2.0](LICENSE)

© 2024 TylerHong, BillXu
