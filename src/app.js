const { app, BrowserWindow, ipcMain } = require('electron');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: false,
    webPreferences: {
      nodeIntegration: true,  
      devTools: true,
      contextIsolation: false,
    }
  });
  //mainWindow.webContents.openDevTools();
  // mainWindow.loadFile('src/pages/home/home.html');
  // mainWindow.loadFile('src/pages/settings/settings.html');
  mainWindow.loadFile('src/pages/canvas/canvas.html');

}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) 
      createWindow();
  });

  ipcMain.on('change-to-canvas', () => {
    mainWindow.loadFile('src/pages/canvas/canvas.html');
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') 
    app.quit();
});
