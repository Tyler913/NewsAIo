/****************************************************
 * main.js - Electron main process with local caching
 * for RSS articles + AI summaries received from the
 * Python backend.
 ****************************************************/
const { ipcMain, app, nativeTheme, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("node:path");
const crypto = require("crypto");

// Use dynamic import for node-fetch
let fetch;
(async () => {
    const { default: fetchModule } = await import("node-fetch");
    fetch = fetchModule;
})();

// ---------- Cache Configuration ----------
const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours
const CACHE_DIR = path.join(app.getPath("userData"), "rss_cache");
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// ---------- Persistent Settings ----------
const SETTINGS_FILE = path.join(app.getPath("userData"), "settings.json");
const DEFAULT_SETTINGS = {
    darkMode: nativeTheme.shouldUseDarkColors,
    fontScale: 1.0,
};

// Create settings file if not present
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
// -----------------------------------------

function createWindow() {
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

    win.loadFile(path.join(__dirname, "index.html"));
}

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

// Renderer log passthrough
ipcMain.on("log-with-level", (_, { level, message }) => {
    console.log(`[Renderer][${level}] ${message}`);
});

// ----------------------------
// Communication with Backend
// ----------------------------

/**
 * GET the RSS sources from the Python server DB.
 */
ipcMain.handle("get-rss-sources", async () => {
    try {
        const response = await fetch("http://localhost:5000/get_rss_sources");
        if (!response.ok) throw new Error("Failed to get RSS sources");
        const data = await response.json();
        return data.rss_sources || [];
    } catch (error) {
        console.error("Error fetching sources from backend:", error);
        return [];
    }
});

/**
 * Save the entire list of RSS sources to the Python server DB.
 */
ipcMain.handle("save-rss-sources", async (_, sources) => {
    try {
        const response = await fetch("http://localhost:5000/save_rss_sources", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rss_sources: sources }),
        });
        if (!response.ok) throw new Error("Failed to save RSS sources");
        return true;
    } catch (error) {
        console.error("Error saving RSS sources to backend:", error);
        return false;
    }
});

/**
 * Fetch the feed (articles + AI summaries) from the local cache if fresh;
 * otherwise call the Python backend, then cache the result.
 */
ipcMain.handle("fetch-rss", async (_, url) => {
    // Create a filename by hashing the URL
    const hash = crypto.createHash("md5").update(url).digest("hex");
    const cachePath = path.join(CACHE_DIR, `${hash}.json`);

    let cachedData = null;

    // Try reading from local cache
    try {
        if (fs.existsSync(cachePath)) {
            const rawData = fs.readFileSync(cachePath, "utf-8");
            cachedData = JSON.parse(rawData);

            // If cache is still valid, return it
            if (Date.now() - cachedData.lastFetched < CACHE_DURATION) {
                console.log("Returning cached feed for:", url);
                return cachedData.feed;
            }
        }
    } catch (error) {
        console.error("Error reading cache file:", error);
    }

    // If no valid cache, fetch from the server
    try {
        const response = await fetch("http://localhost:5000/fetch_rss", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) {
            throw new Error(`fetch_rss request failed: ${response.statusText}`);
        }
        const feed = await response.json(); // { title, items: [...] }

        // Cache the new feed locally
        const dataToCache = {
            lastFetched: Date.now(),
            feed, // includes AI summaries
        };
        fs.writeFileSync(cachePath, JSON.stringify(dataToCache), "utf-8");

        return feed;
    } catch (error) {
        // If backend fetch fails, but we have old cached data, use it
        if (cachedData) {
            console.error("Using cached data due to fetch error:", error);
            return cachedData.feed;
        }
        throw error;
    }
});
