module.exports = {
    packagerConfig: {
        // icon: './assets/icon',  // 如果有应用图标，确保设置路径
        asar: true,  // 将应用打包为asar档案以提高性能
        executableName: "News AIo",
        // 设置应用程序元数据
        appBundleId: "com.tylerhong.newsaio",
        appCategoryType: "public.app-category.news",
        appCopyright: "Copyright © 2024 TylerHong, BillXu",
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
