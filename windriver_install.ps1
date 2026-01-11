# PowerShell script to install WinAppDriver

Write-Host "Starting WinAppDriver installation..." -ForegroundColor Green

# Detect OS architecture
Write-Host "Detecting OS architecture..." -ForegroundColor Cyan
$osArchitecture = [System.Runtime.InteropServices.RuntimeInformation]::OSArchitecture
Write-Host "OS Architecture: $osArchitecture" -ForegroundColor Yellow

# Determine installation path based on architecture
if ($osArchitecture -eq "Arm64") {
    $installPath = "C:\Program Files\Windows Application Driver\"
    Write-Host "Detected ARM64 system. Installation path: $installPath" -ForegroundColor Yellow
} elseif ([Environment]::Is64BitOperatingSystem) {
    $installPath = "C:\Program Files\Windows Application Driver\"
    Write-Host "Detected 64-bit system. Installation path: $installPath" -ForegroundColor Yellow
} else {
    $installPath = "C:\Program Files (x86)\Windows Application Driver\"
    Write-Host "Detected 32-bit system. Installation path: $installPath" -ForegroundColor Yellow
}

# Download WinAppDriver installer
$url = "https://github.com/microsoft/WinAppDriver/releases/download/v1.2.99/WindowsApplicationDriver-1.2.99-win-x64.exe"
$output = "$env:TEMP\WinAppDriver.exe"

if (Test-Path $output) {
    Write-Host "WinAppDriver installer already found in $env:TEMP and was not re-downloaded." -ForegroundColor Yellow
} else {
    Write-Host "Downloading WinAppDriver installer..." -ForegroundColor Cyan
    Invoke-WebRequest -Uri $url -OutFile $output
    Write-Host "Successfully downloaded installer to: $output" -ForegroundColor Green
}

# Install (silent install)
Write-Host "Installing WinAppDriver silently..." -ForegroundColor Cyan
Start-Process -FilePath $output -ArgumentList "/S" -Wait
Write-Host "Installation completed." -ForegroundColor Green

# Verify installation
Write-Host "Verifying WinAppDriver installation..." -ForegroundColor Cyan
if (Test-Path $installPath) {
    $files = Get-ChildItem $installPath -ErrorAction SilentlyContinue
    if ($files) {
        Write-Host "WinAppDriver installation verified successfully!" -ForegroundColor Green
        Write-Host "Files found in $installPath`:" -ForegroundColor Green
        $files | Format-Table -AutoSize
    } else {
        Write-Host "Installation path exists but no files found. Installation may have failed." -ForegroundColor Red
    }
} else {
    Write-Host "Installation path not found: $installPath. Installation failed." -ForegroundColor Red
}
