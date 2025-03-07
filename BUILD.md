# News AIo 构建指南

## 快速开始

要为各平台构建News AIo应用程序，请按照以下步骤操作：

1. **安装依赖**:
   ```bash
   npm install
   ```

2. **准备应用图标**:
   将适当的图标文件添加到`assets`目录：
   - Windows: `assets/icon.ico`
   - macOS: `assets/icon.icns`
   - Linux: `assets/icon.png`

3. **选择打包命令**:
   ```bash
   # 仅打包当前平台
   npm run make
   
   # 打包所有平台
   npm run make:all
   
   # 查看更多打包选项
   cat PACKAGING.md
   ```

4. **查看输出**:
   所有打包的应用程序文件将保存在`out/make`目录中，按平台和架构分类。

## 详细说明

详细的打包说明请参阅[PACKAGING.md](PACKAGING.md)文件，其中包含：
- 所有打包命令的完整列表
- 针对各平台和架构的特定指导
- 跨平台打包注意事项
- 应用程序签名和公证信息

## 常见问题

如果遇到打包问题：
1. 确保Node.js和npm版本最新
2. 检查是否安装了所有必要的依赖
3. 验证forge.config.js配置是否正确
4. 确保应用图标文件存在并位于正确位置 