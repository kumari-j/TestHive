const path = require("path");
const { app, BrowserWindow } = require("electron");

let mainWindow;

app.on("ready", () => {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });
    // Use the full path to the `frontend/public/index.html`
    const indexPath = path.join(
        __dirname,
        "..",
        "frontend",
        "build",
        "index.html"
    );
    console.log("Loading HTML from:", indexPath);

    mainWindow.loadFile(indexPath);

    // Uncomment this line to debug (see what's happening in the window)
    mainWindow.webContents.openDevTools();
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});
