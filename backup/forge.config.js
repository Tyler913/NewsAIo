module.exports = {
    packagerConfig: {},
    makers: [
        {
            name: "@electron-forge/maker-zip",
            platforms: ["win32", "darwin"], // Now includes macOS
            config: {
                artifactName: (forgeConfig, makerOptions, platform, arch) => {
                    return `${forgeConfig.packageJSON.name}-${forgeConfig.packageJSON.version}-${platform}-${arch}.zip`;
                },
            },
        }
    ],
};
