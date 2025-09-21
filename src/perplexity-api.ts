// Backward compatibility layer for Gemini API integration
// This file redirects to the new Gemini implementation
'use client'

// Re-export everything from the new Gemini API
export {
  geminiChat as perplexityChat,
  type ChatMessage,
  type GeminiResponse as PerplexityResponse,
  type GeminiRequest as PerplexityRequest
} from './gemini-api'
