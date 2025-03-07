// ============= 语言本地化系统 =============

// 默认语言设置
let currentLanguage = 'zh-CN'; // 默认为中文

// 本地化字符串
const i18n = {
    'zh-CN': {
        // 应用程序主要UI
        'app_title': 'NewsAIo - 智能RSS阅读器',
        'feed_list': '订阅源',
        'article_list': '文章列表',
        'article_content': '文章内容',
        'loading': '加载中...',
        'no_article_selected': '请先选择一篇文章',
        'no_content': '此文章没有内容',
        'read_original': '在浏览器中阅读原文',
        'search_placeholder': '搜索文章...',
        'add_source': '添加订阅源',
        'remove_source': '删除',
        'refresh_all': '刷新全部',
        
        // AI摘要和翻译
        'ai_summary': 'AI 摘要',
        'generate_summary': '生成摘要',
        'translation': '中文翻译',
        'english_translation': 'English Translation',
        'auto_summarize': '自动总结文章',
        'auto_summarize_desc': '打开后，当你选择一篇文章时将自动生成摘要',
        'use_stream_mode': '使用流式模式',
        'use_stream_mode_desc': '打开后，AI生成的文本将以打字效果逐字显示',
        'translate_to': '翻译成',
        'translate_button': '翻译文章',
        
        // 设置面板
        'settings': '设置',
        'ai_settings': 'AI设置',
        'app_settings': '应用设置',
        'api_provider': 'API提供商',
        'api_key': 'API密钥',
        'summary_length': '摘要长度',
        'short': '简短',
        'medium': '中等',
        'long': '详细',
        'language': '语言',
        'font_size': '字体大小',
        'dark_mode': '暗色模式',
        'save': '保存',
        
        // 消息和通知
        'settings_saved': '设置已保存',
        'api_key_required': '需要API密钥才能使用AI功能',
        'summarization_error': '生成摘要时出错',
        'translation_error': '翻译时出错',
        'source_added': '订阅源已添加',
        'source_removed': '订阅源已删除',
        'connection_error': '连接错误，请检查网络',
        'invalid_url': '无效的URL',
        
        // 新增翻译相关
        'translate_to_chinese': '翻译为中文',
        'translate_to_english': '翻译为英文',
        'language_change_restart': '语言设置已更改，请重启应用以获得最佳体验',
        'save_settings_error': '保存设置失败',
        'app_language': '应用语言',
        'interface_options': '界面选项',
        'close': '关闭',
        'enter_rss_url': '输入 RSS 订阅链接',
        'select_rss_first': '请先选择左侧的RSS源',
        'summary_options': '摘要选项',
        'api_configuration': 'API 配置',
        'summary_language': '摘要语言',
        'auto_language': '自动 (与文章相同)',
        'chinese': '简体中文',
        'english': '英语',
        'model': '模型',
        'anthropic_claude': 'Anthropic Claude',
    },
    'en-US': {
        // Main UI
        'app_title': 'NewsAIo - Intelligent RSS Reader',
        'feed_list': 'Subscriptions',
        'article_list': 'Articles',
        'article_content': 'Article Content',
        'loading': 'Loading...',
        'no_article_selected': 'Please select an article first',
        'no_content': 'This article has no content',
        'read_original': 'Read original in browser',
        'search_placeholder': 'Search articles...',
        'add_source': 'Add Source',
        'remove_source': 'Remove',
        'refresh_all': 'Refresh All',
        
        // AI Summary and Translation
        'ai_summary': 'AI Summary',
        'generate_summary': 'Generate Summary',
        'translation': '中文翻译',
        'english_translation': 'English Translation',
        'auto_summarize': 'Auto Summarize Articles',
        'auto_summarize_desc': 'When enabled, summaries will be generated automatically when you select an article',
        'use_stream_mode': 'Use Streaming Mode',
        'use_stream_mode_desc': 'When enabled, AI-generated text will be displayed character by character with a typing effect',
        'translate_to': 'Translate to',
        'translate_button': 'Translate Article',
        
        // Settings
        'settings': 'Settings',
        'ai_settings': 'AI Settings',
        'app_settings': 'App Settings',
        'api_provider': 'API Provider',
        'api_key': 'API Key',
        'summary_length': 'Summary Length',
        'short': 'Short',
        'medium': 'Medium',
        'long': 'Long',
        'language': 'Language',
        'font_size': 'Font Size',
        'dark_mode': 'Dark Mode',
        'save': 'Save',
        
        // Messages and Notifications
        'settings_saved': 'Settings saved',
        'api_key_required': 'API key is required to use AI features',
        'summarization_error': 'Error generating summary',
        'translation_error': 'Error translating article',
        'source_added': 'Source added',
        'source_removed': 'Source removed',
        'connection_error': 'Connection error, please check your network',
        'invalid_url': 'Invalid URL',
        
        // 新增翻译相关
        'translate_to_chinese': 'Translate to Chinese',
        'translate_to_english': 'Translate to English',
        'language_change_restart': 'Language setting changed, please restart the app for best experience',
        'save_settings_error': 'Failed to save settings',
        'app_language': 'App Language',
        'interface_options': 'Interface Options',
        'close': 'Close',
        'enter_rss_url': 'Enter RSS subscription URL',
        'select_rss_first': 'Please select an RSS source first',
        'summary_options': 'Summary Options',
        'api_configuration': 'API Configuration',
        'summary_language': 'Summary Language',
        'auto_language': 'Auto (Same as article)',
        'chinese': 'Chinese',
        'english': 'English',
        'model': 'Model',
        'anthropic_claude': 'Anthropic Claude',
    }
};

// 获取本地化字符串的函数
function t(key) {
    if (i18n[currentLanguage] && i18n[currentLanguage][key]) {
        return i18n[currentLanguage][key];
    }
    // 如果找不到翻译，返回key
    console.warn(`Missing translation for key: ${key} in language: ${currentLanguage}`);
    return key;
}

// 切换语言的函数
async function switchLanguage(language) {
    if (!i18n[language]) {
        console.error(`Language ${language} is not supported!`);
        return;
    }
    
    currentLanguage = language;
    
    // 更新当前用户设置
    userSettings.language = language;
    try {
        await window.electronAPI.saveSettings(userSettings);
        // 更新UI文本
        updateUILanguage();
        // 显示语言切换通知
        showNotification(t('language_change_restart'));
    } catch (error) {
        console.error("保存语言设置失败:", error);
        showNotification(t('save_settings_error'), "error");
    }
}

// 更新UI文本的函数
function updateUILanguage() {
    console.log("更新UI语言为:", currentLanguage);
    // 更新顶部标题
    document.title = t('app_title');
    
    try {
        // 更新RSS源列表标题
        const rssTitleElement = document.querySelector('.sources-column .column-header h2');
        if (rssTitleElement) {
            rssTitleElement.innerHTML = `<i class="fas fa-rss"></i> ${t('feed_list')}`;
        }
        
        // 更新文章列表标题
        const articlesTitleElement = document.querySelector('.articles-column .column-header h2');
        if (articlesTitleElement) {
            articlesTitleElement.innerHTML = `<i class="fas fa-newspaper"></i> ${t('article_list')}`;
        }
        
        // 更新文章内容标题
        const contentTitleElement = document.querySelector('.content-column .column-header h2');
        if (contentTitleElement) {
            contentTitleElement.innerHTML = `<i class="fas fa-book-open"></i> ${t('article_content')}`;
        }
        
        // 更新按钮标题属性
        const addRssButton = document.getElementById('add-rss-button');
        if (addRssButton) {
            addRssButton.title = t('add_source');
        }
        
        const generateSummaryButton = document.getElementById('generate-summary-button');
        if (generateSummaryButton) {
            generateSummaryButton.title = t('generate_summary');
        }
        
        // 更新添加订阅框
        const modalTitle = document.querySelector('#add-feed-modal .modal-content h2');
        if (modalTitle) {
            modalTitle.innerHTML = `<i class="fas fa-rss"></i> ${t('add_source')}`;
        }
        
        const rssUrlInput = document.getElementById('rss-url-input');
        if (rssUrlInput) {
            rssUrlInput.placeholder = t('enter_rss_url');
        }
        
        const submitRssButton = document.getElementById('submit-rss-button');
        if (submitRssButton) {
            submitRssButton.innerHTML = `<i class="fas fa-plus"></i> ${t('add_source')}`;
        }
        
        // 更新空状态消息
        const emptyStates = document.querySelectorAll('.empty-state');
        emptyStates.forEach(el => {
            if (el.parentElement.id === 'articles-container') {
                el.textContent = t('select_rss_first');
            } else if (el.parentElement.id === 'article-container') {
                el.textContent = t('no_article_selected');
            }
        });
        
        // 更新设置面板
        updateSettingsPanels();
        
        // 更新翻译下拉菜单
        const languageDropdown = document.querySelector('.dropdown-content');
        if (languageDropdown) {
            const links = languageDropdown.querySelectorAll('a');
            if (links.length >= 2) {
                links[0].textContent = t('translate_to_chinese');
                links[1].textContent = t('translate_to_english');
            }
        }
    } catch (error) {
        console.error("UI语言更新错误:", error);
    }
}

// 更新设置面板的翻译
function updateSettingsPanels() {
    // AI设置面板
    const aiSettingsHeader = document.querySelector('#ai-settings-panel .settings-header h3');
    if (aiSettingsHeader) {
        aiSettingsHeader.innerHTML = `<i class="fas fa-robot"></i> ${t('ai_settings')}`;
    }
    
    const closeAiSettings = document.getElementById('close-settings');
    if (closeAiSettings) {
        closeAiSettings.title = t('close');
    }
    
    // 更新AI设置标题
    const aiSettingSections = document.querySelectorAll('#ai-settings-panel .settings-section h4');
    if (aiSettingSections.length >= 2) {
        aiSettingSections[0].textContent = t('summary_options');
        aiSettingSections[1].textContent = t('api_configuration');
    }
    
    // 更新AI设置选项
    const autoSummarizeLabel = document.querySelector('#auto-summarize + .toggle-slider').parentNode.querySelector('.label-text');
    if (autoSummarizeLabel) {
        autoSummarizeLabel.textContent = t('auto_summarize');
    }
    
    const autoSummarizeDesc = document.querySelector('#auto-summarize').parentNode.nextElementSibling;
    if (autoSummarizeDesc && autoSummarizeDesc.classList.contains('setting-description')) {
        autoSummarizeDesc.textContent = t('auto_summarize_desc');
    }
    
    const streamModeLabel = document.querySelector('#stream-mode + .toggle-slider').parentNode.querySelector('.label-text');
    if (streamModeLabel) {
        streamModeLabel.textContent = t('use_stream_mode');
    }
    
    const streamModeDesc = document.querySelector('#stream-mode').parentNode.nextElementSibling;
    if (streamModeDesc && streamModeDesc.classList.contains('setting-description')) {
        streamModeDesc.textContent = t('use_stream_mode_desc');
    }
    
    // 更新下拉菜单标签
    const summaryLanguageLabel = document.querySelector('label[for="summary-language"]');
    if (summaryLanguageLabel) {
        summaryLanguageLabel.textContent = t('summary_language');
    }
    
    const summaryLengthLabel = document.querySelector('label[for="summary-length"]');
    if (summaryLengthLabel) {
        summaryLengthLabel.textContent = t('summary_length');
    }
    
    // 更新下拉菜单选项
    const summaryLanguageSelect = document.getElementById('summary-language');
    if (summaryLanguageSelect) {
        const options = summaryLanguageSelect.options;
        options[0].textContent = t('auto_language');
        options[1].textContent = t('chinese');
        options[2].textContent = t('english');
    }
    
    const summaryLengthSelect = document.getElementById('summary-length');
    if (summaryLengthSelect) {
        const options = summaryLengthSelect.options;
        options[0].textContent = t('short');
        options[1].textContent = t('medium');
        options[2].textContent = t('long');
    }
    
    // 更新API提供商标题
    document.querySelectorAll('.api-provider .provider-header h5').forEach(title => {
        if (title.textContent.includes('OpenAI')) {
            title.innerHTML = title.innerHTML.replace(/OpenAI/g, 'OpenAI');
        } else if (title.textContent.includes('DeepSeek')) {
            title.innerHTML = title.innerHTML.replace(/DeepSeek/g, 'DeepSeek');
        } else if (title.textContent.includes('Anthropic')) {
            title.innerHTML = title.innerHTML.replace(/Anthropic Claude/g, t('anthropic_claude'));
        }
    });
    
    // 更新API设置标签
    document.querySelectorAll('.api-provider .setting-item label').forEach(label => {
        if (label.textContent.includes('API Key')) {
            label.textContent = t('api_key');
        } else if (label.textContent.includes('模型')) {
            label.textContent = t('model');
        }
    });
    
    // 更新保存按钮
    const saveApiSettings = document.getElementById('save-api-settings');
    if (saveApiSettings) {
        saveApiSettings.innerHTML = `<i class="fas fa-save"></i> ${t('save')}`;
    }
    
    // 应用设置面板
    const appSettingsHeader = document.querySelector('#app-settings-panel .settings-header h3');
    if (appSettingsHeader) {
        appSettingsHeader.innerHTML = `<i class="fas fa-cog"></i> ${t('app_settings')}`;
    }
    
    const closeAppSettings = document.getElementById('close-app-settings');
    if (closeAppSettings) {
        closeAppSettings.title = t('close');
    }
    
    // 更新应用设置标题
    const appSettingSections = document.querySelectorAll('#app-settings-panel .settings-section h4');
    if (appSettingSections.length > 0) {
        appSettingSections[0].textContent = t('interface_options');
    }
    
    // 更新应用设置选项
    const appLanguageLabel = document.querySelector('label[for="app-language"]');
    if (appLanguageLabel) {
        appLanguageLabel.textContent = t('app_language');
    }
    
    const fontScaleLabel = document.querySelector('label[for="font-scale-setting"]');
    if (fontScaleLabel) {
        fontScaleLabel.textContent = t('font_size');
    }
    
    const darkModeLabel = document.querySelector('#dark-mode-setting + .toggle-slider').parentNode.querySelector('.label-text');
    if (darkModeLabel) {
        darkModeLabel.textContent = t('dark_mode');
    }
    
    // 更新语言选择下拉菜单
    const appLanguageSelect = document.getElementById('app-language');
    if (appLanguageSelect) {
        const options = appLanguageSelect.options;
        options[0].textContent = '简体中文';
        options[1].textContent = 'English';
    }
    
    // 更新保存按钮
    const saveAppSettings = document.getElementById('save-app-settings');
    if (saveAppSettings) {
        saveAppSettings.innerHTML = `<i class="fas fa-save"></i> ${t('save')}`;
    }
}

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
    
    // 初始化变量
    window.rssSources = [];
    window.currentArticles = [];
    window.currentArticleData = null;
    window.currentRssUrl = null;
    window.currentArticleIndex = null;
    window.streamedSummary = '';
    window.userSettings = {
        darkMode: false,
        fontScale: 1,
        autoSummarize: false,
        useStreamMode: true,
        language: 'zh-CN'
    };
    
    // 启动时加载设置
    loadSettings();
    loadApiSettings();
    
    // 启动时加载RSS源
    loadRssSources();
    
    // 初始化AI设置面板和应用设置面板
    initAISettingsPanel();
    initAppSettingsPanel();
    
    // ============= AI设置面板 =============
    
    // 加载设置到界面
    function applySettingsToUI() {
        autoSummarizeToggle.checked = userSettings.autoSummarize;
        streamModeToggle.checked = userSettings.useStreamMode;
        summaryLanguageSelect.value = userSettings.summaryLanguage;
        summaryLengthSelect.value = userSettings.summaryLength;
        
        // 设置字体大小
        document.documentElement.style.fontSize = userSettings.fontScale + 'em';
        
        // 设置暗色模式
        if (userSettings.darkMode) {
            document.body.classList.add('dark-mode');
            document.documentElement.classList.add('dark');
        } else {
            document.body.classList.remove('dark-mode');
            document.documentElement.classList.remove('dark');
        }
        
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
        // 如果没有传入文章，使用当前显示的文章
        if (!article) {
            if (currentArticleData) {
                article = currentArticleData;
            } else {
                showNotification(t("no_article_selected"), "error");
                return;
            }
        }
        
        // 检查是否有API密钥
        const provider = apiSettings.activeProvider;
        const apiKey = apiSettings.providers[provider].apiKey;
        
        if (!apiKey) {
            showNotification(t("api_key_required"), "error");
            aiSettingsPanel.classList.add("active");
            return;
        }
        
        // 获取文章内容 - 修复：确保能够获取到文章内容
        const content = article.content || article.contentSnippet || article.description;
        if (!content || content.trim() === "") {
            showNotification(t("no_content"), "error");
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
                <h3 class="ai-summary-title"><i class="fas fa-robot"></i> ${t('ai_summary')}</h3>
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
            const settings = await window.electronAPI.loadSettings();
            userSettings = { ...userSettings, ...settings };
            
            // 设置当前语言
            if (userSettings.language) {
                currentLanguage = userSettings.language;
                console.log("从设置加载语言:", currentLanguage);
            }
            
            // 应用设置到UI
            applySettingsToUI();
            
            // 更新UI语言
            updateUILanguage();
            
            return userSettings;
        } catch (error) {
            console.error("加载设置失败:", error);
            return userSettings;
        }
    }
    
    // 保存用户设置
    async function saveSettings() {
        try {
            await window.electronAPI.saveSettings(userSettings);
            showNotification(t('settings_saved'));
            return true;
        } catch (error) {
            console.error("保存设置失败:", error);
            showNotification(t('save_settings_error'), "error");
            return false;
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
    
    // 辅助函数：获取文章内容，处理可能的空内容情况
    function getArticleContent(article) {
        // 尝试获取文章内容
        let content = article.content || article.contentSnippet || article.description || '';
        
        // 如果内容为空
        if (!content || content.trim() === '') {
            return `<p class="empty-state">${t('no_content')}</p>`;
        }
        
        return content;
    }
    
    // 修改显示文章内容的函数，添加自动摘要和滚动到顶部
    function displayArticleContent(article) {
        // 重置滚动位置到顶部
        articleContainer.scrollTop = 0;
        
        // 显示"加载中..."
        articleContainer.innerHTML = `<div class="loading-message">${t('loading')}</div>`;
        
        // 检查是否有文章
        if (!article) {
            resetArticleContent();
            return;
        }
        
        // 保存当前文章的引用
        currentArticleData = article;
        currentArticleIndex = currentArticles.indexOf(article);
        
        // 准备文章内容HTML
        let contentHtml = '';
        
        // 1. 文章标题和日期
        const pubDate = article.pubDate ? new Date(article.pubDate).toLocaleString() : '';
        contentHtml += `<div class="article-header">
            <h2 class="article-title">${article.title}</h2>
            <div class="article-date">${pubDate}</div>
        </div>`;
        
        // 2. AI摘要区域(如果存在)
        if (article.summary) {
            contentHtml += `
            <div class="ai-summary ${article.summaryIsStreaming ? 'streaming' : ''}" style="font-size: inherit;">
                <div class="ai-summary-header">
                    <h4 class="ai-summary-title"><i class="fas fa-robot"></i> ${t('ai_summary')}</h4>
                </div>
                <div class="summary-content ${article.summaryIsStreaming ? 'streaming-content' : ''}" style="font-size: inherit;">
                    ${article.summary}
                </div>
            </div>`;
        }
        
        // 3. 翻译区域(如果存在)
        if (article.translation) {
            const translationTitle = article.translationLanguage === 'zh-CN' ? t('translation') : t('english_translation');
            contentHtml += `
            <div class="translation-content" style="font-size: inherit;">
                <h4 class="translation-header"><i class="fas fa-language"></i> ${translationTitle}</h4>
                <div class="${article.translationIsStreaming ? 'streaming-content' : ''}" style="font-size: inherit;">
                    ${article.translation}
                </div>
            </div>`;
        }
        
        // 4. 文章主要内容
        contentHtml += `<div class="article-content" style="font-size: inherit;">${getArticleContent(article)}</div>`;
        
        // 5. "阅读原文"链接
        if (article.link) {
            contentHtml += `
            <div class="read-more" style="font-size: inherit;">
                <a href="#" onclick="window.electronAPI.openExternal('${article.link}'); return false;">
                    <i class="fas fa-external-link-alt"></i> ${t('read_original')}
                </a>
            </div>`;
        }
        
        // 设置内容并更新标题
        articleContainer.innerHTML = contentHtml;
        document.getElementById('content-header').innerHTML = `<i class="fas fa-book-open"></i> ${t('article_content')}`;
        
        // 确保所有内容区域都继承字体大小
        const contentElements = articleContainer.querySelectorAll('.article-content, .ai-summary, .translation-content');
        contentElements.forEach(element => {
            element.style.fontSize = 'inherit';
        });
        
        // 确保再次滚动到顶部
        setTimeout(() => {
            articleContainer.scrollTop = 0;
        }, 100);
    }
    
    // 重置文章内容
    function resetArticleContent(message = null) {
        if (!message) {
            message = t('no_article_selected');
        }
        articleContainer.innerHTML = `<p class="empty-state">${message}</p>`;
        document.getElementById('content-header').innerHTML = `<i class="fas fa-book-open"></i> ${t('article_content')}`;
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

    // 初始化应用设置面板
    function initAppSettingsPanel() {
        console.log("初始化应用设置面板");
        
        const appSettingsPanel = document.getElementById('app-settings-panel');
        const appSettingsToggle = document.getElementById('app-settings-toggle');
        const closeAppSettings = document.getElementById('close-app-settings');
        const appLanguageSelect = document.getElementById('app-language');
        const fontScaleSetting = document.getElementById('font-scale-setting');
        const fontScaleValue = document.getElementById('font-scale-value');
        const darkModeSetting = document.getElementById('dark-mode-setting');
        const saveAppSettingsBtn = document.getElementById('save-app-settings');
        
        // 打开应用设置面板
        appSettingsToggle.addEventListener('mousedown', function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            appSettingsPanel.classList.add('active');
            
            // 设置当前值
            appLanguageSelect.value = userSettings.language || 'zh-CN';
            fontScaleSetting.value = userSettings.fontScale || 1;
            fontScaleValue.textContent = userSettings.fontScale || 1;
            darkModeSetting.checked = userSettings.darkMode || false;
        });
        
        // 关闭应用设置面板
        closeAppSettings.addEventListener('mousedown', function(e) {
            e.stopPropagation();
            appSettingsPanel.classList.remove('active');
        });
        
        // 点击面板外关闭
        document.addEventListener('mousedown', function(e) {
            if (appSettingsPanel.classList.contains('active') && 
                !appSettingsPanel.contains(e.target) && 
                e.target !== appSettingsToggle) {
                appSettingsPanel.classList.remove('active');
            }
        });
        
        // 字体大小滑块变化
        fontScaleSetting.addEventListener('input', function() {
            const newSize = this.value;
            fontScaleValue.textContent = newSize;
            
            // 设置根元素的字体大小
            document.documentElement.style.fontSize = newSize + 'em';
            
            // 强制更新文章内容区域的字体大小
            const articleContent = document.querySelector('.article-content');
            if (articleContent) {
                articleContent.style.fontSize = 'inherit';
            }
            
            // 强制更新AI摘要区域的字体大小
            const aiSummary = document.querySelector('.ai-summary');
            if (aiSummary) {
                aiSummary.style.fontSize = 'inherit';
            }
            
            // 强制更新翻译区域的字体大小
            const translationContent = document.querySelector('.translation-content');
            if (translationContent) {
                translationContent.style.fontSize = 'inherit';
            }
        });
        
        // 保存应用设置
        saveAppSettingsBtn.addEventListener('mousedown', async function(e) {
            e.stopPropagation();
            
            try {
                const newSettings = {
                    ...userSettings,
                    language: appLanguageSelect.value,
                    fontScale: parseFloat(fontScaleSetting.value),
                    darkMode: darkModeSetting.checked
                };
                
                // 检查语言是否改变
                const languageChanged = userSettings.language !== newSettings.language;
                
                // 保存设置
                userSettings = newSettings;
                await saveSettings();
                
                // 应用设置
                if (languageChanged) {
                    // 切换语言
                    await switchLanguage(userSettings.language);
                    showNotification(t('settings_saved') + ' - ' + t('language_change_restart'));
                } else {
                    // 应用其他设置
                    document.documentElement.style.fontSize = userSettings.fontScale + 'em';
                    if (userSettings.darkMode) {
                        document.body.classList.add('dark-mode');
                        document.documentElement.classList.add('dark');
                    } else {
                        document.body.classList.remove('dark-mode');
                        document.documentElement.classList.remove('dark');
                    }
                    
                    showNotification(t('settings_saved'));
                }
                
                // 关闭设置面板
                appSettingsPanel.classList.remove('active');
            } catch (error) {
                console.error('保存应用设置失败:', error);
                showNotification(t('save_settings_error'), 'error');
            }
        });
    }

    // 加载设置并应用语言
    loadSettings().then(() => {
        // 应用当前语言设置
        currentLanguage = userSettings.language || 'zh-CN';
        updateUILanguage();
    });
}); 