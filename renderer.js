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

    // ----------------- UI Resizing Logic -----------------
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

    // createResizer(leftResize, sidebar);
    // createResizer(rightResize, middle);

    window.addEventListener("resize", () => {
        const windowWidth = window.innerWidth;
        const firstResizeWith = 1200;
        const secondResizeWith = 800;

        const wasSidebarVisible = sidebar.style.display !== "none";
        const wasMiddleVisible = middle.style.display !== "none";

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

        const isSidebarVisible = sidebar.style.display !== "none";
        const isMiddleVisible = middle.style.display !== "none";

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

    // ----------------- Application Logic -----------------
    const rssSources = document.getElementById("rss-sources");
    const articlesList = document.getElementById("articles");
    const articleDisplay = document.getElementById("article-content");

    // Load stored RSS sources on startup
    async function loadRssSources() {
        try {
            const sources = await window.electronAPI.getRssSources();
            rssSources.innerHTML = "";
            sources.forEach((source) => {
                const li = document.createElement("li");
                li.textContent = source.title;
                li.dataset.url = source.url;
                rssSources.appendChild(li);
            });
        } catch (error) {
            console.error("Failed to load RSS sources:", error);
        }
    }
    loadRssSources();

    rssSources.addEventListener("click", async (event) => {
        const target = event.target;
        if (target && target.tagName === "LI") {
            const url = target.dataset.url;
            document.getElementById("articles-loading-indicator").innerText =
                "Articles (Loading...)";
            try {
                console.log("info", `Fetching RSS feed from: ${url}`);
                const startTime = Date.now();
                if (
                    sidebar.style.display == "block" &&
                    middle.style.display == "none"
                ) {
                    sidebar.style.display = "none";
                    middle.style.display = "block";
                    midButton.style.display = "block";
                }

                const feed = await window.electronAPI.fetchRss(url);
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
                ? `<p><small>${new Date(pubDate).toLocaleString()}</small></p>`
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

    // ----------------- New Code for Adding a New RSS Feed -----------------
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
            // Validate the RSS feed by fetching it
            const feed = await window.electronAPI.fetchRss(url);
            const li = document.createElement("li");
            li.textContent = feed.title || url;
            li.dataset.url = url;
            rssSources.appendChild(li);

            // Update persistent sources: load current sources, add new feed, and save.
            const sources = await window.electronAPI.getRssSources();
            sources.push({ title: feed.title || url, url: url });
            await window.electronAPI.saveRssSources(sources);

            closeModal();
        } catch (error) {
            modalError.textContent = "Invalid RSS feed. Please try again.";
            modalError.style.display = "block";
        }
    });

    rssUrlInput.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
            submitRssButton.click();
        }
    });
});
