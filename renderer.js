// Optional: Override console.log to auto-forward logs
const originalLog = console.log;
console.log = (level = "info", ...args) => {
    originalLog(...args);
    //检测log等级
    if (!(level === "error" || level === "warn" || level === "info")) {
        window.electronAPI?.logWithLevel("error".toLocaleUpperCase(), "Invalid log level! Original message: " + args.join(" "));
    }
    else
        window.electronAPI?.logWithLevel(level.toUpperCase(), args.join(" "));
};

console.log("info","Hello, World!");

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const articlesList = document.getElementById("articles");
    const articleDisplay = document.getElementById("article-content");

    // Delegate click events to the <ul> container
    articlesList.addEventListener("click", function (event) {
        const target = event.target;
        if (target && target.tagName === "LI") {
            // 获取点击的文章序号
            const items = Array.from(target.parentNode.children);
            const index = items.indexOf(target);
            console.log("info", `you are clicking ${index} element`);
            articleDisplay.innerHTML = `<p>you are clicking ${index} element</p>`;
        }
    });
});
