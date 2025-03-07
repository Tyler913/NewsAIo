const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    // Logging
    logToTerminal: (message) => ipcRenderer.send("log-to-terminal", message),
    logWithLevel: (level, message) =>
        ipcRenderer.send("log-with-level", { level, message }),
    
    // RSS functionality
    fetchRss: (url) => ipcRenderer.invoke("fetch-rss", url),
    getRssSources: () => ipcRenderer.invoke("get-rss-sources"),
    saveRssSources: (sources) =>
        ipcRenderer.invoke("save-rss-sources", sources),
    addRssSource: (url) => ipcRenderer.invoke("add-rss-source", url),
    
    // Settings
    getSettings: () => ipcRenderer.invoke("get-settings"),
    saveSettings: (settings) => ipcRenderer.invoke("save-settings", settings),
    
    // API Settings
    getApiSettings: () => ipcRenderer.invoke("get-api-settings"),
    saveApiSettings: (settings) => ipcRenderer.invoke("save-api-settings", settings),
}); 