import { NextRequest, NextResponse } from 'next/server'
import { GoogleGenerativeAI } from '@google/generative-ai'

export async function GET() {
    try {
        // Log environment variables for debugging
        console.log('Checking GEMINI_API_KEY:', process.env.GEMINI_API_KEY ? 'SET' : 'NOT_SET')

        // Check if API key is configured
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json({
                success: false,
                error: 'GEMINI_API_KEY not configured',
                envCheck: {
                    geminiKey: process.env.GEMINI_API_KEY ? 'SET' : 'NOT_SET',
                    availableKeys: Object.keys(process.env).filter(key => key.includes('GEMINI'))
                }
            }, { status: 500 })
        }

        // Test the API key by initializing the client
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)

        // Try to get the model
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        // Try a simple prompt
        const result = await model.generateContent('Hello, this is a test. Respond with "Test successful"')
        const response = await result.response.text()

        return NextResponse.json({
            success: true,
            message: 'Gemini API is working correctly',
            testResponse: response,
            apiKeyStatus: 'VALID'
        })

    } catch (error: any) {
        console.error('Gemini API Test Error:', error)
        return NextResponse.json({
            success: false,
            error: error.message,
            apiKeyStatus: 'INVALID'
        }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    return GET()
}