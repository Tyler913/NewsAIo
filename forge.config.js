const path = require('path');

module.exports = {
    packagerConfig: {
        // icon: './assets/icon',  // 如果有应用图标，确保设置路径
        asar: true,  // 将应用打包为asar档案以提高性能
        executableName: "News AIo",
        // 设置应用程序元数据
        appBundleId: "com.tylerhong.newsaio",
        appCategoryType: "public.app-category.news",
        appCopyright: "Copyright © 2024 TylerHong, BillXu",
        
        // macOS 增强签名配置 - 确保所有组件都被签名
        osxSign: process.platform === 'darwin' ? {
            identity: process.env.APPLE_DEVELOPER_IDENTITY, // 例如: 'Developer ID Application: Your Name (TEAMID)'
            'hardened-runtime': true,
            'gatekeeper-assess': false,
            entitlements: 'entitlements.plist',
            'entitlements-inherit': 'entitlements.plist',
            'signature-flags': 'library',
            'entitlements-loginhelper': 'entitlements.plist',
            'provisioning-profile': undefined,
            'preAutoEntitlements': false,
            'preEmbedProvisioningProfile': false,
            'strict-verify': false,
            'type': 'distribution',
            // 自定义钩子，确保所有子组件都能被正确签名
            'install-helper': true, // 安装helper应用
            'sign-helper': true,    // 对helper应用签名
            hardenedRuntime: true,  // 再次确认开启硬化运行时
            // 需要签名的已知组件列表
            binaries: [
                // 签名所有 Electron 框架内的可执行组件
                './News AIo.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework',
                './News AIo.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libffmpeg.dylib',
                './News AIo.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libEGL.dylib',
                './News AIo.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libGLESv2.dylib',
                './News AIo.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libswiftshader_libEGL.dylib',
                './News AIo.app/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/libswiftshader_libGLESv2.dylib',
                './News AIo.app/Contents/Frameworks/Electron Framework.framework',
                // 签名所有 Helper 应用
                './News AIo.app/Contents/Frameworks/News AIo Helper.app/Contents/MacOS/News AIo Helper',
                './News AIo.app/Contents/Frameworks/News AIo Helper.app',
                './News AIo.app/Contents/Frameworks/News AIo Helper (GPU).app/Contents/MacOS/News AIo Helper (GPU)',
                './News AIo.app/Contents/Frameworks/News AIo Helper (GPU).app',
                './News AIo.app/Contents/Frameworks/News AIo Helper (Plugin).app/Contents/MacOS/News AIo Helper (Plugin)',
                './News AIo.app/Contents/Frameworks/News AIo Helper (Plugin).app',
                './News AIo.app/Contents/Frameworks/News AIo Helper (Renderer).app/Contents/MacOS/News AIo Helper (Renderer)',
                './News AIo.app/Contents/Frameworks/News AIo Helper (Renderer).app',
                // 主应用
                './News AIo.app/Contents/MacOS/News AIo',
                './News AIo.app'
            ]
        } : undefined,
        
        // macOS 公证配置，使用新的 @electron/notarize
        osxNotarize: process.platform === 'darwin' ? {
            tool: 'notarytool',
            appBundleId: "com.tylerhong.newsaio",
            appleId: process.env.APPLE_ID,
            appleIdPassword: process.env.APPLE_APP_PASSWORD, // 应用专用密码
            teamId: process.env.APPLE_TEAM_ID
        } : undefined,
        
        // 自定义afterSign钩子，确保在签名后执行任何必要的后处理
        afterSign: process.platform === 'darwin' ? path.resolve(__dirname, 'scripts/after-sign.js') : undefined
    },
    rebuildConfig: {},
    makers: [
        // Windows版本 - 仅在Windows环境构建时使用此配置
        {
            name: '@electron-forge/maker-squirrel',
            config: {
                authors: 'TylerHong, BillXu',
                description: 'AI-powered RSS reader with automatic summarization',
                // iconUrl: 'https://raw.githubusercontent.com/Tyler913/NewsAIo/main/assets/icon.ico',
                // setupIcon: './assets/icon.ico',
            },
            platforms: process.platform === 'win32' ? ['win32'] : [],
        },
        // macOS版本 - DMG格式
        {
            name: '@electron-forge/maker-dmg',
            config: {
                // icon: './assets/icon.icns',
                // background: './assets/dmg-background.png',  // 如果有DMG背景图
                format: 'ULFO',
            },
            platforms: ['darwin'],
        },
        // Linux版本 - Debian包
        {
            name: '@electron-forge/maker-deb',
            config: {
                options: {
                    maintainer: 'TylerHong, BillXu',
                    homepage: 'https://github.com/Tyler913/NewsAIo',
                    // icon: './assets/icon.png',
                },
            },
            platforms: ['linux'],
        },
        // Linux版本 - RPM包
        {
            name: '@electron-forge/maker-rpm',
            config: {
                options: {
                    maintainer: 'TylerHong, BillXu',
                    homepage: 'https://github.com/Tyler913/NewsAIo',
                    // icon: './assets/icon.png',
                },
            },
            platforms: ['linux'],
        },
        // 通用ZIP格式 - 所有平台通用
        {
            name: '@electron-forge/maker-zip',
            platforms: ['darwin', 'linux', 'win32'],
        },
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'Tyler913',
                    name: 'NewsAIo',
                },
                prerelease: true,
            },
        },
    ],
};
