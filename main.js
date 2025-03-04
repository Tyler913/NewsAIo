const { ipcMain, app, nativeTheme, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

// We'll load node-fetch dynamically.
let fetch;
(async () => {
    const { default: fetchModule } = await import("node-fetch");
    fetch = fetchModule;
})();

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 hours
const CACHE_DIR = path.join(app.getPath("userData"), "rss_cache");
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// ---------- Settings ----------
const SETTINGS_FILE = path.join(app.getPath("userData"), "settings.json");
const DEFAULT_SETTINGS = {
    darkMode: nativeTheme.shouldUseDarkColors,
    fontScale: 1.0,
};

// Create the settings file if not present
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
// ------------------------------

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

// For logs from renderer
ipcMain.on("log-with-level", (_, { level, message }) => {
    console.log(`[Renderer][${level}] ${message}`);
});

// ----- Helper: do all items have AI summary? -----
function allItemsHaveSummary(feedItems = []) {
    return feedItems.every(
        (item) => item.summary && item.summary.trim().length > 0
    );
}

// ----------------------------------
//  Call Python backend for sources
// ----------------------------------
ipcMain.handle("get-rss-sources", async () => {
    try {
        const response = await fetch("http://141.147.74.209:5000/get_rss_sources");
        if (!response.ok) throw new Error("Failed to get RSS sources");
        const data = await response.json();
        return data.rss_sources || [];
    } catch (error) {
        console.error("Error fetching sources from backend:", error);
        return [];
    }
});

ipcMain.handle("save-rss-sources", async (_, sources) => {
    try {
        const response = await fetch("http://141.147.74.209:5000/save_rss_sources", {
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

// ---------------------------------
//   fetch-rss with partial cache
// ---------------------------------
ipcMain.handle("fetch-rss", async (_, url) => {
    const hash = crypto.createHash("md5").update(url).digest("hex");
    const cachePath = path.join(CACHE_DIR, `${hash}.json`);

    let cachedData = null;

    // Try reading from local cache
    if (fs.existsSync(cachePath)) {
        try {
            const rawData = fs.readFileSync(cachePath, "utf-8");
            cachedData = JSON.parse(rawData);

            const isNotExpired =
                Date.now() - cachedData.lastFetched < CACHE_DURATION;
            const feed = cachedData.feed || {};

            // Check if feed has AI summary for all items
            const hasAllSummaries =
                feed.items && allItemsHaveSummary(feed.items);

            if (isNotExpired && hasAllSummaries) {
                console.log("Returning fully cached feed for:", url);
                return feed; // Serve from local cache
            } else {
                console.log(
                    "Cache found but is missing summaries or is stale. Will refetch."
                );
            }
        } catch (error) {
            console.error("Error reading cache file:", error);
        }
    }

    // If no cache or missing summary or stale => fetch from server
    try {
        const response = await fetch("http://141.147.74.209:5000/fetch_rss", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) {
            throw new Error(`fetch_rss request failed: ${response.statusText}`);
        }
        const feed = await response.json(); // { title, items: [...] }

        // Save new feed to local cache (including summaries)
        const dataToCache = {
            lastFetched: Date.now(),
            feed,
        };
        fs.writeFileSync(cachePath, JSON.stringify(dataToCache), "utf-8");

        console.log("Fetched from server and cached:", url);
        return feed;
    } catch (error) {
        // If backend fetch fails, but we have old cached data, fallback
        if (cachedData) {
            console.error("Using old cached data due to fetch error:", error);
            return cachedData.feed;
        }
        // Otherwise rethrow
        throw error;
    }
});
