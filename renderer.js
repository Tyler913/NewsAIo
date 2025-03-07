const originalLog = console.log;
console.log = (level = "info", ...args) => {
    originalLog(...args);
    if (!(level === "error" || level === "warn" || level === "info")) {
        window.electronAPI?.logWithLevel(
            "error",
            "Invalid log level! Original message: " +
                level.toLocaleUpperCase +
                args.join(" ")
        );
    } else {
        window.electronAPI?.logWithLevel(level, args.join(" "));
    }
};

// 在文档加载事件之外声明所有全局变量，避免重复声明
let rssSources; 
let articlesList;
let articleDisplay;
let articleTitle;
let darkModeToggle;
let fontIncrease;
let fontDecrease;
let generateSummaryButton;
let currentRssUrl = null;
let currentArticleIndex = -1;
let userSettings = { darkMode: false, fontScale: 1.0, autoSummarize: false, useStreamMode: false, language: "zh-CN" };
let apiSettings = null;
let streamedSummary = "";

// 修改DOMContentLoaded事件处理程序，添加错误处理
document.addEventListener("DOMContentLoaded", function () {
    console.log("DOM加载完成，开始初始化应用...");
    
    // 初始化UI元素引用 - 添加错误处理
    try {
        rssSources = document.getElementById("rss-sources");
        articlesList = document.getElementById("articles");
        articleDisplay = document.getElementById("article-content");
        articleTitle = document.getElementById("article-title");
        
        console.log("元素初始化状态:", {
            rssSources: !!rssSources,
            articlesList: !!articlesList,
            articleDisplay: !!articleDisplay,
            articleTitle: !!articleTitle
        });
        
        if (!rssSources) throw new Error("找不到RSS源列表元素 (id: rss-sources)");
        if (!articlesList) throw new Error("找不到文章列表元素 (id: articles)");
        if (!articleDisplay) throw new Error("找不到文章内容元素 (id: article-content)");
        
        // 如果所有元素都存在，继续初始化操作
        console.log("开始加载RSS源...");
        loadRssSources();
    } catch (error) {
        console.error("初始化应用时出错:", error);
        alert("初始化应用时出错: " + error.message);
    }
});

// 分离初始化导航的函数
function initializeNavigation() {
    // 顶部导航切换
    const mainTabs = document.querySelectorAll('.tab-item');
    const mainTabContents = document.querySelectorAll('.main-tab-content');

    mainTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTabId = tab.getAttribute('data-main-tab');
            
            // 隐藏所有内容
            mainTabContents.forEach(content => {
                content.classList.remove('active');
            });
            
            // 移除所有tab的active类
            mainTabs.forEach(t => {
                t.classList.remove('active');
            });
            
            // 显示目标内容和激活tab
            const targetTab = document.getElementById(targetTabId);
            if (targetTab) {
                targetTab.classList.add('active');
                tab.classList.add('active');
            } else {
                console.error(`找不到目标标签页: ${targetTabId}`);
            }
        });
    });
    
    // 返回按钮处理
    const articlesBackButton = document.getElementById('articles-back-button');
    if (articlesBackButton) {
        articlesBackButton.addEventListener('click', () => {
            document.querySelector('[data-main-tab="sources-tab"]').click();
        });
    }
    
    const contentBackButton = document.getElementById('content-back-button');
    if (contentBackButton) {
        contentBackButton.addEventListener('click', () => {
            document.querySelector('[data-main-tab="articles-tab"]').click();
        });
    }
}

// 分离绑定事件处理程序的函数
function bindEventHandlers() {
    // 点击RSS源
    if (rssSources) {
        rssSources.addEventListener("click", async (event) => {
            const target = event.target.closest("li");
            if (target && target.classList.contains("source-item")) {
                // 处理RSS源点击
                handleRssSourceClick(target);
            }
        });
    }
    
    // 点击文章
    if (articlesList) {
        articlesList.addEventListener("click", (event) => {
            const target = event.target.closest("li");
            if (target && target.classList.contains("article-item")) {
                // 处理文章点击
                handleArticleClick(target);
            }
        });
    }
    
    // 设置按钮事件
    darkModeToggle.addEventListener("click", toggleDarkMode);
    fontIncrease.addEventListener("click", increaseFontSize);
    fontDecrease.addEventListener("click", decreaseFontSize);
    generateSummaryButton.addEventListener("click", generateSummary);
    
    // 添加快速翻译功能
    const quickTranslate = document.getElementById('quick-translate');
    if (quickTranslate) {
        quickTranslate.addEventListener('change', handleQuickTranslate);
    }
}

// 处理RSS源点击的函数
async function handleRssSourceClick(target) {
    try {
        // 添加选中类到点击的源，并从其他源移除
        document.querySelectorAll(".source-item").forEach(item => {
            item.classList.remove("selected");
        });
        target.classList.add("selected");
        
        // 保存当前RSS源URL，用于手动摘要
        currentRssUrl = target.dataset.url;
        currentArticleIndex = -1; // 重置文章索引
        
        // 切换到文章列表标签页
        document.querySelector('[data-main-tab="articles-tab"]').click();
        
        const url = target.dataset.url;
        const loadingIndicator = document.getElementById("articles-loading-indicator");
        loadingIndicator.innerHTML = `文章 <span class="loading-indicator"></span>`;
        
        console.log("info", `获取RSS源: ${url}`);
        const startTime = Date.now();

        const feed = await window.electronAPI.fetchRss(url);
        const elapsed = Date.now() - startTime;
        console.log(
            "info",
            `RSS获取时间 (包含IPC): ${elapsed}ms`
        );
        console.log(
            "info",
            `获取到RSS源: ${feed.title} (${feed.items.length} 篇文章)`
        );

        document.querySelector(".middle h2").textContent = feed.title;
        articlesList.innerHTML = "";

        if (feed.items.length === 0) {
            const emptyState = document.createElement("p");
            emptyState.className = "empty-state";
            emptyState.textContent = "此订阅源中没有文章。";
            articlesList.appendChild(emptyState);
        } else {
            feed.items.forEach((item) => {
                const li = document.createElement("li");
                li.className = "article-item";
                
                // 格式化发布日期
                const pubDate = item.pubDate ? new Date(item.pubDate) : null;
                const formattedDate = pubDate ? pubDate.toLocaleDateString() : '';
                
                li.innerHTML = `
                    <div class="article-title">${item.title}</div>
                    ${formattedDate ? `<div class="article-date">${formattedDate}</div>` : ''}
                    ${item.summary ? '<div class="has-summary"><i class="fas fa-check-circle"></i> AI 摘要</div>' : ''}
                `;
                
                li.dataset.content = item.content;
                li.dataset.link = item.link;
                li.dataset.pubDate = item.pubDate;
                li.dataset.title = item.title;
                li.dataset.summary = item.summary || "";

                articlesList.appendChild(li);
            });
        }
        
        loadingIndicator.textContent = "文章";
    } catch (error) {
        console.error("处理RSS源点击失败:", error);
        articlesList.innerHTML = `<div class="error-message">加载订阅源出错: ${error.message}</div>`;
        const loadingIndicator = document.getElementById("articles-loading-indicator");
        if (loadingIndicator) loadingIndicator.textContent = "文章";
    }
}

// 处理文章点击的函数
function handleArticleClick(target) {
    try {
        // 添加选中类到点击的文章，并从其他文章移除
        document.querySelectorAll(".article-item").forEach(item => {
            item.classList.remove("selected");
        });
        target.classList.add("selected");
        
        // 保存当前文章索引，用于手动摘要
        currentArticleIndex = Array.from(articlesList.children).indexOf(target);
        
        // 切换到内容标签页
        document.querySelector('[data-main-tab="content-tab"]').click();
        
        const content = target.dataset.content;
        const link = target.dataset.link;
        const pubDate = target.dataset.pubDate;
        const title = target.dataset.title;

        // 读取 AI 摘要
        const summary = target.dataset.summary || "";
        
        // 更新文章标题
        articleTitle.textContent = title;
        
        // 显示或隐藏生成摘要按钮
        generateSummaryButton.style.display = summary ? "none" : "inline-flex";

        // 渲染文章内容，摘要放在文章前面
        articleDisplay.innerHTML = `
            ${
                pubDate
                    ? `<p><small>${new Date(pubDate).toLocaleString()}</small></p>`
                    : ""
            }
            ${
                summary
                    ? `<div class="ai-summary">
                           <strong><i class="fas fa-robot"></i> AI 摘要</strong>
                           ${summary}
                       </div>`
                    : ""
            }
            <div class="article-content">${content}</div>
            ${
                link
                    ? `<p class="read-more"><a href="${link}" target="_blank"><i class="fas fa-external-link-alt"></i> 阅读原文</a></p>`
                    : ""
            }
        `;
    } catch (error) {
        console.error("处理文章点击失败:", error);
        showNotification("显示文章失败: " + error.message, "error");
    }
}

// 暗色模式切换
async function toggleDarkMode() {
    userSettings.darkMode = !userSettings.darkMode;
    applySettings();
    setRootMode();
    await window.electronAPI.saveSettings(userSettings);
}

// 增加字体大小
async function increaseFontSize() {
    userSettings.fontScale =
        Math.round((parseFloat(userSettings.fontScale) + 0.1) * 10) / 10;
    applySettings();
    await window.electronAPI.saveSettings(userSettings);
}

// 减小字体大小
async function decreaseFontSize() {
    userSettings.fontScale = Math.max(
        0.5,
        Math.round((parseFloat(userSettings.fontScale) - 0.1) * 10) / 10
    );
    applySettings();
    await window.electronAPI.saveSettings(userSettings);
}

// 生成摘要
async function generateSummary() {
    if (currentRssUrl === null || currentArticleIndex === -1) {
        showNotification("请先选择一篇文章", "error");
        return;
    }
    
    // 显示加载状态
    generateSummaryButton.disabled = true;
    generateSummaryButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 正在生成...';
    
    // 查找要总结的文章内容
    const articleContent = document.querySelector(".article-content").innerHTML;
    
    try {
        if (userSettings.useStreamMode) {
            // 流式处理流程...
            await handleStreamSummary(articleContent);
        } else {
            // 非流式处理流程...
            await handleNonStreamSummary(articleContent);
        }
    } catch (error) {
        console.error("生成摘要失败:", error);
        showNotification("生成摘要失败: " + error.message, "error");
        // 恢复按钮状态
        generateSummaryButton.disabled = false;
        generateSummaryButton.innerHTML = '<i class="fas fa-robot"></i> 生成摘要';
    }
}

// 处理流式摘要生成
async function handleStreamSummary(articleContent) {
    // 流式处理：首先设置一个空的摘要容器
    const existingSummary = document.querySelector(".ai-summary");
    if (existingSummary) {
        existingSummary.remove();
    }
    
    // 创建新的摘要容器，准备接收流式内容
    const summaryDiv = document.createElement("div");
    summaryDiv.className = "ai-summary";
    summaryDiv.innerHTML = `<strong><i class="fas fa-robot"></i> AI 摘要</strong><span class="streaming-content"></span>`;
    
    const articleContentElement = document.querySelector(".article-content");
    articleContentElement.parentNode.insertBefore(summaryDiv, articleContentElement);
    
    const streamingContent = summaryDiv.querySelector(".streaming-content");
    
    // 重置流式摘要
    streamedSummary = "";
    
    // 设置流式响应监听器
    window.electronAPI.onSummarizeStreamChunk((chunk) => {
        streamedSummary += chunk;
        streamingContent.textContent = streamedSummary;
    });
    
    window.electronAPI.onSummarizeStreamEnd(() => {
        // 流式输出完成后更新缓存
        updateArticleSummary(currentRssUrl, currentArticleIndex, streamedSummary);
        // 清理监听器
        window.electronAPI.removeAllListeners('summarize-stream-chunk');
        window.electronAPI.removeAllListeners('summarize-stream-end');
        window.electronAPI.removeAllListeners('summarize-stream-error');
        // 恢复按钮状态
        generateSummaryButton.disabled = false;
        generateSummaryButton.style.display = "none";
        generateSummaryButton.innerHTML = '<i class="fas fa-robot"></i> 生成摘要';
        showNotification("摘要生成成功！");
    });
    
    window.electronAPI.onSummarizeStreamError((error) => {
        console.error("生成摘要失败:", error);
        showNotification("生成摘要失败: " + error, "error");
        // 清理监听器
        window.electronAPI.removeAllListeners('summarize-stream-chunk');
        window.electronAPI.removeAllListeners('summarize-stream-end');
        window.electronAPI.removeAllListeners('summarize-stream-error');
        // 恢复按钮状态
        generateSummaryButton.disabled = false;
        generateSummaryButton.innerHTML = '<i class="fas fa-robot"></i> 生成摘要';
    });
    
    // 获取目标语言设置
    const apiSettings = await window.electronAPI.getApiSettings();
    let targetLanguage = null;
    if (apiSettings.summaryLanguage && apiSettings.summaryLanguage !== 'auto') {
        targetLanguage = apiSettings.summaryLanguage === 'zh-CN' ? '中文' : '英语';
    }
    
    // 调用流式API
    await window.electronAPI.summarizeArticleStream(
        articleContent,
        null, // 使用默认提供商
        null, // 使用默认模型
        null, // 使用默认摘要长度
        targetLanguage
    );
}

// 处理非流式摘要生成
async function handleNonStreamSummary(articleContent) {
    const summary = await window.electronAPI.summarizeAndUpdateArticle(
        currentRssUrl,
        currentArticleIndex,
        articleContent
    );
    
    // 更新UI显示
    const existingSummary = document.querySelector(".ai-summary");
    if (existingSummary) {
        existingSummary.remove();
    }
    
    // 创建并插入摘要
    const summaryDiv = document.createElement("div");
    summaryDiv.className = "ai-summary";
    summaryDiv.innerHTML = `<strong><i class="fas fa-robot"></i> AI 摘要</strong>${summary}`;
    
    const articleContentElement = document.querySelector(".article-content");
    articleContentElement.parentNode.insertBefore(summaryDiv, articleContentElement);
    
    // 显示成功通知
    showNotification("摘要生成成功！");
    
    // 隐藏生成按钮
    generateSummaryButton.style.display = "none";
    generateSummaryButton.disabled = false;
    generateSummaryButton.innerHTML = '<i class="fas fa-robot"></i> 生成摘要';
}

// 处理快速翻译
async function handleQuickTranslate() {
    const targetLanguage = this.value;
    if (targetLanguage === 'none') return;
    
    // 获取当前文章内容
    const articleContent = document.querySelector(".article-content").innerHTML;
    if (!articleContent || articleContent.trim() === '') return;
    
    // 显示通知
    showNotification("正在翻译文章...");
    
    try {
        // 获取API设置
        const apiSettings = await window.electronAPI.getApiSettings();
        const provider = apiSettings.activeProvider;
        const model = apiSettings.providers[provider].model;
        
        // 调用流式API进行翻译
        if (userSettings.useStreamMode) {
            // 创建翻译容器
            const translationDiv = document.createElement("div");
            translationDiv.className = "translation-content";
            translationDiv.innerHTML = `<h4>${targetLanguage === 'zh-CN' ? '中文翻译' : 'English Translation'}</h4><div class="streaming-content"></div>`;
            
            const articleContentElement = document.querySelector(".article-content");
            articleContentElement.parentNode.insertBefore(translationDiv, articleContentElement.nextSibling);
            
            const streamingContent = translationDiv.querySelector(".streaming-content");
            
            // 重置流式内容
            let streamedContent = "";
            
            // 设置监听器
            window.electronAPI.onSummarizeStreamChunk((chunk) => {
                streamedContent += chunk;
                streamingContent.textContent = streamedContent;
            });
            
            window.electronAPI.onSummarizeStreamEnd(() => {
                // 清理监听器
                window.electronAPI.removeAllListeners('summarize-stream-chunk');
                window.electronAPI.removeAllListeners('summarize-stream-end');
                window.electronAPI.removeAllListeners('summarize-stream-error');
                
                quickTranslate.value = 'none';
                showNotification("翻译完成");
            });
            
            window.electronAPI.onSummarizeStreamError((error) => {
                console.error("翻译失败:", error);
                showNotification("翻译失败: " + error, "error");
                // 清理监听器
                window.electronAPI.removeAllListeners('summarize-stream-chunk');
                window.electronAPI.removeAllListeners('summarize-stream-end');
                window.electronAPI.removeAllListeners('summarize-stream-error');
                
                quickTranslate.value = 'none';
            });
            
            // 调用流式API - 使用翻译提示词
            const promptText = `请将以下内容翻译成${targetLanguage === 'zh-CN' ? '中文' : '英语'}，保持原文的格式和含义：\n\n${articleContent}`;
            await window.electronAPI.summarizeArticleStream(
                promptText,
                null, // 使用默认提供商
                null, // 使用默认模型
                null, // 使用默认摘要长度
                targetLanguage === 'zh-CN' ? '中文' : '英语'
            );
        } else {
            // 非流式翻译
            const prompt = `请将以下内容翻译成${targetLanguage === 'zh-CN' ? '中文' : '英语'}，保持原文的格式和含义：\n\n${articleContent}`;
            const translation = await window.electronAPI.summarizeArticle(
                prompt,
                provider,
                model,
                'long'
            );
            
            // 创建并插入翻译
            const translationDiv = document.createElement("div");
            translationDiv.className = "translation-content";
            translationDiv.innerHTML = `<h4>${targetLanguage === 'zh-CN' ? '中文翻译' : 'English Translation'}</h4>${translation}`;
            
            const articleContentElement = document.querySelector(".article-content");
            articleContentElement.parentNode.insertBefore(translationDiv, articleContentElement.nextSibling);
            
            quickTranslate.value = 'none';
            showNotification("翻译完成");
        }
    } catch (error) {
        console.error("翻译失败:", error);
        showNotification("翻译失败: " + error.message, "error");
        quickTranslate.value = 'none';
    }
}

// 更新文章摘要
async function updateArticleSummary(url, articleIndex, summary) {
    try {
        // 更新DOM中的摘要
        if (articlesList && articlesList.children && articlesList.children[articleIndex]) {
            const articleItem = articlesList.children[articleIndex];
            articleItem.dataset.summary = summary;
            
            // 添加摘要标识
            if (!articleItem.querySelector('.has-summary')) {
                const summaryIndicator = document.createElement('div');
                summaryIndicator.className = 'has-summary';
                summaryIndicator.innerHTML = '<i class="fas fa-check-circle"></i> AI 摘要';
                articleItem.appendChild(summaryIndicator);
            }
        }
        
        // 调用后端存储摘要
        await window.electronAPI.summarizeAndUpdateArticle(url, articleIndex, summary);
    } catch (error) {
        console.error("更新文章摘要失败:", error);
    }
}

// Apply root dark mode class to enable CSS variables
function setRootMode() {
    if (userSettings && userSettings.darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
}

// ----------------- 增强设置代码 -----------------
async function loadSettings() {
    try {
        const settings = await window.electronAPI.getSettings();
        userSettings = settings;
    } catch (error) {
        console.error("加载设置失败，使用默认值。", error);
    }
    applySettings();
    setRootMode();
    
    // 设置自动总结开关状态
    document.getElementById('auto-summarize').checked = userSettings.autoSummarize || false;
}

async function loadApiSettings() {
    try {
        apiSettings = await window.electronAPI.getApiSettings();
        populateApiSettingsForm();
    } catch (error) {
        console.error("加载 API 设置失败:", error);
    }
}

function populateApiSettingsForm() {
    if (!apiSettings) return;

    // Set active provider
    document.getElementById('active-api').value = apiSettings.activeProvider;
    document.getElementById('summary-length').value = apiSettings.summaryLength;
    document.getElementById('summary-language').value = apiSettings.summaryLanguage || "auto";

    // Set OpenAI settings
    document.getElementById('openai-api-key').value = apiSettings.providers.openai.apiKey;
    document.getElementById('openai-model').value = apiSettings.providers.openai.model;

    // Set DeepSeek settings
    document.getElementById('deepseek-api-key').value = apiSettings.providers.deepseek.apiKey;
    document.getElementById('deepseek-model').value = apiSettings.providers.deepseek.model;

    // Set Anthropic settings
    document.getElementById('anthropic-api-key').value = apiSettings.providers.anthropic.apiKey;
    document.getElementById('anthropic-model').value = apiSettings.providers.anthropic.model;
}

function applySettings() {
    // Update dark mode
    if (userSettings.darkMode) {
        document.body.classList.add("dark-mode");
        darkModeToggle.innerHTML = '<i class="fas fa-sun"></i> 亮色模式';
        darkModeSetting.checked = true;
    } else {
        document.body.classList.remove("dark-mode");
        darkModeToggle.innerHTML = '<i class="fas fa-moon"></i> 暗色模式';
        darkModeSetting.checked = false;
    }
    // Update overall font scale
    document.body.style.fontSize = userSettings.fontScale + "em";
    fontScaleSetting.value = userSettings.fontScale;
    fontScaleValue.textContent = userSettings.fontScale;
    
    // 更新流式输出设置
    document.getElementById("stream-mode").checked = userSettings.useStreamMode || false;
    
    // 更新应用语言设置
    appLanguageSelect.value = userSettings.language || "zh-CN";
}

darkModeToggle = document.getElementById("dark-mode-toggle");
fontIncrease = document.getElementById("font-increase");
fontDecrease = document.getElementById("font-decrease");
saveApiSettingsBtn = document.getElementById("save-api-settings");

darkModeToggle.addEventListener("click", async () => {
    userSettings.darkMode = !userSettings.darkMode;
    applySettings();
    setRootMode();
    await window.electronAPI.saveSettings(userSettings);
});

fontIncrease.addEventListener("click", async () => {
    userSettings.fontScale =
        Math.round((parseFloat(userSettings.fontScale) + 0.1) * 10) / 10;
    applySettings();
    await window.electronAPI.saveSettings(userSettings);
});

fontDecrease.addEventListener("click", async () => {
    userSettings.fontScale = Math.max(
        0.5,
        Math.round((parseFloat(userSettings.fontScale) - 0.1) * 10) / 10
    );
    applySettings();
    await window.electronAPI.saveSettings(userSettings);
});

saveApiSettingsBtn.addEventListener("click", async () => {
    // Save API settings
    if (!apiSettings) return;

    // Get values from form
    apiSettings.activeProvider = document.getElementById('active-api').value;
    apiSettings.summaryLength = document.getElementById('summary-length').value;
    apiSettings.summaryLanguage = document.getElementById('summary-language').value;

    // OpenAI settings
    apiSettings.providers.openai.apiKey = document.getElementById('openai-api-key').value;
    apiSettings.providers.openai.model = document.getElementById('openai-model').value;

    // DeepSeek settings
    apiSettings.providers.deepseek.apiKey = document.getElementById('deepseek-api-key').value;
    apiSettings.providers.deepseek.model = document.getElementById('deepseek-model').value;

    // Anthropic settings
    apiSettings.providers.anthropic.apiKey = document.getElementById('anthropic-api-key').value;
    apiSettings.providers.anthropic.model = document.getElementById('anthropic-model').value;

    try {
        await window.electronAPI.saveApiSettings(apiSettings);
        showNotification("API设置已保存");
    } catch (error) {
        console.error("保存API设置失败:", error);
        showNotification("保存API设置失败", "error");
    }
});

function showNotification(message, type = "success") {
    // Create notification element if it doesn't exist
    let notification = document.getElementById('notification');
    if (!notification) {
        notification = document.createElement('div');
        notification.id = 'notification';
        notification.className = 'notification';
        document.body.appendChild(notification);
    }

    // Set type class
    notification.className = 'notification';
    notification.classList.add(type);
    
    // Set message and show
    notification.textContent = message;
    notification.style.display = 'block';
    
    // Auto hide after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.style.display = 'none';
            notification.style.opacity = '1';
        }, 300);
    }, 3000);
}

// 修复流式输出和自动总结切换无法点击的问题
function fixToggleSwitches() {
    // 初始化checkbox的状态和事件监听
    const streamModeToggle = document.getElementById("stream-mode");
    const autoSummarizeToggle = document.getElementById("auto-summarize");
    
    // 确保设置了初始状态
    streamModeToggle.checked = userSettings.useStreamMode || false;
    autoSummarizeToggle.checked = userSettings.autoSummarize || false;
    
    // 重新添加事件监听器
    streamModeToggle.addEventListener("change", async () => {
        userSettings.useStreamMode = streamModeToggle.checked;
        await window.electronAPI.saveSettings(userSettings);
        showNotification(userSettings.useStreamMode ? "已启用流式输出" : "已禁用流式输出");
    });
    
    autoSummarizeToggle.addEventListener("change", async () => {
        userSettings.autoSummarize = autoSummarizeToggle.checked;
        await window.electronAPI.saveSettings(userSettings);
        showNotification(userSettings.autoSummarize ? "自动总结已启用" : "自动总结已禁用");
    });
}

// 添加快速翻译功能
const quickTranslate = document.getElementById('quick-translate');
quickTranslate.addEventListener('change', async () => {
    const targetLanguage = quickTranslate.value;
    if (targetLanguage === 'none') return;
    
    // 获取当前文章内容
    const articleContent = document.querySelector(".article-content").innerHTML;
    if (!articleContent || articleContent.trim() === '') return;
    
    // 显示加载状态
    const originalText = quickTranslate.parentElement.querySelector('.primary-button') ? 
                        quickTranslate.parentElement.querySelector('.primary-button').innerHTML : '';
    
    showNotification("正在翻译文章...");
    
    try {
        // 获取API设置
        const apiSettings = await window.electronAPI.getApiSettings();
        const provider = apiSettings.activeProvider;
        const model = apiSettings.providers[provider].model;
        
        // 调用流式API进行翻译
        if (userSettings.useStreamMode) {
            // 创建翻译容器
            const translationDiv = document.createElement("div");
            translationDiv.className = "translation-content";
            translationDiv.innerHTML = `<h4>${targetLanguage === 'zh-CN' ? '中文翻译' : 'English Translation'}</h4><div class="streaming-content"></div>`;
            
            const articleContentElement = document.querySelector(".article-content");
            articleContentElement.parentNode.insertBefore(translationDiv, articleContentElement.nextSibling);
            
            const streamingContent = translationDiv.querySelector(".streaming-content");
            
            // 重置流式内容
            let streamedContent = "";
            
            // 设置监听器
            window.electronAPI.onSummarizeStreamChunk((chunk) => {
                streamedContent += chunk;
                streamingContent.textContent = streamedContent;
            });
            
            window.electronAPI.onSummarizeStreamEnd(() => {
                // 清理监听器
                window.electronAPI.removeAllListeners('summarize-stream-chunk');
                window.electronAPI.removeAllListeners('summarize-stream-end');
                window.electronAPI.removeAllListeners('summarize-stream-error');
                
                quickTranslate.value = 'none';
                showNotification("翻译完成");
            });
            
            window.electronAPI.onSummarizeStreamError((error) => {
                console.error("翻译失败:", error);
                showNotification("翻译失败: " + error, "error");
                // 清理监听器
                window.electronAPI.removeAllListeners('summarize-stream-chunk');
                window.electronAPI.removeAllListeners('summarize-stream-end');
                window.electronAPI.removeAllListeners('summarize-stream-error');
                
                quickTranslate.value = 'none';
            });
            
            // 调用流式API - 使用翻译提示词
            const promptText = `请将以下内容翻译成${targetLanguage === 'zh-CN' ? '中文' : '英语'}，保持原文的格式和含义：\n\n${articleContent}`;
            await window.electronAPI.summarizeArticleStream(
                promptText,
                null, // 使用默认提供商
                null, // 使用默认模型
                null, // 使用默认摘要长度
                targetLanguage === 'zh-CN' ? '中文' : '英语'
            );
        } else {
            // 非流式翻译
            const prompt = `请将以下内容翻译成${targetLanguage === 'zh-CN' ? '中文' : '英语'}，保持原文的格式和含义：\n\n${articleContent}`;
            const translation = await window.electronAPI.summarizeArticle(
                prompt,
                provider,
                model,
                'long'
            );
            
            // 创建并插入翻译
            const translationDiv = document.createElement("div");
            translationDiv.className = "translation-content";
            translationDiv.innerHTML = `<h4>${targetLanguage === 'zh-CN' ? '中文翻译' : 'English Translation'}</h4>${translation}`;
            
            const articleContentElement = document.querySelector(".article-content");
            articleContentElement.parentNode.insertBefore(translationDiv, articleContentElement.nextSibling);
            
            quickTranslate.value = 'none';
            showNotification("翻译完成");
        }
    } catch (error) {
        console.error("翻译失败:", error);
        showNotification("翻译失败: " + error.message, "error");
        quickTranslate.value = 'none';
    }
});

// 添加流式/非流式切换处理
const streamModeToggle = document.getElementById("stream-mode");

streamModeToggle.addEventListener("change", async () => {
    userSettings.useStreamMode = streamModeToggle.checked;
    await window.electronAPI.saveSettings(userSettings);
    showNotification(userSettings.useStreamMode ? "已启用流式输出" : "已禁用流式输出");
});

// 添加摘要语言选择处理
const summaryLanguageSelect = document.getElementById("summary-language");

summaryLanguageSelect.addEventListener("change", async () => {
    try {
        const apiSettings = await window.electronAPI.getApiSettings();
        apiSettings.summaryLanguage = summaryLanguageSelect.value;
        await window.electronAPI.saveApiSettings(apiSettings);
        showNotification("摘要语言设置已保存");
    } catch (error) {
        console.error("保存摘要语言设置失败:", error);
        showNotification("保存设置失败", "error");
    }
});

// 辅助函数：更新文章缓存
async function updateArticleCache(url, articleIndex, summary) {
    try {
        const hash = crypto.createHash("md5").update(url).digest("hex");
        const cachePath = path.join(CACHE_DIR, `${hash}.json`);
        
        if (!fs.existsSync(cachePath)) {
            console.error("找不到RSS源缓存");
            return;
        }
        
        const rawData = fs.readFileSync(cachePath, "utf-8");
        const cachedData = JSON.parse(rawData);
        const feed = cachedData.feed;
        
        if (!feed || !feed.items || articleIndex >= feed.items.length) {
            console.error("文章索引无效或缓存数据损坏");
            return;
        }
        
        // 更新缓存中的摘要
        feed.items[articleIndex].summary = summary;
        
        // 保存回缓存
        cachedData.feed = feed;
        fs.writeFileSync(cachePath, JSON.stringify(cachedData), "utf-8");
    } catch (error) {
        console.error("更新文章缓存失败:", error);
    }
}

// ------------- 应用设置处理 -------------
const appLanguageSelect = document.getElementById("app-language");
const darkModeSetting = document.getElementById("dark-mode-setting");
const fontScaleSetting = document.getElementById("font-scale-setting");
const fontScaleValue = document.getElementById("font-scale-value");
const saveAppSettingsBtn = document.getElementById("save-app-settings");

// 监听字体大小滑块变化
fontScaleSetting.addEventListener("input", () => {
    const value = fontScaleSetting.value;
    fontScaleValue.textContent = value;
    document.body.style.fontSize = value + "em";
});

// 应用设置保存
saveAppSettingsBtn.addEventListener("click", async () => {
    try {
        const newSettings = {
            ...userSettings,
            darkMode: darkModeSetting.checked,
            fontScale: parseFloat(fontScaleSetting.value),
            language: appLanguageSelect.value
        };
        
        // 检测语言是否改变
        const languageChanged = userSettings.language !== newSettings.language;
        
        // 保存设置
        userSettings = newSettings;
        await window.electronAPI.saveSettings(userSettings);
        
        // 应用设置
        applySettings();
        setRootMode();
        
        // 显示成功通知
        showNotification("设置已保存");
        
        // 如果语言改变，提示重启
        if (languageChanged) {
            setTimeout(() => {
                showNotification("语言设置已更改，请重启应用以应用更改", "warning");
            }, 1000);
        }
    } catch (error) {
        console.error("保存应用设置失败:", error);
        showNotification("保存设置失败", "error");
    }
});

// 监听暗色模式设置变化，同步到顶部按钮
darkModeSetting.addEventListener("change", () => {
    if (darkModeSetting.checked !== userSettings.darkMode) {
        darkModeToggle.click(); // 使用现有的切换功能
    }
});

// ----------------- 顶部导航切换 -----------------
const mainTabs = document.querySelectorAll('.tab-item');
const mainTabContents = document.querySelectorAll('.main-tab-content');

mainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTabId = tab.getAttribute('data-main-tab');
        
        // 隐藏所有内容
        mainTabContents.forEach(content => {
            content.classList.remove('active');
        });
        
        // 移除所有tab的active类
        mainTabs.forEach(t => {
            t.classList.remove('active');
        });
        
        // 显示目标内容和激活tab
        document.getElementById(targetTabId).classList.add('active');
        tab.classList.add('active');
    });
});

// 返回按钮处理
document.getElementById('articles-back-button').addEventListener('click', () => {
    document.querySelector('[data-main-tab="sources-tab"]').click();
});

document.getElementById('content-back-button').addEventListener('click', () => {
    document.querySelector('[data-main-tab="articles-tab"]').click();
});

async function loadRssSources() {
    console.log("加载RSS源列表...");
    
    // Ensure rssSourcesList is initialized
    if (!rssSourcesList) {
        rssSourcesList = document.getElementById("rss-sources");
        if (!rssSourcesList) {
            console.error("无法找到RSS源列表元素");
            showNotification("无法找到RSS源列表元素", "error");
            return [];
        }
    }
    
    // Show loading state directly in rssSourcesList
    rssSourcesList.innerHTML = '<div class="loader"><span class="loading-indicator"></span> 加载订阅源...</div>';
    
    // Set a timeout promise in case getRssSources takes too long
    const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => {
            reject(new Error("加载RSS源超时，请检查网络连接"));
        }, 15000);
    });
    
    try {
        console.log("调用IPC获取RSS源...");
        // Retrieve RSS sources with timeout
        const sources = await Promise.race([
            window.electronAPI.getRssSources(),
            timeoutPromise
        ]);
        console.log(`获取到${sources ? sources.length : 0}个RSS源`);
        
        if (!sources || !Array.isArray(sources)) {
            throw new Error("获取到的RSS源格式无效");
        }
        
        // Save to global and render list
        currentFeeds = sources;
        renderRssSources(sources);
        
        // If there are sources, optionally trigger default selection
        if (sources.length > 0) {
            const firstSource = document.querySelector(".source-item");
            if (firstSource) {
                firstSource.click();
            }
        }
        
        return sources;
    } catch (error) {
        console.error("加载RSS源失败:", error);
        rssSourcesList.innerHTML = `
            <div class="error-message">
                加载RSS源失败: ${error.message}
            </div>
            <p class="empty-state">点击右上角+添加RSS源</p>
        `;
        showNotification("加载RSS源失败: " + error.message, "error");
        return [];
    }
}