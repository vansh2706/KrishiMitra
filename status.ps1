#!/usr/bin/env powershell
# KrishiMitra Quick Status Check and Commands

Write-Host "=== KrishiMitra Development Commands ===" -ForegroundColor Green
Write-Host ""

# Check if server is running
Write-Host "Checking if development server is running..." -ForegroundColor Yellow
$serverRunning = $false
try {
    $response = Invoke-WebRequest -Uri "http://localhost:3000/api/health" -TimeoutSec 5 -ErrorAction SilentlyContinue
    if ($response.StatusCode -eq 200) {
        $serverRunning = $true
        Write-Host "✅ Development server is RUNNING at http://localhost:3000" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Development server is NOT running" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== Available Commands ===" -ForegroundColor Cyan
Write-Host "1. Start development server:" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor Yellow
Write-Host ""
Write-Host "2. Build for production:" -ForegroundColor White
Write-Host "   npm run build" -ForegroundColor Yellow
Write-Host ""
Write-Host "3. Start production server:" -ForegroundColor White
Write-Host "   npm run start" -ForegroundColor Yellow
Write-Host ""
Write-Host "4. Check code quality:" -ForegroundColor White
Write-Host "   npm run lint" -ForegroundColor Yellow
Write-Host ""
Write-Host "5. Install dependencies:" -ForegroundColor White
Write-Host "   npm install" -ForegroundColor Yellow
Write-Host ""
Write-Host "6. Check application health:" -ForegroundColor White
Write-Host "   curl http://localhost:3000/api/health" -ForegroundColor Yellow
Write-Host ""

if ($serverRunning) {
    Write-Host "=== Your KrishiMitra App is Ready! ===" -ForegroundColor Green
    Write-Host "🌐 Open browser: http://localhost:3000" -ForegroundColor White
    Write-Host "🔧 Health Check: http://localhost:3000/api/health" -ForegroundColor White
    Write-Host "📱 Features: AI Advisor, Weather, Pest Detection, Market Prices" -ForegroundColor White
} else {
    Write-Host "=== To Start Your App ===" -ForegroundColor Yellow
    Write-Host "Run: npm run dev" -ForegroundColor Cyan
    Write-Host "Then open: http://localhost:3000" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "=== Project Info ===" -ForegroundColor Magenta
Write-Host "• Framework: Next.js 14.2.0 with React 18.3.1" -ForegroundColor White
Write-Host "• Languages: 8 Indian languages supported" -ForegroundColor White
Write-Host "• Features: PWA, Offline support, Voice synthesis" -ForegroundColor White
Write-Host "• Status: Production-ready agricultural assistant" -ForegroundColor White
Write-Host ""