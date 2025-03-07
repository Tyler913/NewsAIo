## News AIo

<div align="center">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platform - Windows, macOS, Linux">
  <img src="https://img.shields.io/badge/license-Apache--2.0-green" alt="License: Apache-2.0">
  <img src="https://img.shields.io/badge/Electron-v34.0.2-teal" alt="Electron v34.0.2">
  <img src="https://img.shields.io/badge/Node.js-v20.0.0+-orange" alt="Node.js v20.0.0+">
  <img src="https://img.shields.io/badge/OpenAI-GPT--4%20Ready-purple" alt="OpenAI GPT-4 Ready">
  <img src="https://img.shields.io/badge/Claude-3%20Ready-blueviolet" alt="Claude-3 Ready">
</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/Tyler913/NewsAIo/main/assets/logo.png" alt="News AIo Logo" width="180">
</p>

News AIo 是一款基于 Electron 和 Node.js 构建的本地化 RSS 阅读器，集成了最新 AI 技术，实现文章自动摘要和即时翻译等强大功能。该项目支持多种 AI 模型（如 OpenAI GPT-3.5/4、Anthropic Claude 和 DeepSeek），同时具备流式输出、自动摘要、快速翻译、暗色模式、毛玻璃效果以及本地缓存等特性，为用户提供现代化、流畅且高度可定制的阅读体验。

[English](#english) | [中文](#中文)

---

## 中文

### 📋 项目状态

> **开发中** - 本项目目前处于积极开发阶段，核心功能已经实现，但仍在不断优化和增加新特性。

### ✨ 已实现特性

- 🌐 **本地化 RSS 解析与缓存** - 通过 RSS-Parser 解析订阅源，本地缓存减少请求
- 🤖 **多种 AI 模型集成** 
  - OpenAI GPT-3.5/4
  - Anthropic Claude 3
  - DeepSeek
- 🌊 **流式 AI 输出** - 实时逐字显示 AI 生成内容
- 🌍 **多语言界面** - 支持中文和英文界面切换
- 🎨 **现代化三栏界面** 
  - 毛玻璃效果
  - 流畅动画过渡
  - 暗色/亮色模式自动与手动切换
  - 响应式设计适配不同屏幕
- 💾 **文章本地缓存** - 减少网络请求，加快加载速度
- ⚙️ **多项自定义选项** 
  - 字体大小调节
  - 主题切换
  - AI 摘要长度控制
  - 多种 AI 模型选择

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

3. **AI 功能**
   - **自动摘要**: 在设置中启用"自动生成摘要"选项
   - **手动摘要**: 阅读文章时点击"生成摘要"按钮
   - **快速翻译**: 使用语言切换按钮实现中英文互译

### ⚙️ 配置说明

#### AI 功能配置

1. **API 密钥设置**
   - 点击右上角机器人图标打开 AI 设置面板
   - 输入您的 API 密钥（支持 OpenAI、DeepSeek 和 Anthropic Claude）
   - 选择您偏好的 AI 模型

2. **摘要选项**
   - 长度：简短(2-3句)、中等(4-5句)或详细(6-8句)
   - 语言：自动(与文章相同)、中文或英文
   - 输出模式：流式(逐字显示)或一次性显示

#### 应用设置

- 点击右上角齿轮图标打开应用设置面板
- 调整字体大小、切换暗色模式、设置界面语言等

### 🔨 开发者指南

#### 从源代码构建

```bash
# 克隆代码库
git clone https://github.com/Tyler913/NewsAIo.git
cd NewsAIo

# 安装依赖
npm install

# 启动开发服务器
npm start

# 打包应用
npm run make
```

#### 技术栈

- Electron v34.0.2
- Node.js v20.0.0+
- HTML/CSS/JavaScript
- 外部API: OpenAI, Anthropic, DeepSeek

### 🛣️ 开发路线图

- [ ] 批量文章摘要生成
- [ ] 改进离线模式功能
- [ ] 自定义 RSS 源分类与标签
- [ ] 阅读进度同步
- [ ] 更多语言支持
- [ ] 移动端适配优化
- [ ] 导入/导出功能

### 🤝 贡献指南

欢迎提交 Pull Requests 和 Issues！在提交前，请确保：

1. Fork 项目并创建您的特性分支
2. 添加清晰的 commit 信息
3. 更新相关文档
4. 提交 Pull Request

---

## English

### 📋 Project Status

> **In Development** - This project is under active development with core functionality implemented, but continuously being enhanced with new features and optimizations.

### ✨ Implemented Features

- 🌐 **Local RSS Parsing & Caching** - Parses feeds using RSS-Parser with local caching to reduce requests
- 🤖 **Multiple AI Models** 
  - OpenAI GPT-3.5/4
  - Anthropic Claude 3
  - DeepSeek
- 🌊 **Streaming AI Output** - Real-time character-by-character display of AI-generated content
- 🌍 **Multilingual Interface** - Supports Chinese and English UI switching
- 🎨 **Modern Three-Column UI** 
  - Frosted glass effects
  - Smooth animations
  - Dark/light mode (automatic and manual)
  - Responsive design for different screen sizes
- 💾 **Article Local Caching** - Reduces network requests, speeds up loading
- ⚙️ **Multiple Customization Options** 
  - Font size adjustment
  - Theme switching
  - AI summary length control
  - Multiple AI model selection

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
   - **Manual Summary**: Click "Generate Summary" button when reading
   - **Quick Translation**: Use the language toggle button for Chinese/English translation

### ⚙️ Configuration

#### AI Features Setup

1. **API Key Setup**
   - Click the robot icon in the top-right to open AI settings panel
   - Enter your API keys (supports OpenAI, DeepSeek, and Anthropic Claude)
   - Select your preferred AI model

2. **Summary Options**
   - Length: Short (2-3 sentences), Medium (4-5), or Long (6-8)
   - Language: Auto (same as article), Chinese, or English
   - Output mode: Streaming or all at once

#### Application Settings

- Click the gear icon in the top-right to open application settings
- Adjust font size, toggle dark mode, set interface language, etc.

### 🔨 Developer Guide

#### Build from Source

```bash
# Clone the repository
git clone https://github.com/Tyler913/NewsAIo.git
cd NewsAIo

# Install dependencies
npm install

# Start development server
npm start

# Package the application
npm run make
```

#### Tech Stack

- Electron v34.0.2
- Node.js v20.0.0+
- HTML/CSS/JavaScript
- External APIs: OpenAI, Anthropic, DeepSeek

### 🛣️ Development Roadmap

- [ ] Batch article summarization
- [ ] Improved offline mode
- [ ] Custom RSS feed categorization and tagging
- [ ] Reading progress synchronization
- [ ] Additional language support
- [ ] Mobile responsiveness improvements
- [ ] Import/export functionality

### 🤝 Contributing

Pull requests and Issues are welcome! Before submitting, please:

1. Fork the project and create your feature branch
2. Add clear commit messages
3. Update relevant documentation
4. Submit a Pull Request

## 版权和许可 | License

[Apache License 2.0](LICENSE)

© 2024 TylerHong, BillXu
