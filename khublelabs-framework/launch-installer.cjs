const { spawn, exec } = require('child_process');
const os = require('os');
const path = require('path');

console.log("==================================================");
console.log("       KhubleLabs Installer Framework v1.0        ");
console.log("==================================================");
console.log("[KhubleLabs] Launching Installer UI...");

function launchNativeWindow() {
  const targetUrl = `file://${path.join(__dirname, 'installer-ui.html')}`;
  const platform = os.platform();

  let command;
  if (platform === 'win32') {
    // Windows: Force MS Edge or Chrome into a standalone frameless App Window
    command = `start msedge --app=${targetUrl} || start chrome --app=${targetUrl}`;
  } else if (platform === 'darwin') {
    // macOS: Force Chrome into App Window mode
    command = `open -n -a "Google Chrome" --args --app="${targetUrl}"`;
  } else {
    // Linux
    command = `google-chrome --app="${targetUrl}"`;
  }

  exec(command, (err) => {
    if (err) {
      console.log("[KhubleLabs] App window rendering failed, falling back to OS default...");
      const fallback = platform === 'win32' ? `start "" "${targetUrl}"` : platform === 'darwin' ? `open "${targetUrl}"` : `xdg-open "${targetUrl}"`;
      exec(fallback);
    } else {
      console.log("[KhubleLabs] Native installer window spawned successfully.");
    }
  });
}

launchNativeWindow();
