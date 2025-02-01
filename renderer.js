const information = document.getElementById("info");
information.innerText = `This app is using Chrome (v${window.versions.chrome()}), Node.js (v${window.versions.node()}), and Electron (v${window.versions.electron()})`;
const number = document.getElementById("fuckingTestNumber");
number.innerText = `The number is ${window.electronAPI.getNumber()}`;
