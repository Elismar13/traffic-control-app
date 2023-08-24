const { app, BrowserWindow } = require('electron');

function createWindow () {
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    fullscreen: false,
    webPreferences: {
      // nodeIntegration: true, // Permite usar o Node.js na página web
      devTools: true,
    }
  });

  mainWindow.webContents.openDevTools();
  //mainWindow.loadFile('src/index.html');
  mainWindow.loadFile('src/pages/canvas/canvas.html');

}

app.whenReady().then(() => {
  createWindow()

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) 
      createWindow();
  })
})

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') 
    app.quit();
})
