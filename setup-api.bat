@echo off
echo Setting up KrishiMitra API Server...
echo.

REM Check if Node.js is installed
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Error: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org/
    pause
    exit /b 1
)

echo Node.js is installed
echo.

REM Navigate to server directory
cd /d "%~dp0server"

REM Check if package.json exists
if not exist "package.json" (
    echo Error: package.json not found in server directory
    pause
    exit /b 1
)

echo Installing server dependencies...
npm install

if %errorlevel% neq 0 (
    echo Error: Failed to install dependencies
    pause
    exit /b 1
)

echo.
echo Dependencies installed successfully!
echo.
echo Starting the API server...
echo The server will run on http://localhost:3001
echo.
echo Press Ctrl+C to stop the server
echo.

npm start

pause
