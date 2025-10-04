@echo off
echo 🌾 KrishiMitra Local Deployment Script
echo =====================================
echo.

echo 🔍 Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js is not installed or not in PATH!
    echo Please install Node.js 18+ from https://nodejs.org
    echo Make sure to check 'Add to PATH' during installation
    pause
    exit /b 1
)

echo ✅ Node.js is installed
node --version
npm --version
echo.

echo 🔍 Checking environment configuration...
if exist ".env.local" (
    echo ✅ Environment file .env.local found
) else (
    echo ⚠️ Creating .env.local from template...
    copy ".env.example" ".env.local" >nul
    echo ✅ .env.local created
)
echo.

echo 📦 Installing dependencies...
echo This may take a few minutes...
npm install
if %errorlevel% neq 0 (
    echo ❌ Failed to install dependencies!
    echo Try running: npm cache clean --force
    pause
    exit /b 1
)
echo ✅ Dependencies installed successfully!
echo.

echo 🚀 Setup complete! Next steps:
echo ================================
echo 1. Start development server:
echo    npm run dev
echo.
echo 2. Open browser to:
echo    http://localhost:3000
echo.
echo 3. For production build:
echo    npm run build
echo    npm run start
echo.
echo 📝 Note: The app will use mock data until you add real API keys to .env.local
echo.
echo For API keys:
echo • OpenWeatherMap: https://openweathermap.org/api
echo • OpenAI: https://platform.openai.com/api-keys
echo.
echo 🌾 Happy farming with KrishiMitra! 🌾
pause