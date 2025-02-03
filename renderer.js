// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {
    console.log("111");
    const articlesList = document.getElementById("articles");
    const articleDisplay = document.getElementById("article-content");

    // Delegate click events to the <ul> container
    articlesList.addEventListener("click", function (event) {
        const target = event.target;
        if (target && target.tagName === "LI") {
            // Get content from data attribute and display it
            const content = target.getAttribute("data-content");
            articleDisplay.innerHTML = `<p>${content}</p>`;
        }
    });
});