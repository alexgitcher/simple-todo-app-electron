const { ipcRenderer } = require('electron');

window.closeApp = () => ipcRenderer.send('close-window');
