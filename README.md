# Win Driver - Windows Application Driver Testing

A TypeScript project that uses Windows Application Driver (WinAppDriver) to automate, test, and read information from the Windows Calculator application.

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

# Install WinAppDriver

# Send a raw WinAppDriver session request (for testing)
npm run raw-request
npm run install-windriver
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
