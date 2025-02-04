const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    logToTerminal: (message) => ipcRenderer.send("log-to-terminal", message),
    logWithLevel: (level, message) => ipcRenderer.send("log-with-level", { level, message }),
});
