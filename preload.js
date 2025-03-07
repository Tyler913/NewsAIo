const { contextBridge, ipcRenderer } = require("electron");

// 将指定的API暴露给渲染进程
contextBridge.exposeInMainWorld("electronAPI", {
    // 基本RSS功能 - 必需
    getRssSources: () => ipcRenderer.invoke("get-rss-sources"),
    saveRssSources: (sources) => ipcRenderer.invoke("save-rss-sources", sources),
    fetchRss: (url) => ipcRenderer.invoke("fetch-rss", url),
    addRssSource: (url) => ipcRenderer.invoke("add-rss-source", url),
    
    // 系统语言检测
    getSystemLanguage: () => ipcRenderer.invoke("get-system-language"),
    
    // 打开外部链接
    openExternal: (url) => ipcRenderer.invoke("open-external", url),
    
    // 设置相关
    getSettings: () => ipcRenderer.invoke("get-settings"),
    saveSettings: (settings) => ipcRenderer.invoke("save-settings", settings),
    getApiSettings: () => ipcRenderer.invoke("get-api-settings"),
    saveApiSettings: (settings) => ipcRenderer.invoke("save-api-settings", settings),
    
    // AI摘要相关 - 修正为对象参数
    summarizeAndUpdateArticle: (params) => 
        ipcRenderer.invoke("summarize-and-update-article", params),
    
    summarizeArticle: (params) => 
        ipcRenderer.invoke("summarize-article", params),
        
    batchSummarizeArticles: (params) => 
        ipcRenderer.invoke("batch-summarize-articles", params),
        
    // 流式处理相关 - 修正为对象参数
    summarizeArticleStream: (params) => 
        ipcRenderer.invoke("summarize-article-stream", params),
        
    onSummarizeStreamChunk: (callback) => 
        ipcRenderer.on("summarize-stream-chunk", (_, chunk) => callback(chunk)),
        
    onSummarizeStreamEnd: (callback) => 
        ipcRenderer.on("summarize-stream-end", () => callback()),
        
    onSummarizeStreamError: (callback) => 
        ipcRenderer.on("summarize-stream-error", (_, error) => callback(error)),
        
    removeAllListeners: (channel) => {
        if (channel) {
            ipcRenderer.removeAllListeners(channel);
        } else {
            // 移除所有流相关的监听器
            ipcRenderer.removeAllListeners("summarize-stream-chunk");
            ipcRenderer.removeAllListeners("summarize-stream-end");
            ipcRenderer.removeAllListeners("summarize-stream-error");
        }
    }
});
