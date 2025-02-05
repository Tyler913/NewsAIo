const { ipcMain } = require("electron");
const fs = require("fs");
const { app, BrowserWindow } = require("electron/main");
const path = require("node:path");
const Parser = require('rss-parser');
const parser = new Parser();

const createWindow = () => {
    const win = new BrowserWindow({
        width: 1600,
        height: 1000,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            contextIsolation: true,
            nodeIntegration: false,
            devTools: true,
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

ipcMain.on("log-with-level", (_, { level, message }) => {
    console.log(`[Renderer][${level}] ${message}`);
});

// Add RSS handler
ipcMain.handle('fetch-rss', async (_, url) => {
    try {
        const feed = await parser.parseURL(url);
        return {
            title: feed.title,
            items: feed.items.map(item => ({
                title: item.title,
                content: item.content || item.description,
                link: item.link,
                pubDate: item.pubDate
            }))
        };
    } catch (error) {
        console.error('RSS Error:', error);
        throw error;
    }
});
