const { ipcMain } = require("electron");
const { app, BrowserWindow } = require("electron/main");
const path = require("node:path");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: false,//contextBrige必须在contextIsolation为true时才能使用
            nodeIntegration: true,
        },
    });

    win.loadFile(path.join(__dirname, "index.html"));
};

app.whenReady().then(() => {
    createWindow();
    console.log("window created");

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

ipcMain.on("log-renderer-to-main", (event, log) => {
    console.log(log);
    //event.reply("main-reply", "received");
});
