const { ipcMain } = require("electron");
const fs = require("fs");
const { app, BrowserWindow } = require("electron/main");
const path = require("node:path");

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1600,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true, //contextBridge必须在contextIsolation为true时才能使用
            nodeIntegration: false,
        },
    });

    // win.webContents.openDevTools();

    win.loadFile(path.join(__dirname, "index.html"));
};

app.whenReady().then(() => {
    createWindow();

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

// Listen for logs from renderer
ipcMain.on("log-to-terminal", (_, message) => {
    console.log(`[Renderer] ${message}`); // Log to terminal
    writeToFile(message); // Optional: Write to file
});

// Optional: Write logs to a file
function writeToFile(message) {
    const logPath = path.join(__dirname, "logs.txt");
    fs.appendFile(
        logPath,
        `${new Date().toISOString()} - ${message}\n`,
        (err) => {
            if (err) console.error("Log write failed:", err);
        }
    );
}
