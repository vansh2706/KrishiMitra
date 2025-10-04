#!/usr/bin/env powershell
# KrishiMitra Local Deployment Script for Windows
# Run this after installing Node.js 18+

Write-Host "🌾 KrishiMitra Local Deployment Script" -ForegroundColor Green
Write-Host "=====================================" -ForegroundColor Green

# Check if Node.js is installed
Write-Host "`n🔍 Checking Node.js installation..." -ForegroundColor Yellow
try {
    $nodeVersion = node --version
    $npmVersion = npm --version
    Write-Host "✅ Node.js version: $nodeVersion" -ForegroundColor Green
    Write-Host "✅ npm version: $npmVersion" -ForegroundColor Green
} catch {
    Write-Host "❌ Node.js is not installed or not in PATH!" -ForegroundColor Red
    Write-Host "Please install Node.js 18+ from https://nodejs.org" -ForegroundColor Yellow
    Write-Host "Make sure to check 'Add to PATH' during installation" -ForegroundColor Yellow
    exit 1
}

# Check Node.js version (require 18+)
$nodeVersionNumber = [version]($nodeVersion -replace 'v', '')
$requiredVersion = [version]"18.0.0"
if ($nodeVersionNumber -lt $requiredVersion) {
    Write-Host "❌ Node.js version 18+ is required. Current: $nodeVersion" -ForegroundColor Red
    exit 1
}

# Check if .env.local exists
Write-Host "`n🔍 Checking environment configuration..." -ForegroundColor Yellow
if (Test-Path ".env.local") {
    Write-Host "✅ Environment file .env.local found" -ForegroundColor Green
} else {
    Write-Host "⚠️ Creating .env.local from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env.local"
    Write-Host "✅ .env.local created. You may want to add your API keys later." -ForegroundColor Green
}

# Install dependencies
Write-Host "`n📦 Installing dependencies..." -ForegroundColor Yellow
Write-Host "This may take a few minutes..." -ForegroundColor Cyan
try {
    npm install
    Write-Host "✅ Dependencies installed successfully!" -ForegroundColor Green
} catch {
    Write-Host "❌ Failed to install dependencies!" -ForegroundColor Red
    Write-Host "Try running: npm cache clean --force" -ForegroundColor Yellow
    exit 1
}

# Check if build is needed
Write-Host "`n🔍 Checking project structure..." -ForegroundColor Yellow
if (Test-Path "package.json") {
    Write-Host "✅ package.json found" -ForegroundColor Green
} else {
    Write-Host "❌ package.json not found! Are you in the correct directory?" -ForegroundColor Red
    exit 1
}

# Display next steps
Write-Host "`n🚀 Setup complete! Next steps:" -ForegroundColor Green
Write-Host "================================" -ForegroundColor Green
Write-Host "1. Start development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Cyan
Write-Host "`n2. Open browser to:" -ForegroundColor White
Write-Host "   http://localhost:3000" -ForegroundColor Cyan
Write-Host "`n3. For production build:" -ForegroundColor White
Write-Host "   npm run build" -ForegroundColor Cyan
Write-Host "   npm run start" -ForegroundColor Cyan
Write-Host "`n📝 Note: The app will use mock data until you add real API keys to .env.local" -ForegroundColor Yellow
Write-Host "`nFor API keys:" -ForegroundColor Yellow
Write-Host "• OpenWeatherMap: https://openweathermap.org/api" -ForegroundColor Cyan
Write-Host "• OpenAI: https://platform.openai.com/api-keys" -ForegroundColor Cyan

Write-Host "`n[SUCCESS] Happy farming with KrishiMitra!" -ForegroundColor Green