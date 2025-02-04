// Optional: Override console.log to auto-forward logs
const originalLog = console.log;
console.log = (...args) => {
    originalLog(...args);
    window.electronAPI.logToTerminal(args.join(" "));
};

window.electronAPI.logToTerminal("Let me try!")


// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    const articlesList = document.getElementById("articles");
    const articleDisplay = document.getElementById("article-content");

    // Delegate click events to the <ul> container
    articlesList.addEventListener("click", function (event) {
        const target = event.target;
        if (target && target.tagName === "LI") {
            // 获取点击的文章序号
            //window.electronAPI.sendLogToMain("114514");
            const items = Array.from(target.parentNode.children);
            const index = items.indexOf(target);
            articleDisplay.innerHTML = `<p>you are clicking ${index} element</p>`;
        }
    });
});
