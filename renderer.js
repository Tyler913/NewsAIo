const originalLog = console.log;
console.log = (level = "info", ...args) => {
    originalLog(...args);
    if (!(level === "error" || level === "warn" || level === "info")) {
        window.electronAPI?.logWithLevel("error", "Invalid log level! Original message: " + args.join(" "));
    } else {
        window.electronAPI?.logWithLevel(level, args.join(" "));
    }
};

document.addEventListener("DOMContentLoaded", function () {
    const rssSources = document.getElementById("rss-sources");
    const articlesList = document.getElementById("articles");
    const articleDisplay = document.getElementById("article-content");

    // Handle RSS source clicks
    rssSources.addEventListener("click", async (event) => {
        const target = event.target;
        if (target && target.tagName === "LI") {
            const url = target.dataset.url;
            document.getElementById("articles-loading-indicator").innerText = "Articles (Loading...)";
            try {
                console.log("info", `Fetching RSS feed from: ${url}`);
                const feed = await window.electronAPI.fetchRss(url);
                console.log("info", `Fetched RSS feed: ${feed.title} (${feed.items.length} items)`);
                
                // Update middle section title
                document.querySelector('.middle h2').textContent = feed.title;
                
                // Clear previous articles
                articlesList.innerHTML = '';
                
                // Populate new articles
                feed.items.forEach(item => {
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
            document.getElementById("articles-loading-indicator").innerText = "Articles";
        }
    });

    // Handle article clicks
    articlesList.addEventListener("click", (event) => {
        const target = event.target;
        if (target && target.tagName === "LI") {
            const content = target.dataset.content;
            const link = target.dataset.link;
            const pubDate = target.dataset.pubDate;
            
            articleDisplay.innerHTML = `
                ${pubDate ? `<p><small>${new Date(pubDate).toLocaleString()}</small></p>` : ''}
                <div>${content}</div>
                ${link ? `<p><a href="${link}" target="_blank">Read full article</a></p>` : ''}
            `;
        }
    });
});

