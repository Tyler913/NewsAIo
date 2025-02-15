const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    logToTerminal: (message) => ipcRenderer.send("log-to-terminal", message),
    logWithLevel: (level, message) =>
        ipcRenderer.send("log-with-level", { level, message }),
    fetchRss: (url) => ipcRenderer.invoke("fetch-rss", url),
    getRssSources: () => ipcRenderer.invoke("get-rss-sources"),
    saveRssSources: (sources) =>
        ipcRenderer.invoke("save-rss-sources", sources),
    // New settings API:
    getSettings: () => ipcRenderer.invoke("get-settings"),
    saveSettings: (settings) => ipcRenderer.invoke("save-settings", settings),
});
