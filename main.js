const { app, BrowserWindow, ipcMain } = require('electron');

let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow(
    {
      width: 800,
      height: 600,
      frame: false,
      resizable: false
    }
  );

  mainWindow.loadFile('app/index.html');
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

ipcMain.on('close-window', () => {
  app.quit();
});