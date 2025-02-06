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
    // Resizable Panels Logic
    const leftResize = document.getElementById('left-resize');
    const rightResize = document.getElementById('right-resize');
    const sidebar = document.querySelector('.sidebar');
    const middle = document.querySelector('.middle');
    const content = document.querySelector('.content');
    
    // Handle resizing the left and right panels
    function createResizer(resizeElement, targetElement) {
        let startX, startWidth;

        function initDrag(e) {
            startX = e.clientX;
            startWidth = targetElement.offsetWidth;
            document.documentElement.style.userSelect = 'none';
            resizeElement.classList.add('active');
            
            document.addEventListener('mousemove', doDrag);
            document.addEventListener('mouseup', stopDrag);
        }

        function doDrag(e) {
            const deltaX = e.clientX - startX;
            const newWidth = startWidth + deltaX;
            targetElement.style.flex = `0 0 ${newWidth}px`;
        }

        function stopDrag() {
            document.documentElement.style.userSelect = '';
            resizeElement.classList.remove('active');
            document.removeEventListener('mousemove', doDrag);
            document.removeEventListener('mouseup', stopDrag);
        }

        resizeElement.addEventListener('mousedown', initDrag);
    }

    createResizer(leftResize, sidebar);
    createResizer(rightResize, middle);

    // Handle window resizing to hide/show panels
    window.addEventListener('resize', () => {
        const windowWidth = window.innerWidth;

        // Hide left panel if window is too narrow
        if (windowWidth < 1200) {
            sidebar.style.display = 'none';
        } else {
            sidebar.style.display = 'block';
        }

        // Hide middle panel if window is very narrow
        if (windowWidth < 1000) {
            middle.style.display = 'none';
        } else {
            middle.style.display = 'block';
        }
    });

    // Original Application Logic
    const rssSources = document.getElementById("rss-sources");
    const articlesList = document.getElementById("articles");
    const articleDisplay = document.getElementById("article-content");

    rssSources.addEventListener("click", async (event) => {
        const target = event.target;
        if (target && target.tagName === "LI") {
            const url = target.dataset.url;
            document.getElementById("articles-loading-indicator").innerText = "Articles (Loading...)";
            try {
                console.log("info", `Fetching RSS feed from: ${url}`);
                const feed = await window.electronAPI.fetchRss(url);
                console.log("info", `Fetched RSS feed: ${feed.title} (${feed.items.length} items)`);
                
                document.querySelector('.middle h2').textContent = feed.title;
                articlesList.innerHTML = '';
                
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

            // Ensure any images inside the content are styled correctly
            const images = articleDisplay.querySelectorAll("img");
            images.forEach(img => {
                img.style.display = 'block';
                img.style.maxWidth = '100%';
                img.style.height = 'auto';
                img.style.margin = '0 auto';
                img.style.objectFit = 'contain'; // Maintain aspect ratio and prevent overflow
            });
        }
    });
});

