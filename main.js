const {app, BrowserWindow, ipcMain} = require('electron');
const {join} = require('path');
const calcMd5 = require('./helper/calc-md5');

let mainWindow;

app.on('ready', () => {
	// initialize window
	mainWindow = new BrowserWindow({
		webPreferences : {
			nodeIntegration : true
		}
	});

	mainWindow.setMenu(null);
	mainWindow.loadFile(join(__dirname, 'src', 'index.html'));
})

ipcMain.on('filePath', async (event, filePath) => {
	const md5 = await calcMd5(filePath);
	mainWindow.webContents.send('checksum', md5);
})
