import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    NVIDIA_API_KEY_EXISTS: !!process.env.NVIDIA_API_KEY,
    NVIDIA_API_KEY_LENGTH: process.env.NVIDIA_API_KEY ? process.env.NVIDIA_API_KEY.length : 0,
    NVIDIA_API_KEY_PREVIEW: process.env.NVIDIA_API_KEY ? process.env.NVIDIA_API_KEY.substring(0, 10) + '...' : 'N/A'
  })
}

export async function POST() {
  // Also check in POST requests
  const geminiKey = process.env.GEMINI_API_KEY ? 'SET' : 'NOT_SET'
  const openaiKey = process.env.OPENAI_API_KEY ? 'SET' : 'NOT_SET'

  return NextResponse.json({
    geminiApiKey: geminiKey,
    openaiApiKey: openaiKey,
    message: "Environment variables check",
    timestamp: new Date().toISOString()
  })
}