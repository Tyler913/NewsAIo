const { ipcMain, app, nativeTheme, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("node:path");
const Parser = require("rss-parser");
const parser = new Parser();
const crypto = require("crypto");

// Change this line to dynamic import
let fetch;
(async () => {
    const { default: fetchModule } = await import("node-fetch");
    fetch = fetchModule;
})();

// Cache configuration
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours cache duration
const CACHE_DIR = path.join(app.getPath("userData"), "rss_cache");

// Ensure cache directory exists
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// ---------- Persistent RSS Sources -------------
const SOURCES_FILE = path.join(app.getPath("userData"), "rss_sources.json");
const DEFAULT_SOURCES = [
    { title: "极客公园", url: "http://mainssl.geekpark.net/rss.rss" },
    { title: "36Ker", url: "https://36kr.com/feed" },
];

if (!fs.existsSync(SOURCES_FILE)) {
    fs.writeFileSync(
        SOURCES_FILE,
        JSON.stringify(DEFAULT_SOURCES, null, 2),
        "utf-8"
    );
}

ipcMain.handle("get-rss-sources", async () => {
    try {
        const data = fs.readFileSync(SOURCES_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to read sources file:", error);
        return DEFAULT_SOURCES;
    }
});

ipcMain.handle("save-rss-sources", async (event, sources) => {
    try {
        fs.writeFileSync(
            SOURCES_FILE,
            JSON.stringify(sources, null, 2),
            "utf-8"
        );
        return true;
    } catch (error) {
        console.error("Failed to save sources file:", error);
        return false;
    }
});
// -----------------------------------------------

// ---------- Persistent Settings --------------
// Use system setting as the default for dark mode.
const SETTINGS_FILE = path.join(app.getPath("userData"), "settings.json");
const DEFAULT_SETTINGS = {
    darkMode: nativeTheme.shouldUseDarkColors,
    fontScale: 1.0,
};

if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(
        SETTINGS_FILE,
        JSON.stringify(DEFAULT_SETTINGS, null, 2),
        "utf-8"
    );
}

ipcMain.handle("get-settings", async () => {
    try {
        const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("Failed to read settings file:", error);
        return DEFAULT_SETTINGS;
    }
});

ipcMain.handle("save-settings", async (event, settings) => {
    try {
        fs.writeFileSync(
            SETTINGS_FILE,
            JSON.stringify(settings, null, 2),
            "utf-8"
        );
        return true;
    } catch (error) {
        console.error("Failed to save settings file:", error);
        return false;
    }
});
// -----------------------------------------------

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
                    // If the feed provides an enclosure with an image
                    image:
                        item.enclosure && item.enclosure.url
                            ? item.enclosure.url
                            : null,
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
