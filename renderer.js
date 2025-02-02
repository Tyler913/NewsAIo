const Parser = require('rss-parser');
const parser = new Parser();

const information = document.getElementById("info");
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`;
const number = document.getElementById("fuckingTestNumber");
number.innerText = `The number is ${window.electronAPI.getNumber()}`;

// 点击按钮后获取 RSS 数据
const butt=document.getElementById('butt');
butt.addEventListener('click', () => {

    const feedUrl = 'https://rss.nytimes.com/services/xml/rss/nyt/HomePage.xml';
    console.log('clicked');

    try {
        // 获取 RSS 数据
        const feed = parser.parseURL(feedUrl);
        console.log(feed);
        const feedList = document.getElementById('feedList');
        feedList.innerHTML = ''; // 清空之前的内容

        // 遍历显示 RSS 数据
        feed.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<a href="${item.link}" target="_blank">${item.title}</a>`;
            feedList.appendChild(li);
        });
    } catch (err) {
        console.error(err);
        alert('获取 RSS 数据失败');
    }

});
