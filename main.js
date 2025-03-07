const { ipcMain, app, nativeTheme, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const RssParser = require('rss-parser');

// 设置全局编码
process.env.LANG = 'zh-CN.UTF-8';

// 创建RSS解析器
const rssParser = new RssParser({
    customFields: {
        item: [
            ['content:encoded', 'contentEncoded'],
            ['media:content', 'media', {keepArray: true}],
            ['media:thumbnail', 'thumbnail'],
            ['dc:creator', 'creator'],
        ]
    }
});

const CACHE_DURATION = 6 * 60 * 60 * 1000; // 6 小时缓存
const CACHE_DIR = path.join(app.getPath("userData"), "rss_cache");
if (!fs.existsSync(CACHE_DIR)) {
    fs.mkdirSync(CACHE_DIR, { recursive: true });
}

// ---------- 应用设置 ----------
const SETTINGS_FILE = path.join(app.getPath("userData"), "settings.json");
const DEFAULT_SETTINGS = {
    darkMode: nativeTheme.shouldUseDarkColors,
    fontScale: 1.0,
    autoSummarize: false, // 默认不自动总结
    language: "zh-CN", // 默认使用简体中文
    useStreamMode: true, // 默认使用流式输出
};

// AI API设置
const API_SETTINGS_FILE = path.join(app.getPath("userData"), "api_settings.json");
const DEFAULT_API_SETTINGS = {
    activeProvider: "openai",
    summaryLength: "medium",
    summaryLanguage: "auto", // 'auto'表示与文章相同语言，也可以是'zh-CN'或'en-US'
    providers: {
        openai: {
            apiKey: "",
            model: "gpt-3.5-turbo",
        },
        deepseek: {
            apiKey: "",
            model: "deepseek-chat",
        },
        anthropic: {
            apiKey: "",
            model: "claude-3-haiku",
        },
    },
};

// 本地RSS源存储
const RSS_SOURCES_FILE = path.join(app.getPath("userData"), "rss_sources.json");
const DEFAULT_RSS_SOURCES = [
    {
        title: "The Verge",
        url: "https://www.theverge.com/rss/index.xml"
    },
    {
        title: "NASA最新消息",
        url: "https://www.nasa.gov/feed/"
    },
    {
        title: "36氪",
        url: "https://36kr.com/feed"
    },
    {
        title: "极客公园",
        url: "http://feed.geekpark.net/"
    }
];

// 创建配置文件，如果不存在
if (!fs.existsSync(SETTINGS_FILE)) {
    fs.writeFileSync(
        SETTINGS_FILE,
        JSON.stringify(DEFAULT_SETTINGS, null, 2),
        "utf-8"
    );
}

if (!fs.existsSync(API_SETTINGS_FILE)) {
    fs.writeFileSync(
        API_SETTINGS_FILE,
        JSON.stringify(DEFAULT_API_SETTINGS, null, 2),
        "utf-8"
    );
}

if (!fs.existsSync(RSS_SOURCES_FILE)) {
    fs.writeFileSync(
        RSS_SOURCES_FILE,
        JSON.stringify(DEFAULT_RSS_SOURCES, null, 2),
        "utf-8"
    );
}

// 设置处理器
ipcMain.handle("get-settings", async () => {
    try {
        const data = fs.readFileSync(SETTINGS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("读取设置文件失败:", error);
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
        console.error("保存设置文件失败:", error);
        return false;
    }
});

// API设置处理器
ipcMain.handle("get-api-settings", async () => {
    try {
        const data = fs.readFileSync(API_SETTINGS_FILE, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        console.error("读取API设置文件失败:", error);
        return DEFAULT_API_SETTINGS;
    }
});

ipcMain.handle("save-api-settings", async (event, apiSettings) => {
    try {
        fs.writeFileSync(
            API_SETTINGS_FILE,
            JSON.stringify(apiSettings, null, 2),
            "utf-8"
        );
        return true;
    } catch (error) {
        console.error("保存API设置文件失败:", error);
        return false;
    }
});

// AI摘要功能
ipcMain.handle("summarize-article", async (event, { text, provider, model, length }) => {
    try {
        // 获取API设置
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        
        // 如果未提供参数，使用默认设置
        provider = provider || apiSettings.activeProvider;
        model = model || apiSettings.providers[provider].model;
        length = length || apiSettings.summaryLength;
        
        const apiKey = apiSettings.providers[provider].apiKey;
        if (!apiKey) {
            throw new Error(`未配置${provider}的API密钥`);
        }
        
        // 根据长度定义提示词
        let promptLength;
        switch (length) {
            case "short":
                promptLength = "2-3句话";
                break;
            case "long":
                promptLength = "6-8句话";
                break;
            case "medium":
            default:
                promptLength = "4-5句话";
                break;
        }
        
        const prompt = `用${promptLength}总结以下文章。请专注于主要观点和核心见解：\n\n${text}`;
        
        // 根据提供商选择相应的API调用方法
        let summary;
        switch (provider) {
            case "openai":
                summary = await callOpenAI(apiKey, model, prompt);
                break;
            case "deepseek":
                summary = await callDeepSeek(apiKey, model, prompt);
                break;
            case "anthropic":
                summary = await callAnthropic(apiKey, model, prompt);
                break;
            default:
                throw new Error(`不支持的提供商 ${provider}`);
        }
        
        return summary;
    } catch (error) {
        console.error("文章摘要生成错误:", error);
        throw error;
    }
});

// AI批量总结
ipcMain.handle("batch-summarize-articles", async (event, { articles, provider, model, length }) => {
    try {
        // 获取API设置，如果未提供参数
        if (!provider || !model || !length) {
            const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
            provider = provider || apiSettings.activeProvider;
            model = model || apiSettings.providers[provider].model;
            length = length || apiSettings.summaryLength;
        }
        
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        const apiKey = apiSettings.providers[provider].apiKey;
        
        if (!apiKey) {
            throw new Error(`未配置${provider}的API密钥`);
        }
        
        const results = [];
        
        // 根据长度定义提示词
        let promptLength;
        switch (length) {
            case "short":
                promptLength = "2-3句话";
                break;
            case "long":
                promptLength = "6-8句话";
                break;
            case "medium":
            default:
                promptLength = "4-5句话";
                break;
        }
        
        for (const article of articles) {
            try {
                const prompt = `用${promptLength}总结以下文章。请专注于主要观点和核心见解：\n\n${article.content}`;
                
                // 根据提供商选择相应的API调用方法
                let summary;
                switch (provider) {
                    case "openai":
                        summary = await callOpenAI(apiKey, model, prompt);
                        break;
                    case "deepseek":
                        summary = await callDeepSeek(apiKey, model, prompt);
                        break;
                    case "anthropic":
                        summary = await callAnthropic(apiKey, model, prompt);
                        break;
                    default:
                        throw new Error(`不支持的提供商 ${provider}`);
                }
                
                results.push({
                    id: article.id,
                    title: article.title,
                    summary
                });
            } catch (error) {
                console.error(`总结文章"${article.title}"时出错:`, error);
                results.push({
                    id: article.id,
                    title: article.title,
                    summary: null,
                    error: error.message
                });
            }
        }
        
        return results;
    } catch (error) {
        console.error("批量总结文章错误:", error);
        throw error;
    }
});

// 手动总结单篇文章并更新缓存
ipcMain.handle("summarize-and-update-article", async (event, { url, articleIndex, articleContent }) => {
    try {
        const hash = crypto.createHash("md5").update(url).digest("hex");
        const cachePath = path.join(CACHE_DIR, `${hash}.json`);
        
        if (!fs.existsSync(cachePath)) {
            throw new Error("找不到RSS源缓存");
        }
        
        // 读取缓存
        const rawData = fs.readFileSync(cachePath, "utf-8");
        const cachedData = JSON.parse(rawData);
        const feed = cachedData.feed;
        
        if (!feed || !feed.items || articleIndex >= feed.items.length) {
            throw new Error("文章索引无效或缓存数据损坏");
        }
        
        // 获取API设置
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        const provider = apiSettings.activeProvider;
        const model = apiSettings.providers[provider].model;
        const length = apiSettings.summaryLength;
        const apiKey = apiSettings.providers[provider].apiKey;
        
        if (!apiKey) {
            throw new Error(`未配置${provider}的API密钥`);
        }
        
        // 根据长度定义提示词
        let promptLength;
        switch (length) {
            case "short":
                promptLength = "2-3句话";
                break;
            case "long":
                promptLength = "6-8句话";
                break;
            case "medium":
            default:
                promptLength = "4-5句话";
                break;
        }
        
        const prompt = `用${promptLength}总结以下文章。请专注于主要观点和核心见解：\n\n${articleContent}`;
        
        // 根据提供商选择相应的API调用方法
        let summary;
        switch (provider) {
            case "openai":
                summary = await callOpenAI(apiKey, model, prompt);
                break;
            case "deepseek":
                summary = await callDeepSeek(apiKey, model, prompt);
                break;
            case "anthropic":
                summary = await callAnthropic(apiKey, model, prompt);
                break;
            default:
                throw new Error(`不支持的提供商 ${provider}`);
        }
        
        // 更新缓存中的摘要
        feed.items[articleIndex].summary = summary;
        
        // 保存回缓存
        cachedData.feed = feed;
        fs.writeFileSync(cachePath, JSON.stringify(cachedData), "utf-8");
        
        return summary;
    } catch (error) {
        console.error("总结并更新文章失败:", error);
        throw error;
    }
});

// API提供商实现
async function callOpenAI(apiKey, model, prompt) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: {
                model: model,
                messages: [
                    { role: "system", content: "你是一个有用的助手，能够简洁准确地总结文章。" },
                    { role: "user", content: prompt }
                ],
                max_tokens: 500,
                temperature: 0.3
            }
        });
        
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error("OpenAI API错误:", error.response?.data || error.message);
        throw new Error(`OpenAI API错误: ${error.response?.data?.error?.message || error.message}`);
    }
}

async function callDeepSeek(apiKey, model, prompt) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.deepseek.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: {
                model: model,
                messages: [
                    { role: "system", content: "你是一个有用的助手，能够简洁准确地总结文章。" },
                    { role: "user", content: prompt }
                ],
                max_tokens: 500,
                temperature: 0.3
            }
        });
        
        return response.data.choices[0].message.content.trim();
    } catch (error) {
        console.error("DeepSeek API错误:", error.response?.data || error.message);
        throw new Error(`DeepSeek API错误: ${error.response?.data?.error?.message || error.message}`);
    }
}

async function callAnthropic(apiKey, model, prompt) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.anthropic.com/v1/messages',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            data: {
                model: model,
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 500,
                temperature: 0.3
            }
        });
        
        return response.data.content[0].text.trim();
    } catch (error) {
        console.error("Anthropic API错误:", error.response?.data || error.message);
        throw new Error(`Anthropic API错误: ${error.response?.data?.error?.message || error.message}`);
    }
}

// 辅助函数：检查所有条目是否都有AI摘要
function allItemsHaveSummary(feedItems = []) {
    return feedItems.every(
        (item) => item.summary && item.summary.trim().length > 0
    );
}

// 获取系统语言并映射到我们支持的语言
function getSystemLanguage() {
    const locale = app.getLocale();
    
    // 只支持中文和英文，其他语言默认为英文
    if (locale.startsWith('zh')) {
        return 'zh-CN';
    } else {
        return 'en-US';
    }
}

// 创建窗口
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
        frame: true, // 保留窗口框架，使窗口可以拖动
        transparent: false,
        backgroundColor: '#f8f9fa'
    });

    win.loadFile(path.join(__dirname, "index.html"));
    
    // 打开开发者工具
    win.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });

    // 注册IPC处理程序
    
    // 获取系统语言
    ipcMain.handle("get-system-language", () => {
        return getSystemLanguage();
    });
    
    // 其他已有的IPC处理程序...
    // ... existing code ...
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// 渲染进程的日志
ipcMain.on("log-with-level", (_, { level, message }) => {
    console.log(`[Renderer][${level}] ${message}`);
});

// ----------------------------------
//  完全本地化的RSS源管理
// ----------------------------------
ipcMain.handle("get-rss-sources", async () => {
    try {
        console.log("获取RSS源...");
        
        // 如果文件不存在，使用默认RSS源
        if (!fs.existsSync(RSS_SOURCES_FILE)) {
            console.log("RSS源文件不存在，使用默认RSS源");
            if (!fs.existsSync(path.dirname(RSS_SOURCES_FILE))) {
                fs.mkdirSync(path.dirname(RSS_SOURCES_FILE), { recursive: true });
            }
            fs.writeFileSync(
                RSS_SOURCES_FILE,
                JSON.stringify(DEFAULT_RSS_SOURCES, null, 2),
                "utf-8"
            );
            return DEFAULT_RSS_SOURCES;
        }
        
        const data = fs.readFileSync(RSS_SOURCES_FILE, "utf-8");
        console.log("成功读取RSS源文件");
        const sources = JSON.parse(data);
        
        // 如果源为空，返回默认源
        if (!sources || sources.length === 0) {
            console.log("RSS源为空，使用默认RSS源");
            fs.writeFileSync(
                RSS_SOURCES_FILE,
                JSON.stringify(DEFAULT_RSS_SOURCES, null, 2),
                "utf-8"
            );
            return DEFAULT_RSS_SOURCES;
        }
        
        return sources;
    } catch (error) {
        console.error("读取RSS源文件失败，使用默认值:", error);
        return DEFAULT_RSS_SOURCES;
    }
});

ipcMain.handle("save-rss-sources", async (event, sources) => {
    try {
        console.log(`保存${sources.length}个RSS源`);
        // 确保目录存在
        if (!fs.existsSync(path.dirname(RSS_SOURCES_FILE))) {
            fs.mkdirSync(path.dirname(RSS_SOURCES_FILE), { recursive: true });
        }
        
        fs.writeFileSync(
            RSS_SOURCES_FILE,
            JSON.stringify(sources, null, 2),
            "utf-8"
        );
        console.log("成功保存RSS源文件");
        return true;
    } catch (error) {
        console.error("保存RSS源文件失败:", error);
        return false;
    }
});

// ---------------------------------
//   完全本地化的RSS抓取
// ---------------------------------
ipcMain.handle("fetch-rss", async (_, url) => {
    console.log("开始本地获取RSS源:", url);
    
    const hash = crypto.createHash("md5").update(url).digest("hex");
    const cachePath = path.join(CACHE_DIR, `${hash}.json`);

    let cachedData = null;

    // 尝试从本地缓存读取
    if (fs.existsSync(cachePath)) {
        try {
            const rawData = fs.readFileSync(cachePath, "utf-8");
            cachedData = JSON.parse(rawData);

            const isNotExpired =
                Date.now() - cachedData.lastFetched < CACHE_DURATION;

            if (isNotExpired) {
                console.log("返回缓存的RSS源:", url);
                return cachedData.feed; // 从本地缓存提供
            } else {
                console.log("缓存已过期，重新获取RSS源");
            }
        } catch (error) {
            console.error("读取缓存文件错误:", error);
        }
    }

    // 本地解析RSS
    try {
        console.log("本地解析RSS源:", url);
        const feed = await rssParser.parseURL(url);
        
        // 转换为我们的格式
        const processedFeed = {
            title: feed.title || "未命名订阅",
            description: feed.description || "",
            link: feed.link || url,
            items: feed.items.map(item => {
                // 确保选择最好的内容来源
                let content = '';
                
                // 按优先级尝试不同内容来源
                if (item.contentEncoded && item.contentEncoded.trim()) {
                    content = item.contentEncoded;
                } else if (item.content && item.content.trim()) {
                    content = item.content;
                } else if (item['content:encoded'] && item['content:encoded'].trim()) {
                    content = item['content:encoded'];
                } else if (item.description && item.description.trim()) {
                    content = item.description;
                } else {
                    content = '暂无内容';
                }
                
                // 处理媒体内容
                if (!content.includes('<img') && item.media && item.media.length > 0) {
                    const mediaTag = item.media.map(media => {
                        if (media.$ && media.$.url) {
                            return `<img src="${media.$.url}" alt="Media content" />`;
                        }
                        return '';
                    }).join('');
                    
                    if (mediaTag) {
                        content = mediaTag + content;
                    }
                }
                
                // 处理缩略图
                if (!content.includes('<img') && item.thumbnail && item.thumbnail.$ && item.thumbnail.$.url) {
                    content = `<img src="${item.thumbnail.$.url}" alt="Thumbnail" />` + content;
                }
                
                return {
                    title: item.title || "未命名文章",
                    link: item.link || "",
                    pubDate: item.pubDate || item.isoDate || new Date().toISOString(),
                    creator: item.creator || item.author || "",
                    content: content,
                    summary: item.summary || ''
                };
            })
        };
        
        // 获取设置，检查是否自动总结
        let settings = DEFAULT_SETTINGS;
        try {
            settings = JSON.parse(fs.readFileSync(SETTINGS_FILE, "utf-8"));
        } catch (settingErr) {
            console.error("读取设置失败，使用默认值", settingErr);
        }
        
        // 如果启用了自动摘要，处理文章
        if (settings.autoSummarize) {
            console.log("自动总结已启用，开始处理文章");
            try {
                await processFeedWithAI(processedFeed);
            } catch (aiError) {
                console.error("AI处理文章失败:", aiError);
            }
        }
        
        // 保存到缓存
        const dataToCache = {
            lastFetched: Date.now(),
            feed: processedFeed,
        };
        
        try {
            // 确保缓存目录存在
            if (!fs.existsSync(CACHE_DIR)) {
                fs.mkdirSync(CACHE_DIR, { recursive: true });
            }
            
            fs.writeFileSync(cachePath, JSON.stringify(dataToCache), "utf-8");
            console.log("已缓存RSS源:", url);
        } catch (cacheError) {
            console.error("缓存RSS源失败:", cacheError);
        }
        
        return processedFeed;
    } catch (error) {
        console.error("本地RSS解析失败:", error);
        
        // 如果有旧的缓存数据，作为最后的选择使用
        if (cachedData) {
            console.log("使用过期的缓存数据作为备选");
            return cachedData.feed;
        }
        
        // 没有备选方案，抛出错误
        throw error;
    }
});

// 辅助函数：使用AI处理feed
async function processFeedWithAI(feed) {
    // 获取API设置
    try {
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        const provider = apiSettings.activeProvider;
        const model = apiSettings.providers[provider].model;
        const length = apiSettings.summaryLength;
        const apiKey = apiSettings.providers[provider].apiKey;

        // 为尚未有摘要的文章生成摘要
        if (apiKey && feed.items && feed.items.length > 0) {
            const articlesToSummarize = feed.items.filter(item => !item.summary || item.summary.trim().length === 0);
            
            if (articlesToSummarize.length > 0) {
                console.log(`为${articlesToSummarize.length}篇文章生成摘要...`);
                
                // 根据长度定义提示词
                let promptLength;
                switch (length) {
                    case "short":
                        promptLength = "2-3句话";
                        break;
                    case "long":
                        promptLength = "6-8句话";
                        break;
                    case "medium":
                    default:
                        promptLength = "4-5句话";
                        break;
                }
                
                for (let i = 0; i < articlesToSummarize.length; i++) {
                    const item = articlesToSummarize[i];
                    try {
                        // 在原始feed中找到对应的条目
                        const feedItem = feed.items.find(fi => fi.link === item.link);
                        if (feedItem) {
                            const prompt = `用${promptLength}总结以下文章。请专注于主要观点和核心见解：\n\n${item.content}`;
                            
                            // 根据提供商选择相应的API调用方法
                            let summary;
                            switch (provider) {
                                case "openai":
                                    summary = await callOpenAI(apiKey, model, prompt);
                                    break;
                                case "deepseek":
                                    summary = await callDeepSeek(apiKey, model, prompt);
                                    break;
                                case "anthropic":
                                    summary = await callAnthropic(apiKey, model, prompt);
                                    break;
                                default:
                                    throw new Error(`不支持的提供商 ${provider}`);
                            }
                            
                            feedItem.summary = summary;
                            console.log(`已为"${item.title}"生成摘要`);
                        }
                    } catch (error) {
                        console.error(`为"${item.title}"生成摘要时出错:`, error);
                    }
                }
            }
        } else {
            console.log("未配置API密钥或无文章需要总结");
        }
    } catch (error) {
        console.error("处理Feed和AI时出错:", error);
    }
    
    return feed;
}

// 添加一个新的IPC处理器用于流式AI调用
ipcMain.handle("summarize-article-stream", async (event, { text, provider, model, length, targetLanguage }) => {
    try {
        // 获取API设置
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        
        // 如果未提供参数，使用默认设置
        provider = provider || apiSettings.activeProvider;
        model = model || apiSettings.providers[provider].model;
        length = length || apiSettings.summaryLength;
        
        const apiKey = apiSettings.providers[provider].apiKey;
        if (!apiKey) {
            throw new Error(`未配置${provider}的API密钥`);
        }
        
        // 根据长度定义提示词
        let promptLength;
        switch (length) {
            case "short":
                promptLength = "2-3句话";
                break;
            case "long":
                promptLength = "6-8句话";
                break;
            case "medium":
            default:
                promptLength = "4-5句话";
                break;
        }
        
        // 添加语言选项
        let languageRequest = "";
        if (targetLanguage) {
            languageRequest = `请用${targetLanguage}语言回答。`;
        }
        
        const prompt = `用${promptLength}总结以下文章。请专注于主要观点和核心见解：\n\n${text}\n\n${languageRequest}`;
        
        // 使用流式API调用
        switch (provider) {
            case "openai":
                await streamOpenAI(event, apiKey, model, prompt);
                break;
            case "deepseek":
                await streamDeepSeek(event, apiKey, model, prompt);
                break;
            case "anthropic":
                await streamAnthropic(event, apiKey, model, prompt);
                break;
            default:
                throw new Error(`不支持的提供商 ${provider}`);
        }
        
        // 发送完成信号
        event.sender.send('summarize-stream-end');
        return true;
    } catch (error) {
        console.error("流式生成摘要错误:", error);
        event.sender.send('summarize-stream-error', error.message);
        throw error;
    }
});

// 流式调用OpenAI API
async function streamOpenAI(event, apiKey, model, prompt) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.openai.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: {
                model: model,
                messages: [
                    { role: "system", content: "你是一个有用的助手，能够简洁准确地总结文章。" },
                    { role: "user", content: prompt }
                ],
                max_tokens: 500,
                temperature: 0.3,
                stream: true  // 启用流式输出
            },
            responseType: 'stream'
        });
        
        response.data.on('data', (chunk) => {
            try {
                const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
                for (const line of lines) {
                    if (line.includes('[DONE]')) continue;
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.substring(6));
                        if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                            // 发送部分文本给渲染进程
                            event.sender.send('summarize-stream-chunk', data.choices[0].delta.content);
                        }
                    }
                }
            } catch (err) {
                console.error("解析流式响应出错:", err);
            }
        });
        
        return new Promise((resolve, reject) => {
            response.data.on('end', resolve);
            response.data.on('error', reject);
        });
    } catch (error) {
        console.error("OpenAI流式API错误:", error);
        throw error;
    }
}

// 流式调用DeepSeek API
async function streamDeepSeek(event, apiKey, model, prompt) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.deepseek.com/v1/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: {
                model: model,
                messages: [
                    { role: "system", content: "你是一个有用的助手，能够简洁准确地总结文章。" },
                    { role: "user", content: prompt }
                ],
                max_tokens: 500,
                temperature: 0.3,
                stream: true
            },
            responseType: 'stream'
        });
        
        response.data.on('data', (chunk) => {
            try {
                const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
                for (const line of lines) {
                    if (line.includes('[DONE]')) continue;
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.substring(6));
                        if (data.choices && data.choices[0].delta && data.choices[0].delta.content) {
                            event.sender.send('summarize-stream-chunk', data.choices[0].delta.content);
                        }
                    }
                }
            } catch (err) {
                console.error("解析流式响应出错:", err);
            }
        });
        
        return new Promise((resolve, reject) => {
            response.data.on('end', resolve);
            response.data.on('error', reject);
        });
    } catch (error) {
        console.error("DeepSeek流式API错误:", error);
        throw error;
    }
}

// 流式调用Anthropic API
async function streamAnthropic(event, apiKey, model, prompt) {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://api.anthropic.com/v1/messages',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            data: {
                model: model,
                messages: [
                    { role: "user", content: prompt }
                ],
                max_tokens: 500,
                temperature: 0.3,
                stream: true
            },
            responseType: 'stream'
        });
        
        response.data.on('data', (chunk) => {
            try {
                const lines = chunk.toString().split('\n').filter(line => line.trim() !== '');
                for (const line of lines) {
                    if (line.includes('[DONE]')) continue;
                    if (line.startsWith('data: ')) {
                        const data = JSON.parse(line.substring(6));
                        if (data.type === 'content_block_delta' && data.delta && data.delta.text) {
                            event.sender.send('summarize-stream-chunk', data.delta.text);
                        }
                    }
                }
            } catch (err) {
                console.error("解析流式响应出错:", err);
            }
        });
        
        return new Promise((resolve, reject) => {
            response.data.on('end', resolve);
            response.data.on('error', reject);
        });
    } catch (error) {
        console.error("Anthropic流式API错误:", error);
        throw error;
    }
}
