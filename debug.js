// RSS阅读器主脚本 - 支持三栏布局
document.addEventListener("DOMContentLoaded", function() {
    console.log("应用初始化...");
    
    // 获取DOM元素
    const rssSourcesList = document.getElementById("rss-sources");
    const sourcesLoader = document.getElementById("rss-sources-loader");
    const articlesContainer = document.getElementById("articles-container");
    const articleContainer = document.getElementById("article-container");
    const articlesHeader = document.getElementById("articles-header");
    const contentHeader = document.getElementById("content-header");
    
    // AI相关元素
    const aiSettingsToggle = document.getElementById("ai-settings-toggle");
    const aiSettingsPanel = document.getElementById("ai-settings-panel");
    const closeSettingsBtn = document.getElementById("close-settings");
    const generateSummaryBtn = document.getElementById("generate-summary-button");
    const autoSummarizeToggle = document.getElementById("auto-summarize");
    const streamModeToggle = document.getElementById("stream-mode");
    const summaryLanguageSelect = document.getElementById("summary-language");
    const summaryLengthSelect = document.getElementById("summary-length");
    const saveApiSettingsBtn = document.getElementById("save-api-settings");
    const languageDropdownLinks = document.querySelectorAll(".dropdown-content a");
    
    // API提供商表单元素
    const apiRadios = document.querySelectorAll('input[name="active-api"]');
    const apiKeyInputs = {
        openai: document.getElementById("openai-api-key"),
        deepseek: document.getElementById("deepseek-api-key"),
        anthropic: document.getElementById("anthropic-api-key")
    };
    const modelSelects = {
        openai: document.getElementById("openai-model"),
        deepseek: document.getElementById("deepseek-model"),
        anthropic: document.getElementById("anthropic-model")
    };
    
    // 添加RSS源相关元素
    const addButton = document.getElementById("add-rss-button");
    const modal = document.getElementById("add-feed-modal");
    const closeButton = document.getElementById("modal-close-button");
    const submitButton = document.getElementById("submit-rss-button");
    const urlInput = document.getElementById("rss-url-input");
    
    // 存储当前状态
    let currentFeeds = [];  // 当前所有RSS源
    let currentArticles = []; // 当前选中的RSS源的所有文章
    let currentFeedUrl = ""; // 当前选中的RSS源URL
    let currentArticleData = null; // 当前显示的文章数据
    
    // 保存用户设置和API设置
    let userSettings = { 
        darkMode: false, 
        autoSummarize: false, 
        useStreamMode: true,
        summaryLanguage: "auto",
        summaryLength: "medium"
    };
    
    let apiSettings = {
        activeProvider: "openai",
        providers: {
            openai: {
                apiKey: "",
                model: "gpt-3.5-turbo"
            },
            deepseek: {
                apiKey: "",
                model: "deepseek-chat"
            },
            anthropic: {
                apiKey: "",
                model: "claude-3-haiku"
            }
        }
    };
    
    // ============= 应用初始化 =============
    
    // 启动时加载设置
    loadSettings();
    loadApiSettings();
    
    // 启动时加载RSS源
    loadRssSources();
    
    // 初始化AI设置面板
    initAISettingsPanel();
    
    // ============= AI设置面板 =============
    
    // 加载设置到界面
    function applySettingsToUI() {
        autoSummarizeToggle.checked = userSettings.autoSummarize;
        streamModeToggle.checked = userSettings.useStreamMode;
        summaryLanguageSelect.value = userSettings.summaryLanguage;
        summaryLengthSelect.value = userSettings.summaryLength;
        
        // API提供商设置
        const activeProvider = apiSettings.activeProvider;
        document.querySelector(`input[name="active-api"][value="${activeProvider}"]`).checked = true;
        
        // 填充API密钥和模型选择
        Object.keys(apiSettings.providers).forEach(provider => {
            apiKeyInputs[provider].value = apiSettings.providers[provider].apiKey;
            modelSelects[provider].value = apiSettings.providers[provider].model;
        });
    }
    
    // ============= 摘要和翻译功能 =============
    
    // 生成摘要
    generateSummaryBtn.addEventListener("click", () => {
        if (!currentArticleData) {
            showNotification("请先选择一篇文章", "error");
            return;
        }
        
        generateSummary(currentArticleData);
    });
    
    // 语言转换
    languageDropdownLinks.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            const targetLanguage = link.getAttribute("data-lang");
            
            if (!currentArticleData) {
                showNotification("请先选择一篇文章", "error");
                return;
            }
            
            translateArticle(currentArticleData, targetLanguage);
        });
    });
    
    // 生成摘要
    async function generateSummary(article) {
        // 检查是否有API密钥
        const provider = apiSettings.activeProvider;
        const apiKey = apiSettings.providers[provider].apiKey;
        
        if (!apiKey) {
            showNotification("请先在AI设置中配置API密钥", "error");
            aiSettingsPanel.classList.add("active");
            return;
        }
        
        // 获取文章内容 - 修复：从article对象直接获取内容
        const content = article.content;
        if (!content || content.trim() === "") {
            showNotification("文章内容为空，无法生成摘要", "error");
            return;
        }
        
        // 检查是否已有摘要
        const existingSummary = document.querySelector(".ai-summary");
        if (existingSummary) {
            existingSummary.remove();
        }
        
        // 创建摘要容器
        const summaryDiv = document.createElement("div");
        summaryDiv.className = "ai-summary";
        summaryDiv.innerHTML = `
            <div class="ai-summary-header">
                <h3 class="ai-summary-title"><i class="fas fa-robot"></i> AI 摘要</h3>
            </div>
            <div class="summary-content">
                <div class="summary-loading">
                    <span class="loading-indicator"></span> 正在生成摘要...
                </div>
                <div class="summary-text"></div>
            </div>
        `;
        
        // 插入到文章内容顶部
        articleContainer.insertBefore(summaryDiv, articleContainer.firstChild);
        
        try {
            // 构建摘要提示词 - 改进：添加更明确的提示词
            const title = article.title || "";
            const promptTemplate = `请根据以下文章生成一个简洁清晰的摘要。摘要应该包含文章的主要观点和关键信息。\n\n标题: ${title}\n\n内容:\n${content}`;
            
            // 根据是否使用流式模式选择不同的处理方法
            if (userSettings.useStreamMode) {
                await handleStreamingSummary(promptTemplate, summaryDiv);
            } else {
                await handleNormalSummary(promptTemplate, summaryDiv);
            }
        } catch (error) {
            console.error("生成摘要失败:", error);
            showNotification("生成摘要失败: " + error.message, "error");
            summaryDiv.querySelector(".summary-loading").remove();
            summaryDiv.querySelector(".summary-text").textContent = "摘要生成失败，请重试或检查API设置";
        }
    }
    
    // 流式生成摘要 - 修改参数格式，并添加加载动画处理
    async function handleStreamingSummary(prompt, summaryDiv) {
        // 获取设置
        const provider = apiSettings.activeProvider;
        const model = apiSettings.providers[provider].model;
        const summaryLength = userSettings.summaryLength;
        const targetLanguage = userSettings.summaryLanguage;
        
        // 获取加载动画和文本容器
        const loadingElement = summaryDiv.querySelector(".summary-loading");
        const summaryText = summaryDiv.querySelector(".summary-text");
        summaryText.classList.add("streaming-content");
        
        // 流式内容存储
        let streamedContent = "";
        let receivedFirstChunk = false;
        
        // 设置事件监听器
        window.electronAPI.onSummarizeStreamChunk((chunk) => {
            // 收到第一个块数据时，移除加载动画
            if (!receivedFirstChunk && chunk) {
                receivedFirstChunk = true;
                if (loadingElement) {
                    loadingElement.style.display = "none";
                }
            }
            
            streamedContent += chunk;
            summaryText.textContent = streamedContent;
        });
        
        window.electronAPI.onSummarizeStreamEnd(() => {
            // 确保加载动画移除
            if (loadingElement) {
                loadingElement.style.display = "none";
            }
            
            // 流式输出完成
            summaryText.classList.remove("streaming-content");
            
            // 清理事件监听器
            window.electronAPI.removeAllListeners("summarize-stream-chunk");
            window.electronAPI.removeAllListeners("summarize-stream-end");
            window.electronAPI.removeAllListeners("summarize-stream-error");
            
            // 保存摘要到文章
            if (currentArticleData) {
                currentArticleData.summary = streamedContent;
                updateArticleSummary(currentFeedUrl, currentArticleData);
            }
            
            showNotification("摘要生成完成");
        });
        
        window.electronAPI.onSummarizeStreamError((error) => {
            console.error("流式摘要生成失败:", error);
            
            // 确保加载动画移除
            if (loadingElement) {
                loadingElement.style.display = "none";
            }
            
            summaryText.textContent = "摘要生成失败: " + error;
            summaryText.classList.remove("streaming-content");
            
            // 清理事件监听器
            window.electronAPI.removeAllListeners("summarize-stream-chunk");
            window.electronAPI.removeAllListeners("summarize-stream-end");
            window.electronAPI.removeAllListeners("summarize-stream-error");
        });
        
        console.log("调用流式API生成摘要...");
        console.log("提示词长度:", prompt.length);
        
        try {
            // 调用流式API - 修改为使用对象参数，与IPC处理程序匹配
            await window.electronAPI.summarizeArticleStream({
                text: prompt,
                provider: provider,
                model: model,
                length: summaryLength,
                targetLanguage: targetLanguage === "auto" ? null : targetLanguage
            });
        } catch (error) {
            console.error("API调用失败:", error);
            
            // 确保加载动画移除
            if (loadingElement) {
                loadingElement.style.display = "none";
            }
            
            throw new Error("无法连接到AI服务: " + error.message);
        }
    }
    
    // 非流式生成摘要 - 修改参数格式
    async function handleNormalSummary(prompt, summaryDiv) {
        // 获取设置
        const provider = apiSettings.activeProvider;
        const model = apiSettings.providers[provider].model;
        const summaryLength = userSettings.summaryLength;
        
        console.log("调用摘要API...");
        
        try {
            // 调用摘要API - 修改为使用对象参数，与IPC处理程序匹配
            const summary = await window.electronAPI.summarizeArticle({
                text: prompt,
                provider: provider,
                model: model,
                length: summaryLength
            });
            
            // 更新界面
            summaryDiv.querySelector(".summary-loading").remove();
            summaryDiv.querySelector(".summary-text").textContent = summary;
            
            // 保存摘要到文章
            if (currentArticleData) {
                currentArticleData.summary = summary;
                updateArticleSummary(currentFeedUrl, currentArticleData);
            }
            
            showNotification("摘要生成完成");
        } catch (error) {
            console.error("API调用失败:", error);
            throw new Error("无法生成摘要: " + error.message);
        }
    }
    
    // 翻译文章
    async function translateArticle(article, targetLanguage) {
        // 检查是否有API密钥
        const provider = apiSettings.activeProvider;
        const apiKey = apiSettings.providers[provider].apiKey;
        
        if (!apiKey) {
            showNotification("请先在AI设置中配置API密钥", "error");
            aiSettingsPanel.classList.add("active");
            return;
        }
        
        // 获取文章内容
        const content = article.content;
        if (!content || content.trim() === "") {
            showNotification("文章内容为空，无法翻译", "error");
            return;
        }
        
        // 移除现有翻译内容
        const existingTranslation = document.querySelector(".translation-content");
        if (existingTranslation) {
            existingTranslation.remove();
        }
        
        // 创建翻译容器
        const translationDiv = document.createElement("div");
        translationDiv.className = "translation-content";
        translationDiv.innerHTML = `
            <h4 class="translation-header">
                <i class="fas fa-language"></i> ${targetLanguage === "zh-CN" ? "中文翻译" : "English Translation"}
                <div class="summary-loading">
                    <span class="loading-indicator"></span> 正在翻译...
                </div>
            </h4>
            <div class="translation-text"></div>
        `;
        
        // 添加到文章内容区域
        const contentDiv = document.querySelector(".article-content");
        if (contentDiv) {
            contentDiv.parentNode.insertBefore(translationDiv, contentDiv.nextSibling);
        } else {
            articleContainer.appendChild(translationDiv);
        }
        
        // 准备翻译提示词
        const prompt = `请将以下内容翻译成${targetLanguage === "zh-CN" ? "中文" : "英语"}，保持原文的格式和含义：\n\n${content}`;
        
        try {
            // 根据是否使用流式模式选择不同的处理方法
            if (userSettings.useStreamMode) {
                await handleStreamingTranslation(prompt, translationDiv, targetLanguage);
            } else {
                await handleNormalTranslation(prompt, translationDiv, targetLanguage);
            }
        } catch (error) {
            console.error("翻译失败:", error);
            showNotification("翻译失败: " + error.message, "error");
            translationDiv.querySelector(".summary-loading").remove();
            translationDiv.querySelector(".translation-text").textContent = "翻译失败，请重试或检查API设置";
        }
    }
    
    // 流式翻译 - 修改参数格式，并添加加载动画处理
    async function handleStreamingTranslation(prompt, translationDiv, targetLanguage) {
        // 获取设置
        const provider = apiSettings.activeProvider;
        const model = apiSettings.providers[provider].model;
        
        // 准备显示流式内容的容器
        const loadingElement = translationDiv.querySelector(".summary-loading");
        const translationText = translationDiv.querySelector(".translation-text");
        translationText.classList.add("streaming-content");
        
        // 流式内容存储
        let streamedContent = "";
        let receivedFirstChunk = false;
        
        // 设置事件监听器
        window.electronAPI.onSummarizeStreamChunk((chunk) => {
            // 收到第一个块数据时，移除加载动画
            if (!receivedFirstChunk && chunk) {
                receivedFirstChunk = true;
                if (loadingElement) {
                    loadingElement.style.display = "none";
                }
            }
            
            streamedContent += chunk;
            translationText.textContent = streamedContent;
        });
        
        window.electronAPI.onSummarizeStreamEnd(() => {
            // 确保加载动画移除
            if (loadingElement) {
                loadingElement.style.display = "none";
            }
            
            // 流式输出完成
            translationText.classList.remove("streaming-content");
            
            // 清理事件监听器
            window.electronAPI.removeAllListeners("summarize-stream-chunk");
            window.electronAPI.removeAllListeners("summarize-stream-end");
            window.electronAPI.removeAllListeners("summarize-stream-error");
            
            showNotification("翻译完成");
        });
        
        window.electronAPI.onSummarizeStreamError((error) => {
            console.error("流式翻译失败:", error);
            
            // 确保加载动画移除
            if (loadingElement) {
                loadingElement.style.display = "none";
            }
            
            translationText.textContent = "翻译失败: " + error;
            translationText.classList.remove("streaming-content");
            
            // 清理事件监听器
            window.electronAPI.removeAllListeners("summarize-stream-chunk");
            window.electronAPI.removeAllListeners("summarize-stream-end");
            window.electronAPI.removeAllListeners("summarize-stream-error");
        });
        
        // 调用流式API - 修改为使用对象参数，与IPC处理程序匹配
        try {
            await window.electronAPI.summarizeArticleStream({
                text: prompt,
                provider: provider,
                model: model,
                length: "long",
                targetLanguage: targetLanguage
            });
        } catch (error) {
            console.error("流式翻译API调用失败:", error);
            
            // 确保加载动画移除
            if (loadingElement) {
                loadingElement.style.display = "none";
            }
            
            throw new Error("无法连接到翻译服务: " + error.message);
        }
    }
    
    // 非流式翻译 - 修改参数格式
    async function handleNormalTranslation(prompt, translationDiv, targetLanguage) {
        // 获取设置
        const provider = apiSettings.activeProvider;
        const model = apiSettings.providers[provider].model;
        
        // 调用API - 修改为使用对象参数，与IPC处理程序匹配
        const translation = await window.electronAPI.summarizeArticle({
            text: prompt,
            provider: provider,
            model: model,
            length: "long"
        });
        
        // 更新界面
        translationDiv.querySelector(".summary-loading").remove();
        translationDiv.querySelector(".translation-text").textContent = translation;
        
        showNotification("翻译完成");
    }
    
    // 更新文章摘要到缓存 - 修复参数格式
    async function updateArticleSummary(feedUrl, article) {
        try {
            console.log("更新文章摘要到缓存:", article.title);
            
            // 修改为与IPC处理程序匹配的参数格式
            await window.electronAPI.summarizeAndUpdateArticle({
                url: feedUrl, 
                articleIndex: currentArticleIndex,
                articleContent: article.summary
            });
            
            console.log("文章摘要已保存到缓存");
        } catch (error) {
            console.error("更新文章摘要失败:", error);
            showNotification("保存摘要失败，但已显示在页面上", "warning");
        }
    }
    
    // ============= 设置加载和保存 =============
    
    // 加载用户设置
    async function loadSettings() {
        try {
            const settings = await window.electronAPI.getSettings();
            if (settings) {
                userSettings = { ...userSettings, ...settings };
                console.log("加载用户设置:", userSettings);
            }
        } catch (error) {
            console.error("加载设置失败:", error);
        }
        
        applySettingsToUI();
    }
    
    // 保存用户设置
    async function saveSettings() {
        try {
            await window.electronAPI.saveSettings(userSettings);
            console.log("保存用户设置:", userSettings);
        } catch (error) {
            console.error("保存设置失败:", error);
            showNotification("保存设置失败", "error");
        }
    }
    
    // 加载API设置
    async function loadApiSettings() {
        try {
            const settings = await window.electronAPI.getApiSettings();
            if (settings) {
                apiSettings = { ...apiSettings, ...settings };
                console.log("加载API设置:");
            }
        } catch (error) {
            console.error("加载API设置失败:", error);
        }
        
        applySettingsToUI();
    }
    
    // 保存API设置
    async function saveApiSettings() {
        try {
            await window.electronAPI.saveApiSettings(apiSettings);
            console.log("保存API设置");
        } catch (error) {
            console.error("保存API设置失败:", error);
            showNotification("保存API设置失败", "error");
        }
    }
    
    // ============= RSS源列表处理 =============
    
    // 加载所有RSS源
    async function loadRssSources() {
        console.log("加载RSS源列表...");
        
        // 显示加载状态
        if (sourcesLoader) {
            sourcesLoader.style.display = "block";
        }
        
        try {
            // 获取RSS源
            const sources = await window.electronAPI.getRssSources();
            console.log(`获取到${sources.length}个RSS源`);
            
            // 保存到全局变量
            currentFeeds = sources;
            
            // 渲染RSS源列表
            renderRssSources(sources);
            
            // 如果有源，默认选中第一个
            if (sources.length > 0) {
                const firstSource = document.querySelector(".source-item");
                if (firstSource) {
                    firstSource.click();
                }
            }
        } catch (error) {
            console.error("加载RSS源失败:", error);
            rssSourcesList.innerHTML = `
                <div class="error-message">
                    加载RSS源失败: ${error.message}
                </div>
            `;
        } finally {
            // 隐藏加载器
            if (sourcesLoader) {
                sourcesLoader.style.display = "none";
            }
        }
    }
    
    // 渲染RSS源列表
    function renderRssSources(sources) {
        if (!rssSourcesList) return;
        
        if (!sources || sources.length === 0) {
            rssSourcesList.innerHTML = '<p class="empty-state">暂无RSS源<br>点击右上角+添加</p>';
            return;
        }
        
        let html = '';
        sources.forEach((source, index) => {
            html += `
                <li class="source-item" data-url="${source.url}" data-index="${index}">
                    <i class="fas fa-rss"></i> ${source.title || '未命名源'}
                </li>
            `;
        });
        
        rssSourcesList.innerHTML = html;
        
        // 添加点击事件
        document.querySelectorAll(".source-item").forEach(item => {
            item.addEventListener("click", handleSourceClick);
        });
    }
    
    // 处理RSS源点击事件
    async function handleSourceClick(e) {
        const sourceItem = e.currentTarget;
        const sourceUrl = sourceItem.dataset.url;
        const sourceIndex = parseInt(sourceItem.dataset.index);
        
        // 不重复加载相同的源
        if (sourceUrl === currentFeedUrl) return;
        
        console.log(`选择RSS源: ${sourceUrl}`);
        
        // 更新当前源URL
        currentFeedUrl = sourceUrl;
        
        // 添加选中状态
        document.querySelectorAll(".source-item").forEach(item => {
            item.classList.remove("selected");
        });
        sourceItem.classList.add("selected");
        
        // 显示加载中
        articlesContainer.innerHTML = '<div class="loader"><span class="loading-indicator"></span> 加载文章中...</div>';
        articlesHeader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
        
        // 重置文章内容
        resetArticleContent();
        
        try {
            // 获取RSS内容
            const feed = await window.electronAPI.fetchRss(sourceUrl);
            console.log(`获取到 ${feed.items?.length || 0} 篇文章`);
            
            // 保存文章列表
            currentArticles = feed.items || [];
            
            // 更新标题
            articlesHeader.innerHTML = `<i class="fas fa-newspaper"></i> ${feed.title || '文章列表'}`;
            
            // 渲染文章列表
            renderArticlesList(currentArticles);
            
            // 如果有文章，默认选中第一篇
            if (currentArticles.length > 0) {
                const firstArticle = document.querySelector(".article-item");
                if (firstArticle) {
                    firstArticle.click();
                }
            }
        } catch (error) {
            console.error("加载RSS文章失败:", error);
            articlesContainer.innerHTML = `<div class="error-message">加载文章失败: ${error.message}</div>`;
            articlesHeader.innerHTML = `<i class="fas fa-exclamation-triangle"></i> 加载失败`;
        }
    }
    
    // ============= 文章列表处理 =============
    
    // 渲染文章列表
    function renderArticlesList(articles) {
        if (!articlesContainer) return;
        
        if (!articles || articles.length === 0) {
            articlesContainer.innerHTML = '<p class="empty-state">该RSS源没有文章</p>';
            return;
        }
        
        let html = '<ul class="articles-list">';
        articles.forEach((article, index) => {
            // 格式化日期
            let dateStr = '';
            if (article.pubDate) {
                const date = new Date(article.pubDate);
                dateStr = date.toLocaleDateString();
            }
            
            // 生成列表项
            html += `
                <li class="article-item" data-index="${index}">
                    <div class="article-title">${article.title || '无标题'}</div>
                    ${dateStr ? `<small>${dateStr}</small>` : ''}
                </li>
            `;
        });
        html += '</ul>';
        
        articlesContainer.innerHTML = html;
        
        // 添加点击事件
        document.querySelectorAll(".article-item").forEach(item => {
            item.addEventListener("click", handleArticleClick);
        });
    }
    
    // 处理文章点击
    function handleArticleClick(e) {
        const articleItem = e.currentTarget;
        const articleIndex = parseInt(articleItem.dataset.index);
        
        console.log(`选择文章 #${articleIndex}`);
        
        // 添加选中状态
        document.querySelectorAll(".article-item").forEach(item => {
            item.classList.remove("selected");
        });
        articleItem.classList.add("selected");
        
        // 显示文章内容
        if (articleIndex >= 0 && articleIndex < currentArticles.length) {
            const article = currentArticles[articleIndex];
            
            // 先将容器重置并滚动到顶部
            resetArticleContent("加载中...");
            if (articleContainer) {
                articleContainer.scrollTop = 0;
            }
            
            // 显示文章内容
            displayArticleContent(article);
        } else {
            resetArticleContent("无效的文章索引");
        }
    }
    
    // ============= 文章内容处理 =============
    
    // 修改显示文章内容的函数，添加自动摘要和滚动到顶部
    function displayArticleContent(article) {
        if (!article) {
            resetArticleContent("文章不存在");
            return;
        }
        
        console.log(`显示文章: ${article.title}`);
        
        // 保存当前文章
        currentArticleData = article;
        
        // 更新标题
        contentHeader.innerHTML = `<i class="fas fa-book-open"></i> 文章内容`;
        
        // 提取发布日期
        let dateStr = '';
        if (article.pubDate) {
            const date = new Date(article.pubDate);
            dateStr = date.toLocaleString();
        }
        
        // 创建文章容器
        articleContainer.innerHTML = `
            <div class="article-header">
                <h1 class="article-title">${article.title || '无标题'}</h1>
                ${dateStr ? `<div class="article-date">${dateStr}</div>` : ''}
                ${article.creator ? `<div class="article-author">作者: ${article.creator}</div>` : ''}
            </div>
            <div class="article-content"></div>
            ${article.link ? `<p class="read-more"><a href="${article.link}" target="_blank"><i class="fas fa-external-link-alt"></i> 阅读原文</a></p>` : ''}
        `;
        
        // 添加文章内容
        const contentDiv = articleContainer.querySelector(".article-content");
        if (contentDiv) {
            // 尝试获取文章内容
            let content = article.content || article.contentSnippet || article.description || '';
            
            if (!content || content.trim() === '') {
                contentDiv.innerHTML = '<p class="empty-state">此文章没有内容</p>';
            } else {
                try {
                    contentDiv.innerHTML = content;
                } catch (e) {
                    console.error("设置文章内容失败:", e);
                    contentDiv.textContent = content;
                }
            }
        }
        
        // 添加现有的摘要
        if (article.summary && article.summary.trim() !== '') {
            const summaryDiv = document.createElement("div");
            summaryDiv.className = "ai-summary";
            summaryDiv.innerHTML = `
                <div class="ai-summary-header">
                    <h3 class="ai-summary-title"><i class="fas fa-robot"></i> AI 摘要</h3>
                </div>
                <div class="summary-content">
                    <div class="summary-text">${article.summary}</div>
                </div>
            `;
            
            // 插入到文章内容顶部
            articleContainer.insertBefore(summaryDiv, articleContainer.firstChild);
        }
        // 如果没有摘要且启用了自动摘要，则生成摘要
        else if (userSettings.autoSummarize) {
            generateSummary(article);
        }
        
        // 将文章容器滚动到顶部
        if (articleContainer) {
            articleContainer.scrollTop = 0;
        }
    }
    
    // 重置文章内容
    function resetArticleContent(message = "请先选择一篇文章") {
        articleContainer.innerHTML = `<p class="empty-state">${message}</p>`;
        contentHeader.innerHTML = `<i class="fas fa-book-open"></i> 文章内容`;
    }
    
    // ============= 添加RSS源处理 =============
    
    // 打开添加RSS源模态框
    if (addButton && modal) {
        addButton.addEventListener("click", () => {
            modal.style.display = "flex";
            if (urlInput) urlInput.focus();
        });
    }
    
    // 关闭模态框
    if (closeButton && modal) {
        closeButton.addEventListener("click", () => {
            modal.style.display = "none";
        });
    }
    
    // 点击外部关闭模态框
    window.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.style.display = "none";
        }
    });
    
    // 提交添加RSS源
    if (submitButton && urlInput) {
        submitButton.addEventListener("click", async () => {
            const url = urlInput.value.trim();
            
            if (!url) {
                alert("请输入有效的RSS链接");
                return;
            }
            
            submitButton.disabled = true;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 添加中...';
            
            try {
                // 尝试获取RSS内容
                const feed = await window.electronAPI.fetchRss(url);
                
                // 添加到源列表
                const newSource = {
                    title: feed.title || url,
                    url: url
                };
                
                // 获取现有源并添加新源
                const sources = [...currentFeeds, newSource];
                await window.electronAPI.saveRssSources(sources);
                
                // 更新当前源列表
                currentFeeds = sources;
                
                // 重新渲染源列表
                renderRssSources(sources);
                
                // 选中新添加的源
                const newItem = document.querySelector(`.source-item[data-url="${url}"]`);
                if (newItem) {
                    newItem.click();
                }
                
                // 关闭模态框
                modal.style.display = "none";
                urlInput.value = "";
            } catch (error) {
                console.error("添加RSS源失败:", error);
                alert(`添加失败: ${error.message}`);
            } finally {
                submitButton.disabled = false;
                submitButton.innerHTML = '<i class="fas fa-plus"></i> 添加订阅';
            }
        });
        
        // 回车提交
        urlInput.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                submitButton.click();
            }
        });
    }
    
    // ============= 辅助函数 =============
    
    // 显示通知
    function showNotification(message, type = "success") {
        // 移除现有通知
        const existingNotification = document.querySelector(".notification");
        if (existingNotification) {
            existingNotification.remove();
        }
        
        // 创建通知元素
        const notification = document.createElement("div");
        notification.className = `notification ${type}`;
        notification.textContent = message;
        
        // 添加到文档
        document.body.appendChild(notification);
        
        // 淡入效果
        setTimeout(() => {
            notification.classList.add("show");
        }, 10);
        
        // 几秒后淡出
        setTimeout(() => {
            notification.classList.remove("show");
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 3000);
    }

    // 初始化API面板事件监听
    function initAISettingsPanel() {
        console.log("初始化AI设置面板");
        
        // 切换设置面板显示/隐藏
        aiSettingsToggle.addEventListener("click", (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            console.log("切换AI设置面板");
            aiSettingsPanel.classList.toggle("active");
        });
        
        // 关闭设置面板
        closeSettingsBtn.addEventListener("click", (e) => {
            e.stopPropagation(); // 阻止事件冒泡
            aiSettingsPanel.classList.remove("active");
        });
        
        // 点击外部关闭设置面板 - 修复：使用mousedown事件
        document.addEventListener("mousedown", (e) => {
            if (aiSettingsPanel.classList.contains("active") && 
                !aiSettingsPanel.contains(e.target) && 
                e.target !== aiSettingsToggle) {
                aiSettingsPanel.classList.remove("active");
            }
        });
        
        // 监听设置变更
        autoSummarizeToggle.addEventListener("change", () => {
            userSettings.autoSummarize = autoSummarizeToggle.checked;
            saveSettings();
        });
        
        streamModeToggle.addEventListener("change", () => {
            userSettings.useStreamMode = streamModeToggle.checked;
            saveSettings();
        });
        
        summaryLanguageSelect.addEventListener("change", () => {
            userSettings.summaryLanguage = summaryLanguageSelect.value;
            saveSettings();
        });
        
        summaryLengthSelect.addEventListener("change", () => {
            userSettings.summaryLength = summaryLengthSelect.value;
            saveSettings();
        });
        
        // 选择活跃的API提供商
        apiRadios.forEach(radio => {
            radio.addEventListener("change", () => {
                if (radio.checked) {
                    apiSettings.activeProvider = radio.value;
                }
            });
        });
        
        // 保存API设置
        saveApiSettingsBtn.addEventListener("click", () => {
            // 收集所有API提供商的设置
            Object.keys(apiSettings.providers).forEach(provider => {
                apiSettings.providers[provider].apiKey = apiKeyInputs[provider].value;
                apiSettings.providers[provider].model = modelSelects[provider].value;
            });
            
            // 保存设置
            saveApiSettings();
            
            // 关闭面板并显示通知
            aiSettingsPanel.classList.remove("active");
            showNotification("AI设置已保存");
        });
    }
}); 