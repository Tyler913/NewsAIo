const { ipcMain } = require("electron");
const fs = require("fs");
const { app, BrowserWindow } = require("electron/main");
const path = require("node:path");
const Parser = require("rss-parser");
const parser = new Parser();
const crypto = require("crypto"); // Add crypto module

// Change this line to dynamic import
let fetch;
(async () => {
    const { default: fetchModule } = await import("node-fetch");
    fetch = fetchModule;
})();

// Cache configuration
const CACHE_DURATION = 30 * 24 * 60 * 60 * 1000; // 1 hour cache duration
const CACHE_DIR = path.join(app.getPath("userData"), "rss_cache");

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

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

// --- Removed the first duplicate handler for 'fetch-rss' ---

// Add RSS handler with caching
ipcMain.handle("fetch-rss", async (_, url) => {
    const hash = crypto.createHash("md5").update(url).digest("hex");
    const cachePath = path.join(CACHE_DIR, `${hash}.json`);

    let cachedData = null;

    // Try to read cache
    try {
        if (fs.existsSync(cachePath)) {
            const rawData = fs.readFileSync(cachePath, "utf-8");
            cachedData = JSON.parse(rawData);

            // Check if cache is still valid
            if (Date.now() - cachedData.lastFetched < CACHE_DURATION) {
                return cachedData.feed;
            }
        }
    } catch (error) {
        console.error("Cache read error:", error);
    }

    // Fetch fresh data if cache is invalid
    try {
        const feed = await parser.parseURL(url);
        const dataToCache = {
            lastFetched: Date.now(),
            feed: {
                title: feed.title,
                items: feed.items.map((item) => ({
                    title: item.title,
                    content: item.content || item.description,
                    link: item.link,
                    pubDate: item.pubDate,
                })),
            },
        };

        // Update cache
        fs.writeFileSync(cachePath, JSON.stringify(dataToCache), "utf-8");
        return dataToCache.feed;
    } catch (error) {
        // Fallback to cached data if available
        if (cachedData) {
            console.error("Using cached data due to fetch error");
            return cachedData.feed;
        }
        throw error;
    }
});

