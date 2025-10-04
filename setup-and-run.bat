@echo off
echo KrishiMitra Project Setup and Run Script
echo ========================================

echo.
echo Checking if Node.js is installed...
node -v >nul 2>&1
if %errorlevel% == 0 (
    echo Node.js is already installed.
    node -v
) else (
    echo Node.js is not installed.
    echo Please download and install Node.js from https://nodejs.org/en/download
    echo Then run this script again.
    pause
    exit /b
)

echo.
echo Checking if npm is available...
npm -v >nul 2>&1
if %errorlevel% == 0 (
    echo npm is available.
    npm -v
) else (
    echo npm is not available. Please reinstall Node.js.
    pause
    exit /b
)

echo.
echo Installing project dependencies...
npm install

if %errorlevel% == 0 (
    echo Dependencies installed successfully.
) else (
    echo Failed to install dependencies.
    echo Try running 'npm cache clean --force' and then run this script again.
    pause
    exit /b
)

echo.
echo Starting development server...
echo The application will be available at http://localhost:3000
echo Press Ctrl+C to stop the server
echo.
npm run dev