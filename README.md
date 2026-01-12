# Win Driver - Windows Application Driver Testing

A TypeScript project that uses Windows Application Driver (WinAppDriver) to automate, test, and read information from the Windows Calculator application.

## Quick Start

1. Enable Windows Developer Mode (see below).
2. Install WinAppDriver: `npm run install-windriver`.
3. Start WinAppDriver locally.
4. Install project dependencies: `npm install`.
5. Run the sample automation: `npm start` or send a raw request: `npm run raw-request`.

## Requirements

- **Windows OS** (64-bit, 32-bit, or ARM64)
- **Windows Developer Mode** enabled
- **Node.js** and npm
- **PowerShell** with execution policies allowing script execution
- Internet connection for downloading WinAppDriver

### Enable Windows Developer Mode

**Important:** Developer Mode must be enabled on your Windows machine before using WinAppDriver in administrator mode.

Run the following commands in **PowerShell (Admin)**:

```powershell
# Check current setting
Get-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense"

# Enable Developer Mode
Set-ItemProperty -Path "HKLM:\SOFTWARE\Microsoft\Windows\CurrentVersion\AppModelUnlock" -Name "AllowDevelopmentWithoutDevLicense" -Value 1
```

After running these commands, you may need to restart your machine for the changes to take effect.

## Installation

### 1. Install WinAppDriver

Run the automated installation script:

```bash
npm run install-windriver
```

This command will:

- Detect your system architecture (64-bit, 32-bit, or ARM64)
- Download the WinAppDriver installer (if not already cached)
- Perform a silent installation
- Verify the installation was successful

**Note:** This script only works on Windows. Running on macOS or Linux will output a message indicating the script is Windows-only.

### 2. Install Project Dependencies

```bash
npm install
```

## Usage

### Available Commands

```bash
# Install WinAppDriver
npm run install-windriver

# Run tests in watch mode
npm test

# Run tests with UI dashboard
npm run test:ui

# Run tests once (with build)
npm run test:run

# Compile TypeScript to JavaScript
npm run build

# Start the calculator application
npm start

# Build and run the calculator
npm run build:run

# Send a raw WinAppDriver session request (for testing)
npm run raw-request
```

### WinAppDriver Client

The `WinAppDriverClient` class provides a WebDriver-compatible interface for automating Windows desktop applications. It handles all communication with the WinAppDriver service and provides convenient methods for:

- **Session Management**: Create and manage automation sessions with target applications
- **Element Finding**: Locate UI elements using various search strategies
- **User Interactions**: Click, type text, clear input fields, and send keyboard commands
- **Element Inspection**: Read text content, attributes, visibility status, and enabled state
- **Window Management**: Switch between windows and get window handles
- **Screenshot Capture**: Take screenshots of the application during testing

See [src/winappdriver-client.ts](src/winappdriver-client.ts) for the full implementation.

## Project Structure

### Raw Request Testing

The `test-raw-request.ts` file provides a simple way to test direct communication with the WinAppDriver service without using the client class. This is useful for debugging connection issues or verifying that WinAppDriver is running correctly.

**Prerequisites:**

- WinAppDriver must be running (typically on `http://127.0.0.1:4723`)
- The Windows Calculator app (Microsoft.WindowsCalculator) must be available

**Run the raw request test:**

```bash
npm run raw-request
```

This script will:

- Connect directly to the WinAppDriver service
- Send a raw session creation request with the Windows Calculator application identifier
- Display the response from WinAppDriver, including session ID and other metadata

**Typical output:**

```json
{
  "status": 0,
  "value": {
    "sessionId": "1234567890abcdef",
    "capabilities": {
      "app": "Microsoft.WindowsCalculator_8wekyb3d8bbwe!App",
      "platformName": "Windows"
    }
  }
}
```

## Project Structure

- `windriver_install.ps1` - PowerShell script for automated WinAppDriver installation
- `scripts/` - Node.js scripts for project automation
- `scripts/install-windriver.js` - Wrapper script to run PowerShell installation with Windows detection

---

## WinAppDriver Setup Guide

### What is WinAppDriver?

WinAppDriver (Windows Application Driver) is a WebDriver implementation for Windows desktop applications, enabling Selenium-style UI automation for UWP, WinForms, WPF, and Win32 apps via the W3C WebDriver protocol.

Official repo: https://github.com/microsoft/WinAppDriver

### Key Features

- Cross-language client support (JavaScript/TypeScript, C#, Java, Python)
- Supports UWP, WinForms, WPF, and classic Win32 applications
- Standards-based W3C WebDriver protocol
- Works with the Windows SDK Inspect.exe tool for element discovery
- Local or remote automation (e.g., Windows VMs) when a GUI session is active

### Install WinAppDriver (Aligned with this repo)

- Recommended: run the project script: `npm run install-windriver`.
  - Executes the PowerShell installer in [scripts/install-windriver.js](scripts/install-windriver.js), which calls [windriver_install.ps1](windriver_install.ps1).
  - Detects architecture and performs a silent install, then verifies installation.
- Manual alternative: download from Releases and install interactively: https://github.com/microsoft/WinAppDriver/releases

### Start WinAppDriver

WinAppDriver listens on `http://127.0.0.1:4723` by default.

PowerShell:

```powershell
# Common install locations (depends on OS/installer)
cd "C:\Program Files\Windows Application Driver"     # 64-bit/ARM64 systems (per our installer)
# or
cd "C:\Program Files (x86)\Windows Application Driver" # Typical x64 installer location

./WinAppDriver.exe
```

You should see:

```
Windows Application Driver listening for requests at: http://127.0.0.1:4723/
Press ENTER to exit.
```

Notes:

- Start WinAppDriver before running scripts/tests in this repo.
- Keep the WinAppDriver console window open while testing.
- Requires an active desktop session (not headless).

### Optional: Inspect.exe (Windows SDK)

Install the Windows SDK to use `inspect.exe` for discovering UI element properties.

- Download: https://developer.microsoft.com/en-us/windows/downloads/windows-sdk/
- Typical path: `C:\Program Files (x86)\Windows Kits\10\bin\<version>\x64\inspect.exe`

### Supported Locator Strategies

| Strategy         | Example               | Use Case                              |
| ---------------- | --------------------- | ------------------------------------- |
| accessibility id | `num5Button`          | Best when `AutomationId` is available |
| xpath            | `//Button[@Name='5']` | Flexible, combine attributes          |
| class name       | `Button`              | Control type                          |
| name             | `5`                   | Visible name/text                     |
| id               | `num5Button`          | Same as accessibility id              |

### Common App IDs

Built-in Windows apps:

```typescript
// Calculator (UWP)
app: "Microsoft.WindowsCalculator_8wekyb3d8bbwe!App";

// Notepad (Classic)
app: "C:\\Windows\\System32\\notepad.exe";

// Paint (UWP)
app: "Microsoft.Paint_8wekyb3d8bbwe!App";

// Settings (UWP)
app: "Windows.ImmersiveControlPanel_cw5n1h2txyewy!microsoft.windows.immersivecontrolpanel";
```

### Troubleshooting

- WinAppDriver won’t start: ensure Developer Mode is enabled and port 4723 is free; try running as Administrator.
- Unable to create session: confirm WinAppDriver is running and the app path/package is correct.
- Elements not found: verify properties with `inspect.exe`; use proper locator strategy; add explicit waits.
- Slow automation: reduce implicit waits; prefer explicit waits; ensure sufficient machine resources.

### Remote Automation (VM/Cloud)

WinAppDriver can run on remote Windows VMs (Azure, AWS, etc.).

- Install WinAppDriver on the VM and keep an RDP session active.
- Allow inbound traffic on port 4723.
- Update connection settings in code (e.g., `hostname` and `port`).

Example:

```typescript
const client = new WinAppDriverClient({
  hostname: "your-vm-ip-address",
  port: 4723,
  app: "Microsoft.WindowsCalculator_8wekyb3d8bbwe!App",
});
```
