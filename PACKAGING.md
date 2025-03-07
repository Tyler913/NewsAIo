# News AIo - 打包指南

本文档提供了如何为Windows、macOS和Linux三大平台打包News AIo应用程序的详细说明。

## 准备工作

在开始打包之前，请确保已安装所有必要的依赖：

```bash
npm install
```

## 应用图标

应用程序需要为不同平台准备不同格式的图标：

1. Windows: 需要`.ico`格式图标
   - 保存为 `assets/icon.ico`

2. macOS: 需要`.icns`格式图标
   - 保存为 `assets/icon.icns`

3. Linux: 需要`.png`格式图标
   - 保存为 `assets/icon.png`
   - 推荐尺寸：512x512像素

## 打包命令

### 针对特定平台和架构

#### Windows

```bash
# 打包Windows x64版本
npm run make:win-x64

# 打包Windows ARM64版本
npm run make:win-arm64

# 打包Windows所有架构
npm run make:win
```

#### macOS

```bash
# 打包macOS x64版本
npm run make:mac-x64

# 打包macOS ARM64版本（适用于Apple Silicon）
npm run make:mac-arm64

# 打包macOS所有架构
npm run make:mac
```

#### Linux

```bash
# 打包Linux x64版本
npm run make:linux-x64

# 打包Linux ARM64版本
npm run make:linux-arm64

# 打包Linux所有架构
npm run make:linux
```

### 同时打包所有平台

```bash
# 打包所有平台和架构
npm run make:all
```

## 打包输出

所有打包的应用程序文件将保存在 `out/make` 目录下，按照平台和架构分类。

- Windows: 将生成 `.exe` 安装程序和 `.zip` 便携式版本
- macOS: 将生成 `.dmg` 安装镜像和 `.zip` 便携式版本
- Linux: 将生成 `.deb`、`.rpm` 和 `.zip` 包

## 跨平台打包注意事项

### 在 Windows 上打包

- Windows上可以直接打包Windows版本
- 打包macOS和Linux版本需要安装额外的工具
- 建议在各自平台上进行打包

### 在 macOS 上打包

- macOS上可以直接打包macOS版本
- 可以打包Linux版本
- 打包Windows版本需要Wine支持

### 在 Linux 上打包

- Linux上可以直接打包Linux版本
- 打包Windows版本需要Wine支持
- 打包macOS版本可能受到限制

## 签名和公证（发布到应用商店需要）

### Windows 应用签名

对于正式发布，Windows应用需要进行签名：
1. 获取代码签名证书
2. 使用`electron-builder`等工具进行签名

### macOS 签名和公证

macOS应用在分发前需要签名和公证：
1. 需要Apple开发者账户
2. 使用`electron-notarize`进行公证

详情请参考[Electron应用签名和公证指南](https://www.electronjs.org/docs/tutorial/code-signing)

## 问题排查

如果在打包过程中遇到问题，请检查：

1. Node.js和npm版本是否最新
2. 检查所有依赖项是否正确安装
3. 确认forge.config.js配置正确
4. 检查应用图标路径是否正确

## 更多资源

- [Electron Forge文档](https://www.electronforge.io/)
- [Electron打包最佳实践](https://www.electronjs.org/docs/tutorial/application-distribution) 