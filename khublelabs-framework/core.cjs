const { spawn, exec } = require('child_process');
const os = require('os');
const path = require('path');

console.log("==================================================");
console.log("       KhubleLabs Wrapper Framework v1.0.0        ");
console.log("  100% In-House Custom Desktop Engine             ");
console.log("==================================================");
console.log("[KhubleLabs] Initializing core system...");

// Step 1: Start the internal Web Engine (Express + React)
console.log("[KhubleLabs] Booting internal server infrastructure...");
const serverProcess = spawn('npm', ['run', 'start'], {
  cwd: path.join(__dirname, '..'),
  shell: true,
  stdio: 'pipe'
});

serverProcess.stdout.on('data', (data) => {
  if (data.toString().includes('Server running on')) {
    console.log("[KhubleLabs] Core server online.");
    launchNativeWindow();
  }
});

serverProcess.stderr.on('data', (data) => {
  console.error(`[KhubleLabs Error]: ${data}`);
});

// Step 2: Bridge to the native OS window without Electron
function launchNativeWindow() {
  console.log("[KhubleLabs] Hooking into native OS window manager...");
  const targetUrl = 'http://localhost:3000';
  const platform = os.platform();

  let command;
  if (platform === 'win32') {
    // Windows: Force MS Edge or Chrome into a standalone frameless App Window
    command = `start msedge --app=${targetUrl} || start chrome --app=${targetUrl}`;
  } else if (platform === 'darwin') {
    // macOS: Force Chrome into App Window mode
    command = `open -n -a "Google Chrome" --args --app=${targetUrl}`;
  } else {
    // Linux
    command = `google-chrome --app=${targetUrl}`;
  }

  exec(command, (err) => {
    if (err) {
      console.log("[KhubleLabs] App window rendering failed, falling back to OS default...");
      const fallback = platform === 'win32' ? `start ${targetUrl}` : platform === 'darwin' ? `open ${targetUrl}` : `xdg-open ${targetUrl}`;
      exec(fallback);
    } else {
      console.log("[KhubleLabs] Native desktop window spawned successfully.");
    }
  });
}

// Ensure graceful shutdown of our custom framework
process.on('SIGINT', () => {
  console.log("\n[KhubleLabs] Shutting down framework...");
  serverProcess.kill();
  process.exit();
});
