# KhubleLabs Wrapper Framework

This project is powered by the custom-built **KhubleLabs Wrapper Framework v1.0**.
It is a 100% in-house desktop engine that interfaces directly with the native Windows or macOS operating system using raw Node.js child processes.

## How to Launch the Native Setup Wizard

1. Download the ZIP file of this project using the Export button.
2. Extract the files and open the folder in your terminal.
3. Install the standard dependencies:
   ```bash
   npm install
   ```
4. Build the core source code:
   ```bash
   npm run build
   ```
5. Launch the Custom KhubleLabs Setup Wizard:
   ```bash
   npm run start:installer
   ```

This will launch the beautiful, Windows 11-styled Native Installer UI that you provided!

## How to launch the App directly (Bypass Installer)

```bash
npm run start:desktop
```
