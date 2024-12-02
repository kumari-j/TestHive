const path = require("path");
const { app, BrowserWindow } = require("electron");
const { spawn } = require("child_process");
const net = require("net"); // To check port availability
const { exec } = require("child_process"); // For handling the cleanup of existing processes

let mainWindow;
let backendProcess;

// Create the Electron window
const createWindow = () => {
    mainWindow = new BrowserWindow({
        fullscreen: true,
        frame: false, // Remove the default Electron title bar
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
        },
    });

    mainWindow.loadFile(path.join(__dirname, "../frontend/build/index.html"));

    // Open the developer tools automatically
    // mainWindow.webContents.openDevTools();
    
    mainWindow.on("closed", () => {
        mainWindow = null;
    });

    // Ensure that the window gets focus whenever it's reactivated (e.g., returning from the test screen)
    mainWindow.on("focus", () => {
        console.log("[App]: Window focused");
        // You can focus on the first input field of the login form here if needed
        mainWindow.webContents.send("focus-input"); // Send message to the renderer process to focus the input
    });
};

// Check if port 5000 is free
const isPortFree = (port) => {
    return new Promise((resolve, reject) => {
        const server = net.createServer();
        server.once("error", (err) => {
            if (err.code === "EADDRINUSE") {
                resolve(false); // Port is in use
            } else {
                reject(err);
            }
        });

        server.once("listening", () => {
            server.close(() => resolve(true)); // Port is free
        });

        server.listen(port);
    });
};

// Force kill any existing backend process running on port 5000
const forceKillBackendProcess = () => {
    exec("lsof -ti:5000", (err, stdout, stderr) => {
        if (err || stderr) {
            console.log("[App]: No existing backend process found.");
            return;
        }

        const pid = stdout.trim();
        if (pid) {
            exec(`kill -9 ${pid}`, (err) => {
                if (err) {
                    console.error(
                        "[App]: Error killing the existing backend process."
                    );
                } else {
                    console.log("[App]: Existing backend process terminated.");
                }
            });
        }
    });
};

// Start the backend process
const startBackend = async () => {
    const portFree = await isPortFree(5000);
    if (!portFree) {
        console.log(
            "[Backend]: Port 5000 is already in use. Skipping backend startup."
        );
        return; // Skip starting backend if the port is in use
    }

    // Start backend process
    backendProcess = spawn("node", ["backend/server.js"], {
        cwd: path.join(__dirname, ".."),
        shell: true,
        env: process.env,
    });

    backendProcess.stdout.on("data", (data) => {
        console.log(`[Backend]: ${data}`);
    });

    backendProcess.stderr.on("data", (data) => {
        console.error(`[Backend Error]: ${data}`);
    });

    backendProcess.on("close", (code) => {
        console.log(`[Backend] Process exited with code ${code}`);
    });
};

// Gracefully terminate the backend process when the app quits
const cleanupBackendProcess = () => {
    if (backendProcess) {
        console.log("[App]: Terminating backend process...");
        backendProcess.kill("SIGINT"); // Gracefully terminate backend
    } else {
        console.log("[App]: No backend process found to terminate.");
    }
};

// Initialize the app
app.whenReady().then(async () => {
    await forceKillBackendProcess(); // Force kill any existing backend processes
    await startBackend(); // Start backend if the port is free
    createWindow();
});

// Handle window close events
app.on("window-all-closed", () => {
    if (process.platform !== "darwin") {
        app.quit();
    }
});

// Handle quit event to ensure cleanup of backend process
app.on("quit", () => {
    console.log("[App]: Quit event triggered.");
    cleanupBackendProcess(); // Ensure backend process is cleaned up on quit
});

// Recreate the window on activation if no windows are open
app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
