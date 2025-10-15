import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
    // Check if required environment variables are set
    const geminiApiKey = process.env.GEMINI_API_KEY
    const nextPublicGeminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY
    const openWeatherApiKey = process.env.OPENWEATHER_API_KEY

    return NextResponse.json({
        timestamp: new Date().toISOString(),
        environment: {
            nodeVersion: process.version,
            environment: process.env.NODE_ENV,
        },
        apiKeys: {
            gemini: !!geminiApiKey,
            nextPublicGemini: !!nextPublicGeminiApiKey,
            openWeather: !!openWeatherApiKey,
        },
        // Don't expose actual keys in response for security
        keyStatus: {
            gemini: geminiApiKey ? 'Configured' : 'Missing',
            nextPublicGemini: nextPublicGeminiApiKey ? 'Configured' : 'Missing',
            openWeather: openWeatherApiKey ? 'Configured' : 'Missing',
        }
    })
}