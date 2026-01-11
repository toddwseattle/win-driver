# Win Driver - Windows Application Driver Testing

A TypeScript project that uses Windows Application Driver (WinAppDriver) to automate, test, and read information from the Windows Calculator application.

## Requirements

- **Windows OS** (64-bit, 32-bit, or ARM64)
- **Node.js** and npm
- **PowerShell** with execution policies allowing script execution
- Internet connection for downloading WinAppDriver

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

[Additional usage information to be added]

## Project Structure

- `windriver_install.ps1` - PowerShell script for automated WinAppDriver installation
- `scripts/` - Node.js scripts for project automation
- `scripts/install-windriver.js` - Wrapper script to run PowerShell installation with Windows detection
