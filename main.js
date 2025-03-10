const { ipcMain, app, nativeTheme, BrowserWindow } = require("electron");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const axios = require("axios");
const RssParser = require('rss-parser');
const { OpenAI } = require("openai");
const Anthropic = require("@anthropic-ai/sdk");

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
        console.log("加载的API设置:", JSON.stringify(apiSettings, null, 2));
        
        // 如果未提供参数，使用默认设置
        provider = provider || apiSettings.activeApi;
        console.log("使用的API提供商:", provider);
        
        if (!apiSettings[provider]) {
            console.error(`未找到${provider}的配置`);
            throw new Error(`未找到${provider}的配置`);
        }
        
        // 使用自定义模型（如果有）或默认模型
        const customModel = apiSettings[provider].customModel;
        const defaultModel = apiSettings[provider].model;
        model = model || customModel || defaultModel;
        console.log(`使用的模型: ${model} (${customModel ? '自定义模型' : '默认模型'})`);
        
        // 检查是否使用自定义接入点
        const useCustomEndpoint = apiSettings[provider].useCustomEndpoint;
        const endpoint = apiSettings[provider].endpoint;
        if (useCustomEndpoint && endpoint) {
            console.log(`使用自定义接入点: ${endpoint}`);
        } else {
            console.log("使用默认接入点");
        }
        
        length = length || apiSettings.summaryLength || "medium";
        
        const apiKey = apiSettings[provider].apiKey;
        if (!apiKey) {
            console.error(`未配置${provider}的API密钥`);
            throw new Error(`未配置${provider}的API密钥`);
        } else {
            console.log(`已配置${provider}的API密钥: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);
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
        console.log(`开始调用${provider} API生成摘要...`);
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
        // 获取API设置
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        console.log("批量摘要 - 加载的API设置:", JSON.stringify(apiSettings, null, 2));
        
        // 如果未提供参数，使用默认设置
        provider = provider || apiSettings.activeApi;
        console.log("批量摘要 - 使用的API提供商:", provider);
        
        if (!apiSettings[provider]) {
            console.error(`批量摘要 - 未找到${provider}的配置`);
            throw new Error(`未找到${provider}的配置`);
        }
        
        // 使用自定义模型（如果有）或默认模型
        const customModel = apiSettings[provider].customModel;
        const defaultModel = apiSettings[provider].model;
        model = model || customModel || defaultModel;
        console.log(`批量摘要 - 使用的模型: ${model} (${customModel ? '自定义模型' : '默认模型'})`);
        
        // 检查是否使用自定义接入点
        const useCustomEndpoint = apiSettings[provider].useCustomEndpoint;
        const endpoint = apiSettings[provider].endpoint;
        if (useCustomEndpoint && endpoint) {
            console.log(`批量摘要 - 使用自定义接入点: ${endpoint}`);
        } else {
            console.log("批量摘要 - 使用默认接入点");
        }
        
        length = length || apiSettings.summaryLength || "medium";
        
        const apiKey = apiSettings[provider].apiKey;
        if (!apiKey) {
            console.error(`批量摘要 - 未配置${provider}的API密钥`);
            throw new Error(`未配置${provider}的API密钥`);
        } else {
            console.log(`批量摘要 - 已配置${provider}的API密钥: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);
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

// 同时摘要并更新文章 - 修改为解构参数
ipcMain.handle("summarize-and-update-article", async (event, params) => {
    try {
        // 检查参数格式
        if (!params) {
            console.error("未提供参数对象");
            throw new Error("缺少参数对象");
        }
        
        // 解构参数
        const { url, articleIndex, articleContent } = params;
        
        // 检查必要参数
        if (!url || articleIndex === undefined) {
            console.error("缺少必要参数", { url, articleIndex });
            throw new Error("缺少必要参数：URL或文章索引");
        }
        
        console.log("摘要更新请求参数:", { 
            url, 
            articleIndex, 
            contentLength: articleContent ? articleContent.length : 0 
        });
        
        // 从RSS缓存中获取Feed数据
        let feed;
        let cacheData;
        let originalStructure;
        
        try {
            const cacheFilePath = path.join(CACHE_DIR, `${crypto.createHash('md5').update(url).digest('hex')}.json`);
            console.log("尝试读取缓存文件:", cacheFilePath);
            
            if (!fs.existsSync(cacheFilePath)) {
                console.error("缓存文件不存在:", cacheFilePath);
                throw new Error("找不到RSS源缓存文件");
            }
            
            cacheData = fs.readFileSync(cacheFilePath, "utf-8");
            const parsedData = JSON.parse(cacheData);
            originalStructure = parsedData;
            
            // 确定数据结构 - 有些缓存是 {feed: {...}} 格式，有些直接是 feed 对象
            if (parsedData.feed) {
                feed = parsedData.feed;
                console.log("缓存使用嵌套结构 {feed: {...}}");
            } else {
                feed = parsedData;
                console.log("缓存使用直接结构");
            }
            
            console.log("成功读取缓存数据, 文章数量:", feed.items ? feed.items.length : 0);
        } catch (error) {
            console.error("读取RSS缓存失败:", error);
            throw new Error(`无法读取RSS缓存: ${error.message}`);
        }
        
        // 检查文章索引是否有效
        if (!feed.items || articleIndex >= feed.items.length) {
            console.error("无效的文章索引:", articleIndex, "文章总数:", feed.items ? feed.items.length : 0);
            throw new Error("无效的文章索引");
        }
        
        // 如果是保存现有摘要，直接更新不调用API
        if (articleContent) {
            console.log("直接更新现有摘要，跳过API调用");
            feed.items[articleIndex].summary = articleContent;
            
            // 保存回缓存
            try {
                const cacheFilePath = path.join(CACHE_DIR, `${crypto.createHash('md5').update(url).digest('hex')}.json`);
                
                // 确保保持原有的数据结构
                let dataToSave;
                if (originalStructure && originalStructure.feed) {
                    dataToSave = { 
                        ...originalStructure, 
                        feed: feed 
                    };
                } else {
                    dataToSave = feed;
                }
                
                fs.writeFileSync(cacheFilePath, JSON.stringify(dataToSave), "utf-8");
                console.log("已更新摘要到缓存文件");
                return articleContent; // 直接返回输入的摘要
            } catch (error) {
                console.error("保存缓存失败:", error);
                throw new Error(`无法保存缓存: ${error.message}`);
            }
        }
        
        // 获取API设置
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        console.log("加载的API设置:", JSON.stringify(apiSettings, null, 2));
        
        // 使用activeApi字段选择提供商
        const provider = apiSettings.activeApi;
        console.log("使用的API提供商:", provider);
        
        if (!apiSettings[provider]) {
            throw new Error(`未找到${provider}的配置`);
        }
        
        // 获取API密钥
        const apiKey = apiSettings[provider].apiKey;
        if (!apiKey) {
            throw new Error(`未配置${provider}的API密钥`);
        } else {
            console.log(`已配置${provider}的API密钥: ${apiKey.substring(0, 3)}...${apiKey.substring(apiKey.length - 3)}`);
        }
        
        // 使用自定义模型（如果有）或默认模型
        const customModel = apiSettings[provider].customModel;
        const defaultModel = apiSettings[provider].model;
        const model = customModel || defaultModel;
        console.log(`使用的模型: ${model} ${customModel ? '(自定义模型)' : ''}`);
        
        // 检查是否使用自定义接入点
        const useCustomEndpoint = apiSettings[provider].useCustomEndpoint;
        const endpoint = apiSettings[provider].endpoint;
        if (useCustomEndpoint && endpoint) {
            console.log(`使用自定义接入点: ${endpoint}`);
        }
        
        // 根据长度定义提示词
        let promptLength;
        const length = apiSettings.summaryLength || "medium";
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
        console.log(`开始调用${provider} API生成摘要...`);
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
        
        console.log("API返回摘要内容:", summary);
        console.log("摘要内容长度:", summary?.length || 0);
        
        // 更新缓存中的摘要
        feed.items[articleIndex].summary = summary;
        
        // 保存回缓存
        try {
            const cacheFilePath = path.join(CACHE_DIR, `${crypto.createHash('md5').update(url).digest('hex')}.json`);
            fs.writeFileSync(cacheFilePath, JSON.stringify(feed), "utf-8");
            console.log("已更新摘要到缓存文件");
        } catch (error) {
            console.error("保存缓存失败:", error);
            throw new Error(`无法保存缓存: ${error.message}`);
        }
        
        // 返回更新后的摘要给渲染进程
        console.log("成功生成并保存摘要，返回给渲染进程");
        return summary;
    } catch (error) {
        console.error("总结并更新文章失败:", error);
        throw error;
    }
});

// API提供商实现
async function callOpenAI(apiKey, model, prompt) {
    try {
        // 从API设置中获取自定义值
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        const useCustomEndpoint = apiSettings.openai?.useCustomEndpoint || false;
        const customEndpoint = apiSettings.openai?.endpoint || '';
        const customModel = apiSettings.openai?.customModel || '';
        
        // 使用自定义模型（如果有）
        const modelToUse = customModel || model;
        
        // 使用自定义接入点或默认接入点
        const apiEndpoint = useCustomEndpoint && customEndpoint 
            ? customEndpoint 
            : 'https://api.openai.com';
            
        console.log(`非流式API接入点原始URL: ${apiEndpoint}`);
        
        // 确保URL格式正确
        let baseURL = apiEndpoint;
        
        // 如果URL不包含协议，添加https://
        if (!baseURL.startsWith('http://') && !baseURL.startsWith('https://')) {
            baseURL = 'https://' + baseURL;
            console.log(`添加https协议: ${baseURL}`);
        }
        
        // 确保不以/v1结尾
        if (baseURL.endsWith('/v1')) {
            baseURL = baseURL.slice(0, -3);
            console.log(`删除尾部/v1: ${baseURL}`);
        }
        
        // 去除尾部斜杠
        if (baseURL.endsWith('/')) {
            baseURL = baseURL.slice(0, -1);
            console.log(`删除尾部斜杠: ${baseURL}`);
        }
        
        console.log(`处理后的基础URL: ${baseURL}`);
        
        // 检查是否需要添加 /v1 路径
        // 对于自定义接入点，我们不自动添加 /v1，而是依赖用户提供完整的正确路径
        let apiPath = '';
        if (!useCustomEndpoint) {
            apiPath = '/v1'; // 只有官方API才自动添加/v1路径
        }
        
        console.log(`使用模型: ${modelToUse}`);
        console.log(`使用的API路径: ${baseURL}${apiPath}`);
        
        try {
            // 创建OpenAI客户端
            const client = new OpenAI({
                apiKey: apiKey,
                baseURL: baseURL + apiPath,
                timeout: 30000
            });
            
            console.log("创建OpenAI非流式请求...");
            
            const response = await client.chat.completions.create({
                model: modelToUse,
                messages: [
                    { role: "system", content: "你是一个AI助手，请简明扼要地总结文章要点，不要添加额外解释。" },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 1000,
            });
            
            console.log("收到OpenAI响应");
            
            if (response.choices && response.choices.length > 0) {
                const content = response.choices[0].message.content.trim();
                console.log("返回的摘要内容:", content.substring(0, 100) + "...");
                return content;
            } else {
                console.error("无法从OpenAI响应中提取内容:", JSON.stringify(response));
                throw new Error("API响应格式不符合预期，无法提取内容");
            }
        } catch (apiError) {
            console.error("OpenAI API调用错误:", apiError);
            
            // 检查是否是网络错误
            if (apiError.code === 'ENOTFOUND' || apiError.code === 'ECONNREFUSED') {
                throw new Error(`无法连接到API服务器 ${baseURL}: ${apiError.message}`);
            }
            
            // 检查是否是验证错误
            if (apiError.status === 401) {
                throw new Error("API密钥无效");
            }
            
            // 检查是否是URL错误
            if (apiError.status === 404) {
                throw new Error(`API接入点URL无效: ${baseURL}`);
            }
            
            throw new Error(`OpenAI API调用错误: ${apiError.message}`);
        }
    } catch (error) {
        console.error("OpenAI API调用失败:", error);
        throw new Error(`OpenAI API调用失败: ${error.message}`);
    }
}

async function callDeepSeek(apiKey, model, prompt) {
    try {
        // 从API设置中获取自定义值
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        const useCustomEndpoint = apiSettings.deepseek?.useCustomEndpoint || false;
        const customEndpoint = apiSettings.deepseek?.endpoint || '';
        const customModel = apiSettings.deepseek?.customModel || '';
        
        // 使用自定义模型（如果有）
        const modelToUse = customModel || model;
        
        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
        
        const apiUrl = useCustomEndpoint && customEndpoint 
            ? customEndpoint 
            : 'https://api.deepseek.com/v1/chat/completions';
        
        console.log(`DeepSeek流式API接入点: ${apiUrl}`);
        console.log(`DeepSeek流式API使用模型: ${modelToUse}`);
        
        const response = await axios.post(
            apiUrl,
            {
                model: modelToUse,
                messages: [
                    { role: "system", content: "你是一个AI助手，请简明扼要地总结文章要点，不要添加额外解释。" },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 1000,
                stream: true
            },
            { 
                headers,
                responseType: 'stream'
            }
        );
        
        console.log("收到DeepSeek流式响应，开始处理...");
        
        // 创建最终的Promise，处理完整的流式响应
        return new Promise((resolve, reject) => {
            let content = '';
            let buffer = '';
            
            response.data.on('data', (chunk) => {
                try {
                    const chunkText = chunk.toString();
                    buffer += chunkText;
                    
                    // 按行分割，处理每行数据
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // 保留可能不完整的最后一行
                    
                    for (const line of lines) {
                        // 忽略空行
                        if (!line.trim()) continue;
                        
                        // 处理数据行
                        if (line.startsWith('data:')) {
                            const data = line.slice(5).trim();
                            
                            // 处理结束标记
                            if (data === '[DONE]') {
                                console.log("DeepSeek流式响应完成");
                                continue;
                            }
                            
                            try {
                                const parsedData = JSON.parse(data);
                                const deltaContent = parsedData.choices?.[0]?.delta?.content || '';
                                
                                if (deltaContent) {
                                    content += deltaContent;
                                    console.log("发送DeepSeek块:", deltaContent.length > 30 ? 
                                        deltaContent.substring(0, 30) + "..." : deltaContent);
                                    
                                    // 发送到渲染进程
                                    event.sender.send('summarize-stream-chunk', deltaContent);
                                }
                            } catch (parseError) {
                                console.error("解析DeepSeek数据错误:", parseError);
                                console.log("问题数据行:", line);
                            }
                        }
                    }
                } catch (error) {
                    console.error("处理DeepSeek流数据出错:", error);
                }
            });
            
            response.data.on('end', () => {
                console.log("DeepSeek流式响应结束");
                resolve(content);
            });
            
            response.data.on('error', (error) => {
                console.error("DeepSeek流式响应错误:", error);
                reject(error);
            });
        });
    } catch (error) {
        console.error("DeepSeek流式输出错误:", error);
        throw new Error(`DeepSeek流式输出错误: ${error.message}`);
    }
}

async function callAnthropic(apiKey, model, prompt) {
    try {
        // 从API设置中获取自定义值
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        const useCustomEndpoint = apiSettings.anthropic?.useCustomEndpoint || false;
        const customEndpoint = apiSettings.anthropic?.endpoint || '';
        const customModel = apiSettings.anthropic?.customModel || '';
        
        // 使用自定义模型（如果有）
        const modelToUse = customModel || model;
        
        const client = new Anthropic({
            apiKey,
            baseURL: useCustomEndpoint && customEndpoint ? customEndpoint : undefined
        });
        
        const stream = await client.messages.create({
            model: modelToUse,
            messages: [
                { role: 'user', content: prompt }
            ],
            max_tokens: 1000,
            stream: true,
            system: "你是一个AI助手，请简明扼要地总结文章要点，不要添加额外解释。"
        });
        
        let content = '';
        for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta') {
                content += chunk.content_block.text;
                // 修改事件名
                event.sender.send('summarize-stream-chunk', chunk.content_block.text);
                console.log("发送anthropic chunk:", chunk.content_block.text.substring(0, 30) + (chunk.content_block.text.length > 30 ? "..." : ""));
            }
        }
        
        return content;
    } catch (error) {
        console.error("Anthropic流式输出错误:", error);
        throw new Error(`Anthropic流式输出错误: ${error.message}`);
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
    // win.webContents.openDevTools();
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
    
    // 打开外部链接
    ipcMain.handle("open-external", async (_, url) => {
        try {
            // 使用Electron shell模块打开外部浏览器
            const { shell } = require('electron');
            await shell.openExternal(url);
            return true;
        } catch (error) {
            console.error("打开外部链接失败:", error);
            return false;
        }
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
        console.log("处理Feed的API设置:", JSON.stringify(apiSettings, null, 2));
        
        // 支持新旧两种API设置结构
        // 新结构: activeApi, provider直接包含配置
        // 旧结构: activeProvider, providers[provider]包含配置
        
        // 确定使用哪个提供商
        const provider = apiSettings.activeApi || apiSettings.activeProvider;
        
        if (!provider) {
            console.log("未配置活跃的API提供商，跳过AI处理");
            return feed;
        }
        
        console.log("使用的API提供商:", provider);
        
        // 确定API配置：优先使用直接配置，然后尝试提供商数组
        let apiConfig = apiSettings[provider]; // 新结构
        if (!apiConfig && apiSettings.providers) {
            apiConfig = apiSettings.providers[provider]; // 旧结构
        }
        
        if (!apiConfig) {
            console.log(`找不到${provider}的API配置，跳过AI处理`);
            return feed;
        }
        
        // 获取API密钥和模型
        const apiKey = apiConfig.apiKey;
        const model = apiConfig.customModel || apiConfig.model;
        
        // 获取摘要长度设置
        const length = apiSettings.summaryLength || "medium";
        
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
        provider = provider || apiSettings.activeApi;
        
        if (!apiSettings[provider]) {
            throw new Error(`未找到${provider}的配置`);
        }
        
        model = model || apiSettings[provider].customModel || apiSettings[provider].model;
        
        const apiKey = apiSettings[provider].apiKey;
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
        // 获取自定义设置
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        const useCustomEndpoint = apiSettings.openai?.useCustomEndpoint || false;
        const customEndpoint = apiSettings.openai?.endpoint || '';
        const customModel = apiSettings.openai?.customModel || '';
        
        // 使用自定义模型（如果有）
        const modelToUse = customModel || model;
        
        // 使用自定义接入点或默认接入点
        const apiEndpoint = useCustomEndpoint && customEndpoint 
            ? customEndpoint 
            : 'https://api.openai.com';
            
        console.log(`流式API接入点原始URL: ${apiEndpoint}`);
        
        // 确保URL格式正确
        let baseURL = apiEndpoint;
        
        // 如果URL不包含协议，添加https://
        if (!baseURL.startsWith('http://') && !baseURL.startsWith('https://')) {
            baseURL = 'https://' + baseURL;
            console.log(`添加https协议: ${baseURL}`);
        }
        
        // 确保不以/v1结尾
        if (baseURL.endsWith('/v1')) {
            baseURL = baseURL.slice(0, -3);
            console.log(`删除尾部/v1: ${baseURL}`);
        }
        
        // 去除尾部斜杠
        if (baseURL.endsWith('/')) {
            baseURL = baseURL.slice(0, -1);
            console.log(`删除尾部斜杠: ${baseURL}`);
        }
        
        console.log(`处理后的基础URL: ${baseURL}`);
        
        // 检查是否需要添加 /v1 路径
        // 对于自定义接入点，我们不自动添加 /v1，而是依赖用户提供完整的正确路径
        let apiPath = '';
        if (!useCustomEndpoint) {
            apiPath = '/v1'; // 只有官方API才自动添加/v1路径
        }
        
        console.log(`使用模型: ${modelToUse}`);
        console.log(`使用的API路径: ${baseURL}${apiPath}`);
        
        try {
            console.log(`正在创建OpenAI客户端，API密钥长度: ${apiKey.length}, baseURL: ${baseURL}${apiPath}`);
            
            // 创建OpenAI客户端
            const client = new OpenAI({
                apiKey: apiKey,
                baseURL: baseURL + apiPath,
                timeout: 30000
            });

            console.log("OpenAI客户端创建成功");
            console.log("创建OpenAI流式请求...");
            
            // 添加更多错误处理和验证
            if (!prompt) {
                throw new Error("提示词为空");
            }
            
            if (!modelToUse) {
                throw new Error("模型名称为空");
            }
            
            const stream = await client.chat.completions.create({
                model: modelToUse,
                messages: [
                    { role: "system", content: "你是一个AI助手，请简明扼要地总结文章要点，不要添加额外解释。" },
                    { role: "user", content: prompt }
                ],
                stream: true,
                temperature: 0.3,
                max_tokens: 1000,
            });

            console.log("收到流式响应，开始处理...");
            let content = '';
            let chunkCount = 0;
            
            console.log("准备进入流式处理循环...");
            try {
                for await (const chunk of stream) {
                    try {
                        chunkCount++;
                        console.log(`处理第 ${chunkCount} 个响应块...`);
                        // 记录原始块数据
                        console.log("原始块数据:", JSON.stringify(chunk));
                        
                        // 添加更详细的日志记录和错误处理
                        if (!chunk.choices || chunk.choices.length === 0) {
                            console.log("收到无效块:", JSON.stringify(chunk));
                            continue;
                        }
                        
                        console.log("块选择项:", JSON.stringify(chunk.choices));
                        console.log("块Delta:", JSON.stringify(chunk.choices[0]?.delta));
                        
                        const partialText = chunk.choices[0]?.delta?.content || "";
                        console.log("提取的部分文本:", partialText);
                        
                        if (partialText) {
                            content += partialText;
                            event.sender.send('summarize-stream-chunk', partialText);
                            console.log("发送chunk:", partialText.length > 20 ? 
                                partialText.substring(0, 20) + "..." : partialText);
                        }
                    } catch (chunkError) {
                        console.error("处理块数据时出错:", chunkError);
                        console.log("问题块数据:", JSON.stringify(chunk));
                    }
                }
            } catch (streamError) {
                console.error("处理流式数据时出错:", streamError);
                // 记录更多有关错误的详细信息
                if (streamError.response) {
                    console.error("API响应状态码:", streamError.response.status);
                    console.error("API响应头部:", JSON.stringify(streamError.response.headers));
                    console.error("API响应数据:", JSON.stringify(streamError.response.data));
                }
                event.sender.send('summarize-stream-error', `流式处理失败: ${streamError.message}`);
                throw new Error(`流式处理错误: ${streamError.message}`);
            }
            
            console.log(`流式处理完成，总共处理了 ${chunkCount} 个响应块`);
            
            // 如果没有收到任何内容，尝试非流式API调用作为备选
            if (chunkCount === 0 || content.trim() === '') {
                console.log("流式API未返回任何内容，可能是自定义接入点不支持流式API，尝试使用非流式API...");
                
                // 更详细的错误信息
                let errorMessage = "自定义接入点可能不支持流式API或当前配置不正确";
                if (useCustomEndpoint) {
                    errorMessage += `。请确认您的自定义接入点 (${baseURL}) 支持流式输出，并确认接入点URL是否正确。`;
                    errorMessage += `如果您的接入点需要特殊路径格式，请在URL中包含完整路径，例如 https://your-api.domain/v1/chat`;
                }
                
                event.sender.send('summarize-stream-error', errorMessage);
                // 这里不直接调用非流式API，而是通知前端进行处理
                throw new Error(errorMessage);
            }
            // 完成流处理后，发送结束信号
            event.sender.send('summarize-stream-end');
            console.log("流式处理完成，已发送结束信号");
            
            return content.trim();
        } catch (apiError) {
            console.error("OpenAI API调用错误:", apiError);
            
            // 检查是否是网络错误
            if (apiError.code === 'ENOTFOUND' || apiError.code === 'ECONNREFUSED') {
                throw new Error(`无法连接到API服务器 ${baseURL}: ${apiError.message}`);
            }
            
            // 检查是否是验证错误
            if (apiError.status === 401) {
                throw new Error("API密钥无效");
            }
            
            // 检查是否是URL错误
            if (apiError.status === 404) {
                throw new Error(`API接入点URL无效: ${baseURL}`);
            }
            
            throw new Error(`OpenAI流式输出错误: ${apiError.message}`);
        }
    } catch (error) {
        console.error("OpenAI流式输出错误:", error);
        // 发送错误给前端
        event.sender.send('summarize-stream-error', error.message);
        throw new Error(`OpenAI流式输出错误: ${error.message}`);
    }
}

// 流式调用DeepSeek API
async function streamDeepSeek(event, apiKey, model, prompt) {
    try {
        // 获取自定义设置
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        const useCustomEndpoint = apiSettings.deepseek?.useCustomEndpoint || false;
        const customEndpoint = apiSettings.deepseek?.endpoint || '';
        const customModel = apiSettings.deepseek?.customModel || '';
        
        // 使用自定义模型（如果有）
        const modelToUse = customModel || model;
        
        const headers = {
            'Authorization': `Bearer ${apiKey}`,
            'Content-Type': 'application/json'
        };
        
        const apiUrl = useCustomEndpoint && customEndpoint 
            ? customEndpoint 
            : 'https://api.deepseek.com/v1/chat/completions';
        
        console.log(`DeepSeek流式API接入点: ${apiUrl}`);
        console.log(`DeepSeek流式API使用模型: ${modelToUse}`);
        
        const response = await axios.post(
            apiUrl,
            {
                model: modelToUse,
                messages: [
                    { role: "system", content: "你是一个AI助手，请简明扼要地总结文章要点，不要添加额外解释。" },
                    { role: "user", content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 1000,
                stream: true
            },
            { 
                headers,
                responseType: 'stream'
            }
        );
        
        console.log("收到DeepSeek流式响应，开始处理...");
        
        // 创建最终的Promise，处理完整的流式响应
        return new Promise((resolve, reject) => {
            let content = '';
            let buffer = '';
            
            response.data.on('data', (chunk) => {
                try {
                    const chunkText = chunk.toString();
                    buffer += chunkText;
                    
                    // 按行分割，处理每行数据
                    const lines = buffer.split('\n');
                    buffer = lines.pop(); // 保留可能不完整的最后一行
                    
                    for (const line of lines) {
                        // 忽略空行
                        if (!line.trim()) continue;
                        
                        // 处理数据行
                        if (line.startsWith('data:')) {
                            const data = line.slice(5).trim();
                            
                            // 处理结束标记
                            if (data === '[DONE]') {
                                console.log("DeepSeek流式响应完成");
                                continue;
                            }
                            
                            try {
                                const parsedData = JSON.parse(data);
                                const deltaContent = parsedData.choices?.[0]?.delta?.content || '';
                                
                                if (deltaContent) {
                                    content += deltaContent;
                                    console.log("发送DeepSeek块:", deltaContent.length > 30 ? 
                                        deltaContent.substring(0, 30) + "..." : deltaContent);
                                    
                                    // 发送到渲染进程
                                    event.sender.send('summarize-stream-chunk', deltaContent);
                                }
                            } catch (parseError) {
                                console.error("解析DeepSeek数据错误:", parseError);
                                console.log("问题数据行:", line);
                            }
                        }
                    }
                } catch (error) {
                    console.error("处理DeepSeek流数据出错:", error);
                }
            });
            
            response.data.on('end', () => {
                console.log("DeepSeek流式响应结束");
                resolve(content);
            });
            
            response.data.on('error', (error) => {
                console.error("DeepSeek流式响应错误:", error);
                reject(error);
            });
        });
    } catch (error) {
        console.error("DeepSeek流式输出错误:", error);
        throw new Error(`DeepSeek流式输出错误: ${error.message}`);
    }
}

// 流式调用Anthropic API
async function streamAnthropic(event, apiKey, model, prompt) {
    try {
        // 获取自定义设置
        const apiSettings = JSON.parse(fs.readFileSync(API_SETTINGS_FILE, "utf-8"));
        const useCustomEndpoint = apiSettings.anthropic?.useCustomEndpoint || false;
        const customEndpoint = apiSettings.anthropic?.endpoint || '';
        const customModel = apiSettings.anthropic?.customModel || '';
        
        // 使用自定义模型（如果有）
        const modelToUse = customModel || model;
        
        const client = new Anthropic({
            apiKey,
            baseURL: useCustomEndpoint && customEndpoint ? customEndpoint : undefined
        });
        
        const stream = await client.messages.create({
            model: modelToUse,
            messages: [
                { role: 'user', content: prompt }
            ],
            max_tokens: 1000,
            stream: true,
            system: "你是一个AI助手，请简明扼要地总结文章要点，不要添加额外解释。"
        });
        
        let content = '';
        for await (const chunk of stream) {
            if (chunk.type === 'content_block_delta') {
                content += chunk.content_block.text;
                // 修改事件名
                event.sender.send('summarize-stream-chunk', chunk.content_block.text);
                console.log("发送anthropic chunk:", chunk.content_block.text.substring(0, 30) + (chunk.content_block.text.length > 30 ? "..." : ""));
            }
        }
        
        return content;
    } catch (error) {
        console.error("Anthropic流式输出错误:", error);
        throw new Error(`Anthropic流式输出错误: ${error.message}`);
    }
}
