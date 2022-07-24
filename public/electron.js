const path = require('path');

const { app, BrowserWindow } = require('electron');
const isDev = require('electron-is-dev');
const Store = require('electron-store');

// Fix mac paths
if (process.platform !== 'darwin') {
	process.env["PATH"] = "~/.bin/:/usr/bin:/bin:/usr/sbin:/sbin:/usr/local/bin";
}

// console.log(process.env["PATH"]);
function createWindow() {
	// Create the browser window.
	const win = new BrowserWindow({
		width: 1200,
		height: 800,
		webPreferences: {
			nodeIntegration: true,
			nodeIntegrationInWorker: true,
			contextIsolation: false,
		},
	});

	win.setBackgroundColor("rgb(18, 18, 18)");

	// init store
	Store.initRenderer();

	// and load the index.html of the app.
	// win.loadFile("index.html");
	win.loadURL(
		isDev
			? 'http://localhost:3000'
			: `file://${path.join(__dirname, '../build/index.html')}`
	);
	// Open the DevTools.
	if (isDev) {
		win.webContents.openDevTools({ mode: 'right' });
	}
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.whenReady().then(createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bars to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
	// if (process.platform !== 'darwin') {
	app.quit();
	// }
});

app.on('activate', () => {
	if (BrowserWindow.getAllWindows().length === 0) {
		createWindow();
	}
});
