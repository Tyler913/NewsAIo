const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    logToTerminal: (message) => ipcRenderer.send("log-to-terminal", message),
});
