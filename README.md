# NewsAIo - AI驱动的RSS阅读器 | AI-Powered RSS Reader

<div align="center">
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-blue" alt="Platform - Windows, macOS, Linux">
  <img src="https://img.shields.io/badge/license-Apache--2.0-green" alt="License: Apache-2.0">
  <img src="https://img.shields.io/badge/Electron-v34.0.2-teal" alt="Electron v34.0.2">
</div>

<p align="center">
  <img src="https://raw.githubusercontent.com/Tyler913/NewsAIo/main/assets/logo.png" alt="NewsAIo Logo" width="180">
</p>

[English](#english) | [中文](#中文)

---

## 中文

NewsAIo 是一款功能强大的本地化 RSS 阅读器，集成了多种 AI 功能，可以自动或手动为文章生成摘要。它完全在本地运行，支持多种知名 AI 模型服务商，提供现代化的界面和流畅的用户体验。

### 特性

- **本地化运行** - 所有核心功能无需联网即可使用，RSS 数据本地缓存
- **多种 AI 模型支持** - 集成了 OpenAI、DeepSeek、Anthropic Claude 等主流 AI 模型
- **流式输出** - 类似官方网站的实时逐字输出效果
- **多语言支持** - 界面支持中文和英文，AI 摘要可自动转换语言
- **现代化界面** - 毛玻璃效果、动画过渡、优雅的暗色/亮色模式
- **本地缓存文章** - 减少网络请求，快速加载文章内容
- **可自定义** - 字体大小、颜色主题、摘要长度等多项可定制选项

### 安装

下载最新的 [发行版](https://github.com/Tyler913/NewsAIo/releases) 并按照您的操作系统选择合适的安装包：

- Windows: `.exe` 或 `.msi` 安装程序
- macOS: `.dmg` 安装包
- Linux: `.AppImage` 或 `.deb` 包

### 使用方法

1. **添加 RSS 源**
   - 点击左侧面板顶部的 `+` 按钮
   - 输入 RSS 订阅链接并点击"添加订阅"

2. **浏览文章**
   - 从左侧选择 RSS 源
   - 点击中间面板中的文章查看内容

3. **生成 AI 摘要**
   - **自动摘要**: 在设置中启用"自动总结文章"选项
   - **手动摘要**: 在阅读文章时点击"生成摘要"按钮

4. **配置 AI 设置**
   - 点击右侧的"AI 设置"选项卡
   - 输入您的 API 密钥并选择模型
   - 设置摘要语言和长度

5. **调整应用设置**
   - 点击"应用设置"选项卡
   - 更改界面语言、亮暗主题和字体大小

### AI 功能配置

1. **API 密钥设置**
   - 在 AI 设置页面输入您的 API 密钥
   - 支持 OpenAI、DeepSeek 和 Anthropic Claude

2. **摘要选项**
   - 长度：简短(2-3句)、中等(4-5句)或详细(6-8句)
   - 语言：自动(与文章相同)、中文或英文
   - 输出模式：流式(逐字显示)或一次性显示

### 从源代码构建

```bash
# 克隆代码库
git clone https://github.com/Tyler913/NewsAIo.git
cd NewsAIo

# 安装依赖
npm install

# 启动应用
npm start

# 打包应用
npm run make
```

---

## English

NewsAIo is a powerful local RSS reader with integrated AI capabilities that can automatically or manually generate summaries for articles. It runs completely locally, supports multiple well-known AI model providers, and offers a modern interface with a smooth user experience.

### Features

- **Local Operation** - All core functionality works without requiring internet access, RSS data cached locally
- **Multiple AI Models** - Integration with OpenAI, DeepSeek, Anthropic Claude, and other mainstream AI models
- **Stream Output** - Real-time character-by-character output similar to official websites
- **Multilingual Support** - Interface in Chinese and English, AI summaries can automatically switch languages
- **Modern Interface** - Frosted glass effects, animated transitions, elegant dark/light mode
- **Local Article Cache** - Reduced network requests, fast article loading
- **Customizable** - Font size, color theme, summary length, and many other customizable options

### Installation

Download the latest [release](https://github.com/Tyler913/NewsAIo/releases) and choose the appropriate installer for your operating system:

- Windows: `.exe` or `.msi` installer
- macOS: `.dmg` package
- Linux: `.AppImage` or `.deb` package

### Usage

1. **Add RSS Sources**
   - Click the `+` button at the top of the left panel
   - Enter the RSS feed URL and click "Add Feed"

2. **Browse Articles**
   - Select an RSS source from the left panel
   - Click on an article in the middle panel to view its content

3. **Generate AI Summaries**
   - **Automatic Summaries**: Enable the "Auto-summarize articles" option in settings
   - **Manual Summaries**: Click the "Generate Summary" button when reading an article

4. **Configure AI Settings**
   - Click on the "AI Settings" tab on the right
   - Enter your API keys and select models
   - Set summary language and length

5. **Adjust Application Settings**
   - Click on the "App Settings" tab
   - Change interface language, light/dark theme, and font size

### AI Features Configuration

1. **API Key Setup**
   - Enter your API keys on the AI Settings page
   - Supports OpenAI, DeepSeek, and Anthropic Claude

2. **Summary Options**
   - Length: Short (2-3 sentences), Medium (4-5 sentences), or Long (6-8 sentences)
   - Language: Auto (same as article), Chinese, or English
   - Output mode: Streaming (character by character) or all at once

### Build from Source

```bash
# Clone the repository
git clone https://github.com/Tyler913/NewsAIo.git
cd NewsAIo

# Install dependencies
npm install

# Start the application
npm start

# Package the application
npm run make
```

## 版权和许可 | License

[Apache License 2.0](LICENSE)

© 2024 TylerHong, BillXu
