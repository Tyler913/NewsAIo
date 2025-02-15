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

document.addEventListener("DOMContentLoaded", function () {
    // Resizable Panels Logic
    const leftResize = document.getElementById("left-resize");
    const rightResize = document.getElementById("right-resize");
    const sidebar = document.querySelector(".sidebar");
    const middle = document.querySelector(".middle");
    const content = document.querySelector(".content");
    const midButton = document.getElementById("middle-back-button");
    const articleButton = document.getElementById("article-back-button");

    //-----------------以下是UI逻辑-----------------
    // Handle resizing the left and right panels
    function createResizer(resizeElement, targetElement) {
        let startX, startWidth;

        function initDrag(e) {
            startX = e.clientX;
            startWidth = targetElement.offsetWidth;
            document.documentElement.style.userSelect = "none";
            resizeElement.classList.add("active");

            document.addEventListener("mousemove", doDrag);
            document.addEventListener("mouseup", stopDrag);
        }

        function doDrag(e) {
            const deltaX = e.clientX - startX;
            const newWidth = startWidth + deltaX;
            targetElement.style.flex = `0 0 ${newWidth}px`;
        }

        function stopDrag() {
            document.documentElement.style.userSelect = "";
            resizeElement.classList.remove("active");
            document.removeEventListener("mousemove", doDrag);
            document.removeEventListener("mouseup", stopDrag);
        }

        resizeElement.addEventListener("mousedown", initDrag);
    }

    // 我试了，这个函数会覆盖sidebar和middle的resize
    // createResizer(leftResize, sidebar);
    // createResizer(rightResize, middle);

    // Handle window resizing to hide/show panels
    window.addEventListener("resize", () => {
        const windowWidth = window.innerWidth;
        const firstResizeWith = 1200;
        const secondResizeWith = 800;

        // Capture visibility BEFORE changes
        const wasSidebarVisible = sidebar.style.display !== "none";
        const wasMiddleVisible = middle.style.display !== "none";

        // Update panel visibility based on window width
        if (windowWidth >= firstResizeWith) {
            sidebar.style.display = "block";
            middle.style.display = "block";
        } else if (
            windowWidth < firstResizeWith &&
            wasSidebarVisible &&
            wasMiddleVisible
        ) {
            sidebar.style.display = "none";
            middle.style.display = "block";
        } else if (windowWidth < secondResizeWith) {
            sidebar.style.display = "none";
            middle.style.display = "none";
        } else if (
            windowWidth < firstResizeWith &&
            windowWidth >= secondResizeWith &&
            !wasSidebarVisible
        ) {
            sidebar.style.display = "none";
            middle.style.display = "block";
        }

        // Get UPDATED visibility after adjustments
        const isSidebarVisible = sidebar.style.display !== "none";
        const isMiddleVisible = middle.style.display !== "none";

        // Update buttons based on CURRENT visibility
        if (isSidebarVisible) {
            midButton.style.display = "none";
            articleButton.style.display = "none";
        } else if (isMiddleVisible && !isSidebarVisible) {
            midButton.style.display = "block";
            articleButton.style.display = "none";
        } else if (!isMiddleVisible && !isSidebarVisible) {
            midButton.style.display = "none";
            articleButton.style.display = "block";
        }
    });

    midButton.addEventListener("click", () => {
        sidebar.style.display = "block";
        middle.style.display = "none";
    });

    articleButton.addEventListener("click", () => {
        sidebar.style.display = "none";
        middle.style.display = "block";
        articleButton.style.display = "none";
        midButton.style.display = "block";
    });

    //-----------------以下是应用逻辑-----------------
    // Original Application Logic
    const rssSources = document.getElementById("rss-sources");
    const articlesList = document.getElementById("articles");
    const articleDisplay = document.getElementById("article-content");

    rssSources.addEventListener("click", async (event) => {
        const target = event.target;
        if (target && target.tagName === "LI") {
            const url = target.dataset.url;
            document.getElementById("articles-loading-indicator").innerText =
                "Articles (Loading...)";
            try {
                console.log("info", `Fetching RSS feed from: ${url}`);
                const startTime = Date.now();
                // 关闭RSS源列表
                if (
                    sidebar.style.display == "block" &&
                    middle.style.display == "none"
                ) {
                    sidebar.style.display = "none";
                    middle.style.display = "block";
                    midButton.style.display = "block";
                }

                const feed = await window.electronAPI.fetchRss(url); // 开始加载

                const elapsed = Date.now() - startTime;
                console.log(
                    "info",
                    `RSS fetch time (include IPC): ${elapsed}ms`
                );
                console.log(
                    "info",
                    `Fetched RSS feed: ${feed.title} (${feed.items.length} items)`
                );

                document.querySelector(".middle h2").textContent = feed.title;
                articlesList.innerHTML = "";

                feed.items.forEach((item) => {
                    const li = document.createElement("li");
                    li.textContent = item.title;
                    li.dataset.content = item.content;
                    li.dataset.link = item.link;
                    li.dataset.pubDate = item.pubDate;
                    articlesList.appendChild(li);
                });
            } catch (error) {
                console.log("error", `Failed to fetch RSS: ${error.message}`);
                articleDisplay.innerHTML = `<p>Error loading feed: ${error.message}</p>`;
            }
            document.getElementById("articles-loading-indicator").innerText =
                "Articles";
        }
    });

    articlesList.addEventListener("click", (event) => {
        const target = event.target;
        if (target && target.tagName === "LI") {
            // 关闭文章列表
            if (
                sidebar.style.display == "none" &&
                middle.style.display == "block"
            ) {
                sidebar.style.display = "none";
                middle.style.display = "none";
                articleButton.style.display = "block";
            }
            const content = target.dataset.content;
            const link = target.dataset.link;
            const pubDate = target.dataset.pubDate;

            articleDisplay.innerHTML = `
                ${
                    pubDate
                        ? `<p><small>${new Date(
                            pubDate
                        ).toLocaleString()}</small></p>`
                        : ""
                }
                <div>${content}</div>
                ${
                    link
                        ? `<p><a href="${link}" target="_blank">Read full article</a></p>`
                        : ""
                }
            `;
        }
    });

    //----------------- New Code for Adding a New RSS Feed -----------------
    const addRssButton = document.getElementById("add-rss-button");
    const addFeedModal = document.getElementById("add-feed-modal");
    const modalCloseButton = document.getElementById("modal-close-button");
    const submitRssButton = document.getElementById("submit-rss-button");
    const rssUrlInput = document.getElementById("rss-url-input");
    const modalError = document.getElementById("modal-error");

    function openModal() {
        addFeedModal.style.display = "block";
        modalError.style.display = "none";
        rssUrlInput.value = "";
        rssUrlInput.focus();
    }

    function closeModal() {
        addFeedModal.style.display = "none";
        modalError.style.display = "none";
        rssUrlInput.value = "";
    }

    addRssButton.addEventListener("click", openModal);
    modalCloseButton.addEventListener("click", closeModal);
    window.addEventListener("click", function (event) {
        if (event.target === addFeedModal) {
            closeModal();
        }
    });

    submitRssButton.addEventListener("click", async function () {
        const url = rssUrlInput.value.trim();
        if (!url) {
            modalError.textContent = "Please enter a valid URL.";
            modalError.style.display = "block";
            return;
        }
        try {
            // Call fetchRss to validate the RSS feed
            const feed = await window.electronAPI.fetchRss(url);
            // Create a new <li> element in the sidebar for the new feed
            const li = document.createElement("li");
            li.textContent = feed.title || url;
            li.dataset.url = url;
            rssSources.appendChild(li);
            closeModal();
        } catch (error) {
            modalError.textContent = "Invalid RSS feed. Please try again.";
            modalError.style.display = "block";
        }
    });

    // Allow pressing Enter to submit the URL
    rssUrlInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            submitRssButton.click();
        }
    });
});
