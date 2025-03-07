// ============= 语言本地化系统 =============

// 默认语言设置
let currentLanguage = 'zh-CN'; // 默认为中文

// 本地化字符串
const i18n = {
    'zh-CN': {
        // 应用程序主要UI
        'app_title': 'News AIo',
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
        'language_toggle': '语言转换',
        'input_api_key_here': '输入API密钥',
        'select_model': '选择模型',
        'loading_sources': '加载订阅源...',
        'loading_articles': '加载文章...',
        'loading_content': '加载内容...',
        'generating_summary': '正在生成摘要...',
        'translating': '正在翻译...',
        'settings_title': '设置',
        'missing_api_config': '未选择API提供商或API设置不完整',
        'missing_api_key': '缺少API密钥',
        'open_ai_settings_prompt': '未配置API设置，是否要打开设置面板？',
        'back_to_article': '返回文章'
    },
    'en-US': {
        // Main UI
        'app_title': 'News AIo',
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
        'language_toggle': 'Language Translation',
        'input_api_key_here': 'Enter API Key here',
        'select_model': 'Select Model',
        'loading_sources': 'Loading sources...',
        'loading_articles': 'Loading articles...',
        'loading_content': 'Loading content...',
        'generating_summary': 'Generating summary...',
        'translating': 'Translating...',
        'settings_title': 'Settings',
        'missing_api_config': 'API provider not configured',
        'missing_api_key': 'API key missing',
        'open_ai_settings_prompt': 'API not configured, do you want to open settings panel?',
        'back_to_article': 'Back to Article'
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
        
        // 更新所有图标按钮的tooltip
        const appSettingsToggle = document.getElementById('app-settings-toggle');
        if (appSettingsToggle) {
            appSettingsToggle.title = t('app_settings');
        }
        
        const aiSettingsToggle = document.getElementById('ai-settings-toggle');
        if (aiSettingsToggle) {
            aiSettingsToggle.title = t('ai_settings');
        }
        
        const languageToggle = document.getElementById('language-toggle');
        if (languageToggle) {
            languageToggle.title = t('language_toggle');
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
        if (label.textContent.includes('API Key') || label.textContent.includes('API密钥')) {
            label.textContent = t('api_key');
        } else if (label.textContent.includes('模型') || label.textContent.includes('Model')) {
            label.textContent = t('model');
        }
    });
    
    // 更新API密钥输入框的占位符
    document.querySelectorAll('.api-provider input[type="password"]').forEach(input => {
        input.placeholder = t('input_api_key_here');
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

// 添加检测系统主题并应用的函数
function detectAndApplySystemTheme() {
    try {
        // 使用媒体查询检测系统颜色方案
        const prefersDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
        console.log("系统主题检测:", prefersDarkMode ? "深色模式" : "浅色模式");
        
        // 设置应用主题
        document.documentElement.classList.toggle('dark', prefersDarkMode);
        
        // 更新用户设置
        userSettings.darkMode = prefersDarkMode;
        
        // 更新深色模式开关的状态
        const darkModeCheckbox = document.getElementById('dark-mode-setting');
        if (darkModeCheckbox) {
            darkModeCheckbox.checked = prefersDarkMode;
        }
        
        return prefersDarkMode;
    } catch (error) {
        console.error("检测系统主题失败:", error);
        return false;
    }
}

// 添加系统主题变化的监听器
function setupThemeListener() {
    try {
        // 监听系统主题变化
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        
        // 添加事件监听器 (使用新API)
        if (darkModeMediaQuery.addEventListener) {
            darkModeMediaQuery.addEventListener('change', (e) => {
                const newDarkMode = e.matches;
                console.log("系统主题变化:", newDarkMode ? "深色模式" : "浅色模式");
                document.documentElement.classList.toggle('dark', newDarkMode);
                
                // 更新用户设置
                userSettings.darkMode = newDarkMode;
                
                // 更新深色模式开关的状态
                const darkModeCheckbox = document.getElementById('dark-mode-setting');
                if (darkModeCheckbox) {
                    darkModeCheckbox.checked = newDarkMode;
                }
                
                // 可选: 保存用户设置
                saveSettings();
            });
        } else if (darkModeMediaQuery.addListener) {
            // 旧版浏览器兼容 (Safari 13.0及以下)
            darkModeMediaQuery.addListener((e) => {
                const newDarkMode = e.matches;
                document.documentElement.classList.toggle('dark', newDarkMode);
                userSettings.darkMode = newDarkMode;
                
                const darkModeCheckbox = document.getElementById('dark-mode-setting');
                if (darkModeCheckbox) {
                    darkModeCheckbox.checked = newDarkMode;
                }
                
                saveSettings();
            });
        }
    } catch (error) {
        console.error("设置主题监听器失败:", error);
    }
}

// 全局UI元素引用
let rssSourcesList;
let sourcesLoader;
let articlesContainer;
let articleContainer;
let aiSettingsPanel;
let appSettingsPanel;

// 初始化UI组件
function initUI() {
    console.log("初始化UI...");
    
    // 设置默认的字体大小
    document.body.style.fontSize = '1em';
    
    // 一次性初始化所有面板，避免多重初始化
    if (typeof initAISettingsPanel === 'function') {
        initAISettingsPanel();
    }
    
    if (typeof initAppSettingsPanel === 'function') {
        initAppSettingsPanel();
    }
    
    // 初始化UI控制按钮
    setupUiControlButtons();
    
    // 初始化API设置
    if (typeof loadApiSettings === 'function') {
        loadApiSettings();
    }
    
    console.log("UI初始化完成");
}

// 绑定事件监听器
function bindEventListeners() {
    console.log("绑定事件监听器...");
    
    // 注意：设置面板按钮在各自的初始化函数中处理，这里不再重复绑定
    // 以避免事件监听器冲突
    
    // Add RSS source button
    const addRssButton = document.getElementById('add-rss-button');
    if (addRssButton) {
        addRssButton.addEventListener('click', () => {
            const modal = document.getElementById('add-feed-modal');
            if (modal) modal.style.display = 'flex';
        });
    }
    
    // 提交RSS按钮
    const submitRssButton = document.getElementById('submit-rss-button');
    if (submitRssButton) {
        submitRssButton.addEventListener('click', async () => {
            const input = document.getElementById('rss-url-input');
            if (input && input.value.trim()) {
                try {
                    await window.electronAPI.addRssSource(input.value.trim());
                    input.value = '';
                    
                    // 关闭模态框
                    const modal = document.getElementById('add-feed-modal');
                    if (modal) modal.style.display = 'none';
                    
                    // 重新加载RSS源
                    loadRssSources();
                    
                    showNotification(t('source_added'));
                } catch (error) {
                    console.error("添加RSS源失败:", error);
                    showNotification(t('connection_error'), "error");
                }
            } else {
                showNotification(t('invalid_url'), "error");
            }
        });
    }
    
    // 关闭模态框按钮
    const modalCloseButton = document.getElementById('modal-close-button');
    if (modalCloseButton) {
        modalCloseButton.addEventListener('click', () => {
            const modal = document.getElementById('add-feed-modal');
            if (modal) modal.style.display = 'none';
        });
    }
    
    // 不再重复调用setupUiControlButtons，已在initUI中处理
    
    console.log("事件监听器绑定完成");
}

// 直接添加全局UI元素点击处理函数
function setupUiControlButtons() {
    console.log("设置UI控制按钮...");
    
    // 如果按钮已经初始化，则不再添加监听器
    if (window.uiButtonsInitialized) {
        console.log("UI按钮已初始化，不再添加事件监听器");
        return;
    }
    
    window.uiButtonsInitialized = true;
    
    // 注意：设置面板按钮在各自的初始化函数中处理，这里不再重复绑定
    // 以避免事件监听器冲突
    
    // 3. 生成摘要按钮
    const generateSummaryButton = document.getElementById('generate-summary-button');
    if (generateSummaryButton) {
        generateSummaryButton.addEventListener('click', function() {
            console.log("点击生成摘要按钮");
            if (currentArticleData) {
                generateSummary(currentArticleData);
            } else {
                showNotification(t('no_article_selected'), "error");
            }
        });
        console.log("生成摘要按钮已设置");
    } else {
        console.error("未找到生成摘要按钮");
    }
    
    // 4. 语言切换下拉菜单
    const languageToggle = document.getElementById('language-toggle');
    if (languageToggle) {
        languageToggle.addEventListener('click', function() {
            console.log("点击语言切换按钮");
            const dropdown = document.querySelector('.dropdown-content');
            if (dropdown) {
                dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
            }
        });
    }
    
    // 语言切换项
    const languageDropdownLinks = document.querySelectorAll('.dropdown-content a');
    languageDropdownLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            console.log("点击语言切换选项:", this.getAttribute('data-lang'));
            const targetLanguage = this.getAttribute('data-lang');
            if (currentArticleData) {
                translateArticle(currentArticleData, targetLanguage);
                
                // 隐藏下拉菜单
                const dropdown = document.querySelector('.dropdown-content');
                if (dropdown) dropdown.style.display = 'none';
            } else {
                showNotification(t('no_article_selected'), "error");
            }
        });
    });
    
    // 5. 设置面板关闭按钮
    const closeAiSettings = document.getElementById('close-settings');
    if (closeAiSettings) {
        closeAiSettings.addEventListener('click', function() {
            const panel = document.getElementById('ai-settings-panel');
            if (panel) panel.classList.remove('active');
        });
    }
    
    const closeAppSettings = document.getElementById('close-app-settings');
    if (closeAppSettings) {
        closeAppSettings.addEventListener('click', function() {
            const panel = document.getElementById('app-settings-panel');
            if (panel) panel.classList.remove('active');
        });
    }
    
    console.log("UI控制按钮设置完成");
}

// RSS阅读器主脚本 - 支持三栏布局
document.addEventListener("DOMContentLoaded", function() {
    console.log("DOM内容已加载，开始初始化应用...");
    
    // 立即初始化应用，不使用setTimeout
    initializeApp();
});

// 应用初始化函数
function initializeApp() {
    try {
        console.log("===== 应用初始化开始 =====");
        
        // 创建初始化标志以避免重复初始化
        if (window.isAppInitialized) {
            console.log("应用已经初始化，不重复执行初始化流程");
            return;
        }
        window.isAppInitialized = true;
        
        // 第1步: 检查DOM元素
        window.rssSourcesList = document.getElementById("rss-sources");
        if (!window.rssSourcesList) {
            throw new Error("初始化失败: 无法找到RSS源列表元素");
        }
        
        // 第2步: 检查API是否可用
        if (!window.electronAPI) {
            throw new Error("初始化失败: electronAPI未定义，请检查preload.js是否正确加载");
        }
        
        // 必须API方法检查
        const requiredApiMethods = [
            "getRssSources", "saveRssSources", "fetchRss",
            "addRssSource", "getSettings", "saveSettings"
        ];
        
        const missingMethods = requiredApiMethods.filter(
            method => typeof window.electronAPI[method] !== 'function'
        );
        
        if (missingMethods.length > 0) {
            throw new Error(`初始化失败: 以下API方法缺失: ${missingMethods.join(', ')}`);
        }
        
        console.log("API检查通过: 所有必要的API方法都已定义");
        
        // 第3步: 初始化全局变量
        window.userSettings = {
            darkMode: false,
            fontScale: 1.0,
            autoSummarize: false,
            summaryLanguage: 'auto',
            summaryLength: 'medium',
            useStreamMode: true,
            language: 'zh-CN'
        };
        
        window.apiSettings = {
            activeProvider: "openai",
            providers: {
                openai: { apiKey: "", model: "gpt-3.5-turbo" },
                anthropic: { apiKey: "", model: "claude-3-haiku" },
                deepseek: { apiKey: "", model: "deepseek-chat" }
            }
        };
        
        window.currentFeeds = [];
        window.currentArticles = [];
        window.currentArticleData = null;
        window.currentFeedUrl = null;
        window.currentArticleIndex = -1;
        console.log("全局变量初始化完成");
        
        // 第4步: 设置UI和主题
        initUI();
        detectAndApplySystemTheme();
        setupThemeListener();
        
        // 第5步: 初始化设置面板
        initAISettingsPanel();
        initAppSettingsPanel();
        
        // 第6步: 绑定事件监听器
        bindEventListeners();
        
        console.log("UI和事件绑定完成");
        
        // 第7步: 加载设置 (设置应该在RSS源之前加载)
        loadSettings()
            .then(settings => {
                console.log("用户设置加载完成");
                return loadApiSettings();
            })
            .then(() => {
                console.log("API设置加载完成");
                
                // 第8步: 加载RSS源，同时设置超时处理
                // 设置一个可以清除的超时定时器
                let timeoutId;
                
                const timeoutPromise = new Promise((_, reject) => {
                    timeoutId = setTimeout(() => {
                        window.rssSourcesList.innerHTML = `
                            <div class="error-message">
                                <p>加载RSS源超时</p>
                            </div>
                            <p class="empty-state">点击右上角+添加RSS源</p>
                        `;
                        console.error("RSS源加载超时");
                        reject(new Error("RSS源加载超时"));
                    }, 15000);
                });
                
                // 修改为使用Promise.race，但确保在正常情况下取消定时器
                return Promise.race([
                    loadRssSources().then(result => {
                        clearTimeout(timeoutId); // 成功加载时清除超时定时器
                        return result;
                    }),
                    timeoutPromise
                ]);
            })
            .then(() => {
                console.log("===== 应用初始化完成 =====");
            })
            .catch(error => {
                console.error("应用初始化失败:", error);
                showNotification("应用初始化失败: " + error.message, "error");
                
                // 确保RSS列表不保持加载状态
                if (window.rssSourcesList) {
                    window.rssSourcesList.innerHTML = `
                        <div class="error-message">
                            <p>初始化失败: ${error.message}</p>
                        </div>
                        <p class="empty-state">点击右上角+添加RSS源</p>
                    `;
                }
            });
            
    } catch (error) {
        console.error("应用初始化出现严重错误:", error);
        showNotification("应用初始化失败: " + error.message, "error");
        
        // 确保RSS列表不保持加载状态
        if (window.rssSourcesList) {
            window.rssSourcesList.innerHTML = `
                <div class="error-message">
                    <p>严重错误: ${error.message}</p>
                </div>
                <p class="empty-state">请重启应用</p>
            `;
        }
    }
}

// ============= AI设置面板 =============

// 加载设置到界面
function applySettingsToUI() {
    // 应用深色模式设置
    const darkModeCheckbox = document.getElementById('dark-mode-setting');
    if (darkModeCheckbox) {
        darkModeCheckbox.checked = userSettings.darkMode || false;
        document.documentElement.classList.toggle('dark', userSettings.darkMode);
    }
    
    // 应用字体大小设置
    const fontScaleSlider = document.getElementById('font-scale-setting');
    const fontScaleValue = document.getElementById('font-scale-value');
    if (fontScaleSlider && fontScaleValue) {
        const fontScale = userSettings.fontScale || 1.0;
        fontScaleSlider.value = fontScale;
        fontScaleValue.textContent = fontScale;
        document.body.style.fontSize = `${fontScale}em`;
    }
    
    // 应用语言设置
    const appLanguageSelect = document.getElementById('app-language');
    if (appLanguageSelect) {
        appLanguageSelect.value = userSettings.language || "zh-CN";
    }
    
    // 应用AI设置
    const autoSummarizeToggle = document.getElementById('auto-summarize');
    if (autoSummarizeToggle) {
        autoSummarizeToggle.checked = userSettings.autoSummarize || false;
    }
    
    const streamModeToggle = document.getElementById('stream-mode');
    if (streamModeToggle) {
        streamModeToggle.checked = userSettings.useStreamMode || false;
    }
    
    // 应用摘要语言设置
    const summaryLanguageSelect = document.getElementById('summary-language');
    if (summaryLanguageSelect && userSettings.summaryLanguage) {
        summaryLanguageSelect.value = userSettings.summaryLanguage;
    }
    
    // 应用摘要长度设置
    const summaryLengthSelect = document.getElementById('summary-length');
    if (summaryLengthSelect && userSettings.summaryLength) {
        summaryLengthSelect.value = userSettings.summaryLength;
    }
}

// ============= 摘要和翻译功能 =============

// 生成AI摘要
async function generateSummary(article) {
    console.log("开始生成文章摘要...");
    
    // 检查是否有API密钥
    const provider = apiSettings.activeProvider;
    if (!provider || !apiSettings.providers[provider]) {
        console.error("未选择API提供商或API设置不完整");
        
        // 显示带按钮的通知，让用户选择是否打开设置
        const notificationMessage = t('missing_api_config');
        showNotification(notificationMessage, "warning");
        
        // 询问用户是否要打开设置面板，而不是自动打开
        if (confirm(t('open_ai_settings_prompt'))) {
            // 用户确认后打开AI设置面板
            const aiSettingsPanel = document.getElementById('ai-settings-panel');
            if (aiSettingsPanel) {
                aiSettingsPanel.classList.add("active");
            }
        }
        return;
    }
    
    const apiKey = apiSettings.providers[provider].apiKey;
    if (!apiKey) {
        console.error("缺少API密钥");
        
        // 显示带按钮的通知，让用户选择是否打开设置
        const notificationMessage = t('missing_api_key');
        showNotification(notificationMessage, "warning");
        
        // 询问用户是否要打开设置面板，而不是自动打开
        if (confirm(t('open_ai_settings_prompt'))) {
            // 用户确认后打开AI设置面板
            const aiSettingsPanel = document.getElementById('ai-settings-panel');
            if (aiSettingsPanel) {
                aiSettingsPanel.classList.add("active");
            }
        }
        return;
    }
    
    // 获取文章内容
    const content = article.content || article.contentSnippet || article.description;
    if (!content || content.trim() === "") {
        console.error("文章内容为空");
        showNotification("文章内容为空，无法生成摘要", "error");
        return;
    }
    
    // 如果已经有摘要，先移除
    const existingSummary = document.querySelector(".ai-summary");
    if (existingSummary) {
        existingSummary.remove();
    }
    
    // 创建摘要容器
    const summaryDiv = document.createElement("div");
    summaryDiv.className = "ai-summary";
    summaryDiv.innerHTML = `
        <div class="ai-summary-header">
            <h4 class="ai-summary-title"><i class="fas fa-robot"></i> ${t('ai_summary')}</h4>
            <div class="summary-loading">
                <span class="loading-indicator"></span> ${t('generating_summary')}
            </div>
        </div>
        <div class="summary-text"></div>
    `;
    
    // 添加到文章内容前面
    const articleContentDiv = document.querySelector(".article-content");
    if (articleContentDiv && articleContentDiv.parentNode) {
        articleContentDiv.parentNode.insertBefore(summaryDiv, articleContentDiv);
    } else {
        console.error("无法找到文章内容容器");
        showNotification("无法添加摘要容器", "error");
        return;
    }
    
    // 准备摘要提示词
    let promptLength = "";
    const summaryLength = userSettings.summaryLength || "medium";
    if (summaryLength === "short") {
        promptLength = "2-3句简短";
    } else if (summaryLength === "medium") {
        promptLength = "4-5句适中";
    } else if (summaryLength === "long") {
        promptLength = "6-8句详细";
    } else {
        promptLength = "适中";
    }
    
    // 添加语言指定
    let targetLanguage = null;
    if (userSettings.summaryLanguage && userSettings.summaryLanguage !== 'auto') {
        targetLanguage = userSettings.summaryLanguage === 'zh-CN' ? '中文' : '英语';
    }
    
    // 构建提示词
    const prompt = `用${promptLength}总结以下文章。请专注于主要观点和核心见解：\n\n${content}`;
    
    console.log("使用API提供商:", provider);
    
    try {
        // 根据是否使用流式模式选择不同的处理方法
        if (userSettings.useStreamMode) {
            console.log("使用流式模式生成摘要");
            await handleStreamingSummary(prompt, summaryDiv);
        } else {
            console.log("使用非流式模式生成摘要");
            await handleNormalSummary(prompt, summaryDiv);
        }
    } catch (error) {
        console.error("生成摘要失败:", error);
        showNotification("生成摘要失败: " + error.message, "error");
        
        // 更新界面显示错误
        const summaryLoading = summaryDiv.querySelector(".summary-loading");
        if (summaryLoading) {
            summaryLoading.remove();
        }
        
        const summaryText = summaryDiv.querySelector(".summary-text");
        if (summaryText) {
            summaryText.textContent = "生成摘要失败，请重试或检查API设置";
            summaryText.style.color = "red";
        }
    }
}

// 翻译文章
async function translateArticle(article, targetLanguage) {
    console.log("开始翻译文章...");
    
    // 检查是否有API密钥
    const provider = apiSettings.activeProvider;
    if (!provider || !apiSettings.providers[provider]) {
        console.error("未选择API提供商或API设置不完整");
        showNotification("请先在AI设置中配置API", "error");
        
        // 打开AI设置面板
        const aiSettingsPanel = document.getElementById('ai-settings-panel');
        if (aiSettingsPanel) {
            aiSettingsPanel.classList.add("active");
        }
        return;
    }
    
    const apiKey = apiSettings.providers[provider].apiKey;
    if (!apiKey) {
        console.error("缺少API密钥");
        showNotification("请先在AI设置中配置API密钥", "error");
        
        // 打开AI设置面板
        const aiSettingsPanel = document.getElementById('ai-settings-panel');
        if (aiSettingsPanel) {
            aiSettingsPanel.classList.add("active");
        }
        return;
    }
    
    // 获取文章内容
    const content = article.content || article.contentSnippet || article.description;
    if (!content || content.trim() === "") {
        console.error("文章内容为空");
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
                <span class="loading-indicator"></span> ${t('translating')}
            </div>
        </h4>
        <div class="translation-text"></div>
    `;
    
    // 添加到文章内容区域
    const articleContentDiv = document.querySelector(".article-content");
    if (articleContentDiv && articleContentDiv.parentNode) {
        articleContentDiv.parentNode.insertBefore(translationDiv, articleContentDiv.nextSibling);
    } else {
        console.error("无法找到文章内容容器");
        showNotification("无法添加翻译容器", "error");
        return;
    }
    
    // 准备翻译提示词
    const prompt = `请将以下内容翻译成${targetLanguage === "zh-CN" ? "中文" : "英语"}，保持原文的格式和含义：\n\n${content}`;
    
    console.log("使用API提供商:", provider);
    
    try {
        // 根据是否使用流式模式选择不同的处理方法
        if (userSettings.useStreamMode) {
            console.log("使用流式模式翻译文章");
            await handleStreamingTranslation(prompt, translationDiv, targetLanguage);
        } else {
            console.log("使用非流式模式翻译文章");
            await handleNormalTranslation(prompt, translationDiv, targetLanguage);
        }
    } catch (error) {
        console.error("翻译失败:", error);
        showNotification("翻译失败: " + error.message, "error");
        
        // 更新界面显示错误
        const summaryLoading = translationDiv.querySelector(".summary-loading");
        if (summaryLoading) {
            summaryLoading.remove();
        }
        
        const translationText = translationDiv.querySelector(".translation-text");
        if (translationText) {
            translationText.textContent = "翻译失败，请重试或检查API设置";
            translationText.style.color = "red";
        }
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
        if (window.currentArticleData) {
            window.currentArticleData.summary = streamedContent;
            updateArticleSummary(window.currentFeedUrl, window.currentArticleData);
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
        if (window.currentArticleData) {
            window.currentArticleData.summary = summary;
            updateArticleSummary(window.currentFeedUrl, window.currentArticleData);
        }
        
        showNotification("摘要生成完成");
    } catch (error) {
        console.error("API调用失败:", error);
        throw new Error("无法生成摘要: " + error.message);
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
            articleIndex: window.currentArticleIndex,
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
        userSettings = { ...userSettings, ...settings };
        
        // 如果没有显式保存过深色模式设置，则检测并应用系统主题
        if (userSettings.darkMode === undefined) {
            detectAndApplySystemTheme();
        } else {
            // 应用已保存的设置
            document.documentElement.classList.toggle('dark', userSettings.darkMode);
        }
        
        // 设置语言
        if (userSettings.language) {
            // 如果用户已经设置过语言偏好，使用保存的设置
            currentLanguage = userSettings.language;
            console.log("使用用户保存的语言设置:", currentLanguage);
        } else {
            // 如果用户未设置语言偏好，则获取系统语言
            try {
                const systemLanguage = await window.electronAPI.getSystemLanguage();
                currentLanguage = systemLanguage;
                userSettings.language = systemLanguage; // 保存到用户设置中
                console.log("检测到系统语言，设置为:", currentLanguage);
                // 保存设置
                await window.electronAPI.saveSettings(userSettings);
            } catch (error) {
                console.error("获取系统语言失败，使用默认语言:", error);
                // 保持默认语言
            }
        }
        
        // 应用设置到UI
        applySettingsToUI();
        
        // 更新UI语言
        updateUILanguage();
        
        // 设置系统主题监听器
        setupThemeListener();
        
        return userSettings;
    } catch (error) {
        console.error("加载设置失败:", error);
        
        // 即使加载设置失败，仍然尝试应用系统主题并设置监听器
        detectAndApplySystemTheme();
        setupThemeListener();
        
        // 尝试获取系统语言
        try {
            const systemLanguage = await window.electronAPI.getSystemLanguage();
            currentLanguage = systemLanguage;
            console.log("设置失败，但检测到系统语言，设置为:", currentLanguage);
            updateUILanguage();
        } catch (langError) {
            console.error("获取系统语言失败:", langError);
            // 保持默认语言，并更新UI
            updateUILanguage();
        }
        
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
    console.log("===== 开始加载RSS源 =====");
    
    // 检查DOM元素
    if (!window.rssSourcesList) {
        window.rssSourcesList = document.getElementById("rss-sources");
        if (!window.rssSourcesList) {
            console.error("严重错误: RSS源列表元素未找到");
            return [];
        }
    }

    // 显示加载状态
    window.rssSourcesList.innerHTML = '<div class="loader"><span class="loading-indicator"></span> 加载订阅源...</div>';
    
    try {
        // 检查API是否可用
        if (!window.electronAPI || typeof window.electronAPI.getRssSources !== 'function') {
            throw new Error("API未初始化");
        }
        
        console.log("调用IPC API: getRssSources()");
        
        // 调用API获取RSS源
        let sources = null;
        try {
            sources = await window.electronAPI.getRssSources();
            console.log("API返回数据:", sources);
        } catch (apiError) {
            console.error("API调用失败:", apiError);
            throw new Error(`获取RSS源失败: ${apiError.message}`);
        }
        
        // 验证返回数据
        if (!sources) {
            console.log("API返回空数据，使用空数组作为后备");
            sources = [];
        }
        
        // 确保sources是数组
        if (!Array.isArray(sources)) {
            console.error("API返回的不是数组:", typeof sources);
            sources = Array.isArray(sources) ? sources : [];
        }
        
        // 保存到全局变量
        window.currentFeeds = sources;
        
        // 渲染RSS源列表
        renderRssSources(sources);
        
        console.log(`===== RSS源加载完成，共 ${sources.length} 个订阅源 =====`);
        return sources;
    } catch (error) {
        console.error("加载RSS源出错:", error);
        
        // 显示错误状态
        window.rssSourcesList.innerHTML = `
            <div class="error-message">
                <p>加载RSS源失败: ${error.message}</p>
            </div>
            <p class="empty-state">点击右上角+添加订阅源</p>
        `;
        
        showNotification(`RSS源加载失败: ${error.message}`, "error");
        
        // 返回空数组作为后备
        return [];
    }
}

// 渲染RSS源列表
function renderRssSources(sources) {
    console.log("渲染RSS源列表...");
    
    // 再次确认DOM元素存在
    if (!window.rssSourcesList) {
        window.rssSourcesList = document.getElementById("rss-sources");
        if (!window.rssSourcesList) {
            console.error("无法渲染RSS源: 列表元素未找到");
            return;
        }
    }
    
    // 如果传入的sources不是数组或为空，显示空状态
    if (!sources || !Array.isArray(sources) || sources.length === 0) {
        console.log("没有RSS源可显示，显示空状态");
        window.rssSourcesList.innerHTML = `
            <div class="empty-state">
                <i class="fas fa-rss-square"></i>
                <p>暂无订阅源</p>
                <p>点击右上角 + 添加</p>
            </div>
        `;
        return;
    }
    
    try {
        // 生成源列表HTML
        console.log(`生成${sources.length}个RSS源的HTML`);
        let html = '';
        
        sources.forEach((source, index) => {
            // 确保源有标题
            const title = source.title || source.url || '未命名订阅源';
            
            html += `
                <li class="source-item" data-url="${source.url}" data-index="${index}">
                    <i class="fas fa-rss"></i> ${title}
                </li>
            `;
        });
        
        // 更新DOM
        window.rssSourcesList.innerHTML = html;
        
        // 添加点击事件
        const sourceItems = document.querySelectorAll(".source-item");
        if (sourceItems.length > 0) {
            console.log(`为${sourceItems.length}个源项添加点击事件`);
            sourceItems.forEach(item => {
                item.addEventListener("click", handleSourceClick);
            });
            
            // 可选: 自动选择第一个源
            if (sources.length > 0) {
                setTimeout(() => {
                    const firstSource = document.querySelector(".source-item");
                    if (firstSource) {
                        console.log("自动选择第一个源");
                        firstSource.click();
                    }
                }, 100);
            }
        } else {
            console.warn("渲染后未找到源项元素");
        }
    } catch (error) {
        console.error("渲染RSS源列表时出错:", error);
        window.rssSourcesList.innerHTML = `
            <div class="error-message">
                <p>渲染RSS源列表失败: ${error.message}</p>
            </div>
            <p class="empty-state">点击右上角+添加订阅源</p>
        `;
    }
}

// 处理RSS源点击事件
async function handleSourceClick(e) {
    try {
        const sourceItem = e.currentTarget;
        const sourceUrl = sourceItem.dataset.url;
        const sourceIndex = parseInt(sourceItem.dataset.index);
        
        // 不重复加载相同的源
        if (sourceUrl === window.currentFeedUrl) return;
        
        console.log(`选择RSS源: ${sourceUrl}`);
        
        // 更新当前源URL
        window.currentFeedUrl = sourceUrl;
        
        // 添加选中状态
        document.querySelectorAll(".source-item").forEach(item => {
            item.classList.remove("selected");
        });
        sourceItem.classList.add("selected");
        
        // 获取文章列表容器和头部元素
        if (!articlesContainer) {
            articlesContainer = document.getElementById("articles-container");
        }
        
        // 获取文章标题元素
        const articlesHeader = document.getElementById("articles-header");
        
        // 确保容器存在
        if (!articlesContainer) {
            console.error("文章列表容器未找到");
            showNotification("无法显示文章列表", "error");
            return;
        }
        
        // 显示加载中
        articlesContainer.innerHTML = '<div class="loader"><span class="loading-indicator"></span> 加载文章中...</div>';
        
        // 更新标题（如果存在）
        if (articlesHeader) {
            articlesHeader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 加载中...';
        }
        
        // 确保文章显示容器已初始化
        if (!articleContainer) {
            articleContainer = document.getElementById("article-container");
        }
        
        // 重置文章内容
        resetArticleContent();
        
        console.log("开始获取RSS内容:", sourceUrl);
        
        // 添加超时处理
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => reject(new Error("加载文章超时，请检查网络连接")), 15000);
        });
        
        // 获取RSS内容
        const feed = await Promise.race([
            window.electronAPI.fetchRss(sourceUrl),
            timeoutPromise
        ]);
        
        console.log(`获取到 ${feed && feed.items ? feed.items.length : 0} 篇文章`);
        
        if (!feed || !feed.items) {
            throw new Error("无法解析RSS内容");
        }
        
        // 保存文章列表
        window.currentArticles = feed.items || [];
        
        // 更新标题
        if (articlesHeader) {
            articlesHeader.innerHTML = `<i class="fas fa-newspaper"></i> ${feed.title || '文章列表'}`;
        }
        
        // 渲染文章列表
        renderArticlesList(window.currentArticles);
        
        // 如果有文章，默认选中第一篇
        if (window.currentArticles.length > 0) {
            const firstArticle = document.querySelector(".article-item");
            if (firstArticle) {
                firstArticle.click();
            }
        }
    } catch (error) {
        console.error("加载RSS文章失败:", error);
        
        if (articlesContainer) {
            articlesContainer.innerHTML = `<div class="error-message">加载文章失败: ${error.message}</div>`;
        }
        
        const articlesHeader = document.getElementById("articles-header");
        if (articlesHeader) {
            articlesHeader.innerHTML = `<i class="fas fa-exclamation-triangle"></i> 加载失败`;
        }
        
        showNotification("加载文章失败: " + error.message, "error");
    }
}

// ============= 文章列表处理 =============

// 渲染文章列表
function renderArticlesList(articles) {
    console.log("渲染文章列表");
    
    // 确保文章容器已获取
    if (!articlesContainer) {
        articlesContainer = document.getElementById("articles-container");
        if (!articlesContainer) {
            console.error("无法找到文章列表容器");
            return;
        }
    }
    
    // 检查文章数组
    if (!articles || !Array.isArray(articles) || articles.length === 0) {
        articlesContainer.innerHTML = '<p class="empty-state">该源没有文章</p>';
        return;
    }
    
    // 构建文章列表HTML
    let html = '<ul>';
    articles.forEach((article, index) => {
        // 确保日期格式化正确
        let pubDate = '';
        if (article.pubDate) {
            try {
                pubDate = new Date(article.pubDate).toLocaleString();
            } catch (e) {
                console.warn("日期格式化失败:", e);
                pubDate = article.pubDate;
            }
        }
        
        // 构建文章项
        html += `
            <li class="article-item" data-index="${index}">
                <div class="article-title">${article.title || '无标题'}</div>
                <small>${pubDate}</small>
            </li>
        `;
    });
    html += '</ul>';
    
    // 更新DOM
    articlesContainer.innerHTML = html;
    
    // 添加点击事件
    console.log("为文章项添加点击事件");
    document.querySelectorAll(".article-item").forEach(item => {
        item.addEventListener("click", handleArticleClick);
    });
}

// 处理文章点击事件
function handleArticleClick(e) {
    try {
        const articleItem = e.currentTarget;
        const articleIndex = parseInt(articleItem.dataset.index);
        
        console.log(`选择文章: index=${articleIndex}`);
        
        // 验证索引
        if (isNaN(articleIndex) || articleIndex < 0 || articleIndex >= window.currentArticles.length) {
            console.error("无效的文章索引:", articleIndex);
            showNotification("无法显示文章内容", "error");
            return;
        }
        
        // 添加选中状态
        document.querySelectorAll(".article-item").forEach(item => {
            item.classList.remove("selected");
        });
        articleItem.classList.add("selected");
        
        // 获取文章数据
        const article = window.currentArticles[articleIndex];
        window.currentArticleIndex = articleIndex;
        
        console.log("获取到文章数据:", article.title);
        
        // 确保文章容器已初始化
        if (!articleContainer) {
            articleContainer = document.getElementById("article-container");
            if (!articleContainer) {
                console.error("无法找到文章内容容器");
                showNotification("无法显示文章内容", "error");
                return;
            }
        }
        
        // 显示文章内容
        displayArticleContent(article);
        
        // 如果启用了自动摘要，生成摘要
        if (userSettings.autoSummarize) {
            generateSummary(article);
        }
    } catch (error) {
        console.error("处理文章点击失败:", error);
        showNotification("无法显示文章内容: " + error.message, "error");
        
        // 确保文章容器已初始化
        if (!articleContainer) {
            articleContainer = document.getElementById("article-container");
        }
        
        if (articleContainer) {
            articleContainer.innerHTML = `
                <div class="error-message">
                    加载文章内容失败: ${error.message}
                </div>
            `;
        }
    }
}

// ============= 文章内容处理 =============

// 辅助函数：获取文章内容，处理可能的空内容情况
function getArticleContent(article) {
    console.log("获取文章内容:", article.title);
    
    // 尝试获取文章内容
    let content = article.content || article.contentSnippet || article.description || '';
    
    // 如果内容为空
    if (!content || content.trim() === '') {
        return `<p class="empty-state">${t('no_content')}</p>`;
    }
    
    // 如果内容是HTML，直接返回
    if (content.includes('<') && content.includes('>')) {
        return content;
    }
    
    // 如果内容是纯文本，转换为HTML段落
    return `<p>${content}</p>`;
}

// 显示文章内容
function displayArticleContent(article) {
    console.log("显示文章内容:", article.title);
    
    // 确保文章容器已初始化
    if (!articleContainer) {
        articleContainer = document.getElementById("article-container");
        if (!articleContainer) {
            console.error("无法找到文章内容容器");
            showNotification("无法显示文章内容", "error");
            return;
        }
    }
    
    // 重置滚动位置到顶部
    articleContainer.scrollTop = 0;
    
    // 显示"加载中..."
    articleContainer.innerHTML = `<div class="loading-message">${t('loading')}</div>`;
    
    // 检查是否有文章
    if (!article) {
        resetArticleContent();
        return;
    }
    
    try {
        // 保存当前文章的引用
        window.currentArticleData = article;
        
        // 准备文章内容HTML
        let contentHtml = '';
        
        // 添加返回按钮
        contentHtml += `
        <div class="back-button-container">
            <button id="back-to-article-button" class="back-button">
                <i class="fas fa-arrow-left"></i> ${t('back_to_article')}
            </button>
        </div>`;
        
        // 1. 文章标题和日期
        let pubDate = '';
        if (article.pubDate) {
            try {
                pubDate = new Date(article.pubDate).toLocaleString();
            } catch (e) {
                console.warn("日期格式化失败:", e);
                pubDate = article.pubDate;
            }
        }
        
        contentHtml += `<div class="article-header">
            <h2 class="article-title">${article.title || '无标题'}</h2>
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
        
        // 设置内容
        articleContainer.innerHTML = contentHtml;
        
        // 更新标题
        const contentHeader = document.getElementById('content-header');
        if (contentHeader) {
            contentHeader.innerHTML = `<i class="fas fa-book-open"></i> ${t('article_content')}`;
        }
        
        // 确保所有内容区域都继承字体大小
        const contentElements = articleContainer.querySelectorAll('.article-content, .ai-summary, .translation-content');
        contentElements.forEach(element => {
            element.style.fontSize = 'inherit';
        });
        
        // 处理返回按钮点击事件
        const backButton = document.getElementById('back-to-article-button');
        if (backButton) {
            backButton.addEventListener('click', () => {
                // 重新显示当前文章，本质上是返回到初始状态
                if (window.currentArticleData) {
                    displayArticleContent(window.currentArticleData);
                }
            });
        }
        
        // 处理文章中所有链接，使其在外部浏览器中打开
        const articleLinks = articleContainer.querySelectorAll('.article-content a');
        articleLinks.forEach(link => {
            // 移除现有的事件处理器
            const newLink = link.cloneNode(true);
            link.parentNode.replaceChild(newLink, link);
            
            // 添加新的点击事件处理器
            newLink.addEventListener('click', (e) => {
                e.preventDefault();
                const href = newLink.getAttribute('href');
                if (href && href !== '#' && !href.startsWith('javascript:')) {
                    window.electronAPI.openExternal(href);
                }
                return false;
            });
        });
        
        // 处理图片点击，添加点击后返回的功能
        const articleImages = articleContainer.querySelectorAll('.article-content img');
        articleImages.forEach(img => {
            img.style.cursor = 'pointer';
            img.addEventListener('click', () => {
                // 如果图片有链接，则在外部浏览器中打开
                const parentAnchor = img.closest('a');
                if (parentAnchor) {
                    const href = parentAnchor.getAttribute('href');
                    if (href && href !== '#' && !href.startsWith('javascript:')) {
                        window.electronAPI.openExternal(href);
                    }
                } else {
                    // 如果图片没有链接，则放大显示图片
                    const imgSrc = img.getAttribute('src');
                    if (imgSrc) {
                        // 创建一个覆盖层显示图片
                        const overlay = document.createElement('div');
                        overlay.className = 'image-overlay';
                        overlay.innerHTML = `
                            <div class="image-overlay-content">
                                <button class="close-overlay-button"><i class="fas fa-times"></i></button>
                                <img src="${imgSrc}" alt="enlarged image" />
                            </div>
                        `;
                        document.body.appendChild(overlay);
                        
                        // 添加关闭功能
                        const closeButton = overlay.querySelector('.close-overlay-button');
                        closeButton.addEventListener('click', () => {
                            document.body.removeChild(overlay);
                        });
                        
                        // 点击覆盖层背景也可以关闭
                        overlay.addEventListener('click', (e) => {
                            if (e.target === overlay) {
                                document.body.removeChild(overlay);
                            }
                        });
                    }
                }
            });
        });
        
        // 确保再次滚动到顶部
        setTimeout(() => {
            articleContainer.scrollTop = 0;
        }, 100);
        
        console.log("文章内容显示完成");
    } catch (error) {
        console.error("显示文章内容失败:", error);
        articleContainer.innerHTML = `
            <div class="error-message">
                显示文章内容失败: ${error.message}
            </div>
        `;
    }
}

// 重置文章内容
function resetArticleContent(message = null) {
    console.log("重置文章内容");
    
    // 确保文章容器已初始化
    if (!articleContainer) {
        articleContainer = document.getElementById("article-container");
        if (!articleContainer) {
            console.error("无法找到文章内容容器");
            return;
        }
    }
    
    if (!message) {
        message = t('no_article_selected');
    }
    
    articleContainer.innerHTML = `<p class="empty-state">${message}</p>`;
    
    const contentHeader = document.getElementById('content-header');
    if (contentHeader) {
        contentHeader.innerHTML = `<i class="fas fa-book-open"></i> ${t('article_content')}`;
    }
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
            const sources = [...window.currentFeeds, newSource];
            await window.electronAPI.saveRssSources(sources);
            
            // 更新当前源列表
            window.currentFeeds = sources;
            
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

// 初始化AI面板事件监听
function initAISettingsPanel() {
    console.log("初始化AI设置面板");
    
    // 获取UI元素
    const aiSettingsPanel = document.getElementById('ai-settings-panel');
    const aiSettingsToggle = document.getElementById('ai-settings-toggle');
    const closeSettingsBtn = document.getElementById('close-settings');
    
    // 获取表单元素
    const autoSummarizeToggle = document.getElementById('auto-summarize');
    const streamModeToggle = document.getElementById('stream-mode');
    const summaryLanguageSelect = document.getElementById('summary-language');
    const summaryLengthSelect = document.getElementById('summary-length');
    const saveApiSettingsBtn = document.getElementById('save-api-settings');
    
    // 收集API相关元素
    const apiRadios = document.querySelectorAll('input[name="active-api"]');
    const apiKeyInputs = {
        openai: document.getElementById('openai-api-key'),
        deepseek: document.getElementById('deepseek-api-key'),
        anthropic: document.getElementById('anthropic-api-key')
    };
    const modelSelects = {
        openai: document.getElementById('openai-model'),
        deepseek: document.getElementById('deepseek-model'),
        anthropic: document.getElementById('anthropic-model')
    };
    
    // 确保关键元素存在
    if (!aiSettingsPanel || !aiSettingsToggle || !autoSummarizeToggle || !streamModeToggle || !summaryLanguageSelect || !summaryLengthSelect || !saveApiSettingsBtn || !apiRadios || !apiKeyInputs || !modelSelects) {
        console.error("无法找到AI设置面板或切换按钮，或表单元素，或API相关元素");
        return;
    }
    
    console.log("AI设置面板元素已获取");
    
    // 移除所有现有事件，避免重复绑定
    const newAiSettingsToggle = aiSettingsToggle.cloneNode(true);
    aiSettingsToggle.parentNode.replaceChild(newAiSettingsToggle, aiSettingsToggle);
    
    // 更新全局引用
    window.aiSettingsToggleRef = newAiSettingsToggle;
    
    // 切换设置面板显示/隐藏
    newAiSettingsToggle.addEventListener("click", function(e) {
        e.stopPropagation(); // 阻止事件冒泡
        console.log("切换AI设置面板");
        
        // 关闭其他面板
        document.getElementById('app-settings-panel')?.classList.remove('active');
        
        // 切换当前面板
        aiSettingsPanel.classList.toggle("active");
        
        // 初始化表单值
        if (aiSettingsPanel.classList.contains("active")) {
            console.log("正在初始化AI设置表单");
            
            // 应用当前设置到表单
            if (autoSummarizeToggle) {
                autoSummarizeToggle.checked = userSettings.autoSummarize || false;
            }
            
            if (streamModeToggle) {
                streamModeToggle.checked = userSettings.useStreamMode || true;
            }
            
            if (summaryLanguageSelect && userSettings.summaryLanguage) {
                summaryLanguageSelect.value = userSettings.summaryLanguage;
            }
            
            if (summaryLengthSelect && userSettings.summaryLength) {
                summaryLengthSelect.value = userSettings.summaryLength;
            }
            
            // 设置API选择
            const activeProvider = apiSettings.activeProvider;
            if (activeProvider) {
                const activeRadio = document.querySelector(`input[name="active-api"][value="${activeProvider}"]`);
                if (activeRadio) {
                    activeRadio.checked = true;
                }
            }
            
            // 设置API密钥和模型
            Object.keys(apiSettings.providers).forEach(provider => {
                if (apiKeyInputs[provider]) {
                    apiKeyInputs[provider].value = apiSettings.providers[provider].apiKey || '';
                }
                
                if (modelSelects[provider]) {
                    modelSelects[provider].value = apiSettings.providers[provider].model || '';
                }
            });
        }
    });
    
    // 关闭设置面板
    if (closeSettingsBtn) {
        closeSettingsBtn.addEventListener("click", function(e) {
            e.stopPropagation(); // 阻止事件冒泡
            aiSettingsPanel.classList.remove("active");
        });
    }
    
    // 点击外部关闭设置面板
    document.addEventListener("mousedown", function(e) {
        if (aiSettingsPanel.classList.contains("active") && 
            !aiSettingsPanel.contains(e.target) && 
            e.target !== aiSettingsToggle) {
            aiSettingsPanel.classList.remove("active");
        }
    });
    
    // 监听设置变更
    if (autoSummarizeToggle) {
        autoSummarizeToggle.addEventListener("change", function() {
            userSettings.autoSummarize = this.checked;
            saveSettings();
            console.log("自动摘要设置已更改:", this.checked);
        });
    }
    
    if (streamModeToggle) {
        streamModeToggle.addEventListener("change", function() {
            userSettings.useStreamMode = this.checked;
            saveSettings();
            console.log("流式输出设置已更改:", this.checked);
        });
    }
    
    if (summaryLanguageSelect) {
        summaryLanguageSelect.addEventListener("change", function() {
            userSettings.summaryLanguage = this.value;
            saveSettings();
            console.log("摘要语言设置已更改:", this.value);
        });
    }
    
    if (summaryLengthSelect) {
        summaryLengthSelect.addEventListener("change", function() {
            userSettings.summaryLength = this.value;
            saveSettings();
            console.log("摘要长度设置已更改:", this.value);
        });
    }
    
    // 选择活跃的API提供商
    apiRadios.forEach(radio => {
        radio.addEventListener("change", function() {
            if (this.checked) {
                apiSettings.activeProvider = this.value;
                console.log("当前API提供商已更改:", this.value);
            }
        });
    });
    
    // 保存API设置
    if (saveApiSettingsBtn) {
        saveApiSettingsBtn.addEventListener("click", function() {
            // 收集所有API提供商的设置
            Object.keys(apiSettings.providers).forEach(provider => {
                if (apiKeyInputs[provider]) {
                    apiSettings.providers[provider].apiKey = apiKeyInputs[provider].value;
                }
                
                if (modelSelects[provider]) {
                    apiSettings.providers[provider].model = modelSelects[provider].value;
                }
            });
            
            // 保存设置
            saveApiSettings().then(() => {
                // 关闭面板并显示通知
                aiSettingsPanel.classList.remove("active");
                showNotification("AI设置已保存");
                console.log("AI设置已保存:", apiSettings);
            }).catch(error => {
                console.error("保存API设置失败:", error);
                showNotification("保存API设置失败", "error");
            });
        });
    }
}

// 初始化应用设置面板
function initAppSettingsPanel() {
    console.log("初始化应用设置面板");
    
    // 获取UI元素
    const appSettingsPanel = document.getElementById('app-settings-panel');
    const appSettingsToggle = document.getElementById('app-settings-toggle');
    const closeAppSettings = document.getElementById('close-app-settings');
    const appLanguageSelect = document.getElementById('app-language');
    const fontScaleSetting = document.getElementById('font-scale-setting');
    const fontScaleValue = document.getElementById('font-scale-value');
    const darkModeSetting = document.getElementById('dark-mode-setting');
    const saveAppSettingsBtn = document.getElementById('save-app-settings');
    
    // 确保关键元素存在
    if (!appSettingsPanel || !appSettingsToggle) {
        console.error("无法找到应用设置面板或切换按钮");
        return;
    }
    
    console.log("应用设置面板元素已获取");
    
    // 移除所有现有事件，避免重复绑定
    const newAppSettingsToggle = appSettingsToggle.cloneNode(true);
    appSettingsToggle.parentNode.replaceChild(newAppSettingsToggle, appSettingsToggle);
    
    // 更新全局引用
    window.appSettingsToggleRef = newAppSettingsToggle;
    
    // 打开应用设置面板
    newAppSettingsToggle.addEventListener('click', function(e) {
        e.stopPropagation(); // 阻止事件冒泡
        console.log("打开应用设置面板");
        
        // 关闭其他面板
        document.getElementById('ai-settings-panel')?.classList.remove('active');
        
        // 切换当前面板
        appSettingsPanel.classList.toggle('active');
        
        // 设置当前值
        if (appLanguageSelect) {
            appLanguageSelect.value = userSettings.language || 'zh-CN';
        }
        
        if (fontScaleSetting && fontScaleValue) {
            const currentFontScale = userSettings.fontScale || 1;
            fontScaleSetting.value = currentFontScale;
            fontScaleValue.textContent = currentFontScale;
        }
        
        if (darkModeSetting) {
            darkModeSetting.checked = userSettings.darkMode || false;
        }
    });
    
    // 关闭应用设置面板
    if (closeAppSettings) {
        closeAppSettings.addEventListener('click', function(e) {
            e.stopPropagation();
            appSettingsPanel.classList.remove('active');
        });
    }
    
    // 点击面板外关闭
    document.addEventListener('click', function(e) {
        if (appSettingsPanel.classList.contains('active') && 
            !appSettingsPanel.contains(e.target) && 
            e.target !== appSettingsToggle) {
            appSettingsPanel.classList.remove('active');
        }
    });
    
    // 字体大小滑块变化
    if (fontScaleSetting && fontScaleValue) {
        fontScaleSetting.addEventListener('input', function() {
            const newSize = this.value;
            fontScaleValue.textContent = newSize;
            
            // 实时预览字体大小
            document.documentElement.style.fontSize = newSize + 'em';
            
            // 通知用户尚未保存
            console.log("字体大小已更改，等待保存:", newSize);
        });
    }
    
    // 深色模式开关
    if (darkModeSetting) {
        darkModeSetting.addEventListener('change', function() {
            // 实时预览深色模式
            if (this.checked) {
                document.documentElement.classList.add('dark');
                document.body.classList.add('dark-mode');
            } else {
                document.documentElement.classList.remove('dark');
                document.body.classList.remove('dark-mode');
            }
            
            console.log("深色模式已更改，等待保存:", this.checked);
        });
    }
    
    // 保存应用设置
    if (saveAppSettingsBtn) {
        saveAppSettingsBtn.addEventListener('click', async function(e) {
            e.stopPropagation();
            
            try {
                console.log("正在保存应用设置...");
                
                // 收集当前设置
                const newSettings = { ...userSettings };
                
                // 更新语言设置
                if (appLanguageSelect) {
                    newSettings.language = appLanguageSelect.value;
                }
                
                // 更新字体大小设置
                if (fontScaleSetting) {
                    newSettings.fontScale = parseFloat(fontScaleSetting.value);
                }
                
                // 更新深色模式设置
                if (darkModeSetting) {
                    newSettings.darkMode = darkModeSetting.checked;
                }
                
                // 检查语言是否改变
                const languageChanged = userSettings.language !== newSettings.language;
                
                // 保存设置
                userSettings = newSettings;
                await window.electronAPI.saveSettings(userSettings);
                
                // 应用设置
                if (languageChanged) {
                    // 切换语言
                    switchLanguage(userSettings.language);
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
                
                console.log("应用设置已保存:", userSettings);
                
                // 关闭设置面板
                appSettingsPanel.classList.remove('active');
            } catch (error) {
                console.error('保存应用设置失败:', error);
                showNotification(t('save_settings_error'), 'error');
            }
        });
    }
} 