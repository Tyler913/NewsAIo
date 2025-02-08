const originalLog = console.log;
console.log = (level = "info", ...args) => {
    originalLog(...args);
    if (!(level === "error" || level === "warn" || level === "info")) {
        window.electronAPI?.logWithLevel("error", "Invalid log level! Original message: " + level.toLocaleUpperCase + args.join(" "));
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
    
    const backButton = document.createElement('button');
    backButton.textContent = "Back";
    backButton.style.position = "absolute";
    backButton.style.top = "10px";
    backButton.style.right = "10px";
    backButton.style.padding = "10px 20px";
    backButton.style.backgroundColor = "#2c3e50";
    backButton.style.color = "white";
    backButton.style.border = "none";
    backButton.style.borderRadius = "5px";
    backButton.style.cursor = "pointer";
    backButton.style.display = "none";  // Initially hide the button

    content.appendChild(backButton);

    // Keep track of the app's current state
    let isRssVisible = false;
    let isArticlesVisible = false;

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

        toggleBackButton();
    });

    // Toggle back button visibility based on which section is visible
    function toggleBackButton() {
        const isSidebarVisible = sidebar.style.display !== 'none';
        const isMiddleVisible = middle.style.display !== 'none';

        if (isSidebarVisible && isMiddleVisible) {
            backButton.style.display = 'none'; // No back button when both are visible
        } else {
            backButton.style.display = 'block'; // Show back button when one or both are hidden
        }
    }

    backButton.addEventListener('click', () => {
        const isSidebarVisible = sidebar.style.display !== 'none';
        const isMiddleVisible = middle.style.display !== 'none';

        // If RSS is hidden, show it above the Articles section
        if (!isSidebarVisible && isMiddleVisible) {
            sidebar.style.display = 'block';
            middle.style.display = 'none';
            backButton.textContent = "Back to Articles"; // Correct the button text
            isRssVisible = true; // Track that RSS is visible
            isArticlesVisible = false; // Articles is not visible
            console.log("info", "Showing RSS section above content");
        } 
        else if(isSidebarVisible && !isMiddleVisible){
            sidebar.style.display = 'none';
            middle.style.display = 'block';
            backButton.textContent = "Back to RSS List"; // Correct the button text
            isRssVisible = false; // Track that RSS is invisible
            isArticlesVisible = true; // Articles is visible
            console.log("info", "Showing Articles section above content");
        }
        // If both RSS and Articles are hidden, show RSS on top of Content, and toggle between them
        else if (!isSidebarVisible && !isMiddleVisible) {
            // Show RSS section on top of content
            sidebar.style.display = 'block';
            backButton.textContent = "Back to RSS List"; // Update button text
            isRssVisible = true;
            isArticlesVisible = false;
        }
    });

    // Function to hide the previously shown section when clicking on the content area
    // content.addEventListener('click', (event) => {
    //     const isSidebarVisible = sidebar.style.display !== 'none';
    //     const isMiddleVisible = middle.style.display !== 'none';

    //     // If the user is on the original state (with Articles and Content visible), do nothing
    //     if (!isRssVisible && !isArticlesVisible) {
    //         return; // Don't do anything if both sections are visible
    //     }

    //     // Check if the click happens on the blank space in the content area
    //     if (!event.target.closest('.middle') && !event.target.closest('.sidebar') && event.target !== backButton) {
    //         if (isRssVisible && !isArticlesVisible) {
    //             // If RSS is visible and Articles is not, clicking should hide RSS and show Articles
    //             sidebar.style.display = 'none';
    //             middle.style.display = 'block';
    //             backButton.textContent = "Back to RSS List"; // Update button text
    //             isRssVisible = false;
    //             isArticlesVisible = true;
    //         } else if (!isRssVisible && isArticlesVisible) {
    //             // If Articles section is visible, clicking should hide Articles and show RSS
    //             middle.style.display = 'none';
    //             sidebar.style.display = 'block';
    //             backButton.textContent = "Back to Articles"; // Update button text
    //             isRssVisible = true;
    //             isArticlesVisible = false;
    //         }
    //     }
    // });

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
                const startTime = Date.now();
                //关闭RSS源列表
                sidebar.style.display = 'none';
                middle.style.display = 'block';
                backButton.textContent = "Back to RSS List";

                const feed = await window.electronAPI.fetchRss(url);//开始加载
                
                const elapsed = Date.now() - startTime;
                console.log("info",`RSS fetch time (include IPC): ${elapsed}ms`);
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
        }
    });
});

