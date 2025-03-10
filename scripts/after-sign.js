// 签名后钩子 - 处理macOS公证和验证
const fs = require('fs');
const path = require('path');
const { notarize } = require('@electron/notarize');
const { execSync } = require('child_process');

// 验证应用是否已正确签名的函数
async function verifySignature(appPath) {
  try {
    console.log(`正在验证应用签名: ${appPath}`);
    const output = execSync(`codesign --verify --verbose=4 "${appPath}"`, { encoding: 'utf8' });
    console.log(`签名验证成功: ${output}`);
    
    // 验证 Helper 应用
    const helperPaths = [
      path.join(appPath, 'Contents/Frameworks/News AIo Helper.app'),
      path.join(appPath, 'Contents/Frameworks/News AIo Helper (GPU).app'),
      path.join(appPath, 'Contents/Frameworks/News AIo Helper (Plugin).app'),
      path.join(appPath, 'Contents/Frameworks/News AIo Helper (Renderer).app')
    ];
    
    for (const helperPath of helperPaths) {
      if (fs.existsSync(helperPath)) {
        console.log(`验证 Helper 应用: ${helperPath}`);
        const helperOutput = execSync(`codesign --verify --verbose=4 "${helperPath}"`, { encoding: 'utf8' });
        console.log(`Helper 验证成功: ${helperOutput}`);
      }
    }
    
    return true;
  } catch (error) {
    console.error('应用签名验证失败:', error);
    return false;
  }
}

// 检查是否需要公证
function shouldNotarize() {
  // 确保只在 macOS 平台上公证
  if (process.platform !== 'darwin') return false;
  
  // 确保有所有必要的环境变量
  const { 
    APPLE_ID, 
    APPLE_APP_PASSWORD, 
    APPLE_TEAM_ID,
    SKIP_NOTARIZATION
  } = process.env;
  
  // 如果设置了跳过公证的环境变量，则跳过
  if (SKIP_NOTARIZATION === 'true') return false;
  
  return !!(APPLE_ID && APPLE_APP_PASSWORD && APPLE_TEAM_ID);
}

// 主函数 - 在应用签名后运行
module.exports = async function afterSign(params) {
  // 提取参数
  const { appOutDir, packager, outDir, electronPlatformName } = params;
  
  // 只在 macOS 上执行
  if (electronPlatformName !== 'darwin') {
    console.log('非 macOS 平台，跳过签名和公证');
    return;
  }
  
  // 构建应用路径
  const appName = packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);
  
  // 验证应用签名
  const isSignatureValid = await verifySignature(appPath);
  
  if (!isSignatureValid) {
    console.warn('⚠️ 应用签名验证失败，但仍继续执行');
  } else {
    console.log('✅ 应用签名验证通过');
  }
  
  // 检查是否需要进行公证
  if (!shouldNotarize()) {
    console.log('跳过公证过程 (未配置凭据或明确跳过)');
    return;
  }
  
  // 进行公证
  try {
    console.log(`开始公证应用: ${appName}`);
    
    // 公证参数
    const notarizeOptions = {
      appPath,
      appBundleId: packager.config.appBundleId || 'com.tylerhong.newsaio',
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_APP_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
      tool: 'notarytool',
    };
    
    console.log('公证参数:', { 
      ...notarizeOptions, 
      appleIdPassword: '***隐藏***' 
    });
    
    // 执行公证
    await notarize(notarizeOptions);
    
    console.log(`✅ 公证成功: ${appName}`);
  } catch (error) {
    console.error(`❌ 公证失败: ${error}`);
    throw error;
  }
}; 