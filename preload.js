const {contextBridge, ipcRenender} = require('electron')
//添加IPC log api
contextBridge.exposeInMainWorld('electronAPI', {
    sendLogToMain: (log) => ipcRenender.send('log-renderer-to-main', log),//发送log到main进程
    onMainReply: (callback) => ipcRenender.on('main-reply', (event, log) => callback(log))//接收main进程的log
})