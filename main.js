const { ipcMain, app, nativeTheme, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("node:path");

// Change this line to dynamic import
let fetch;
(async () => {
    const { default: fetchModule } = await import("node-fetch");
    fetch = fetchModule;
})();

// ---------- Persistent Settings (unchanged) ----------
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
// -----------------------------------------------------

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

// Simple log passthrough
ipcMain.on("log-with-level", (_, { level, message }) => {
    console.log(`[Renderer][${level}] ${message}`);
});

// -----------------------------------------------------
// NEW: All RSS operations now call the Python backend.
// -----------------------------------------------------

/**
 * Retrieve the list of RSS sources from the Python server.
 * Expects the backend to respond with JSON like:
 *     { "rss_sources": [ { "title": "...", "url": "..." }, ... ] }
 */
ipcMain.handle("get-rss-sources", async () => {
    try {
        const response = await fetch("http://141.147.74.209:5000/get_rss_sources");
        if (!response.ok) throw new Error("Failed to get RSS sources");
        const data = await response.json();
        // Return the array of sources for the renderer
        return data.rss_sources || [];
    } catch (error) {
        console.error("Error fetching sources from backend:", error);
        return [];
    }
});

/**
 * Save (or replace) the entire list of RSS sources in the Python server’s database.
 * The renderer calls this with an array of sources:
 *     [ { title: "My RSS", url: "http://..." }, ... ]
 * We'll POST that entire array to the server endpoint.
 */
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

/**
 * Fetch the articles for a given RSS URL from the Python server.
 * The server will parse (and store) the feed, generate summaries,
 * and return JSON like:
 * {
 *   "title": "Feed Title",
 *   "items": [
 *      {
 *        "title": "...",
 *        "content": "...",
 *        "link": "...",
 *        "pubDate": "...",
 *        "summary": "..."
 *      },
 *      ...
 *   ]
 * }
 */
ipcMain.handle("fetch-rss", async (_, url) => {
    try {
        const response = await fetch("http://141.147.74.209:5000/fetch_rss", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ url }),
        });
        if (!response.ok) {
            throw new Error(`fetch_rss request failed: ${response.statusText}`);
        }
        const data = await response.json();
        return data; // { title, items: [...] }
    } catch (error) {
        console.error("Error in fetch-rss from backend:", error);
        throw error;
    }
});
