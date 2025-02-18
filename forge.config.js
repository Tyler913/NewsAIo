module.exports = {
    packagerConfig: {},
    makers: [
        {
            name: "@electron-forge/maker-zip",
            platforms: ["win32"],
            config: {
                artifactName: (forgeConfig, makerOptions, platform, arch) => {
                    return `${forgeConfig.packageJSON.name}-${forgeConfig.packageJSON.version}-${platform}-${arch}.zip`;
                },
            },
        },
        {
            name: "@electron-forge/maker-dmg",
            platforms: ["darwin"],
            config: {
                artifactName: (forgeConfig, makerOptions, platform, arch) => {
                    return `${forgeConfig.packageJSON.name}-${forgeConfig.packageJSON.version}-${platform}-${arch}.dmg`;
                },
            },
        },
    ],
};
