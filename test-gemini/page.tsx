'use client'

import React, { useState } from 'react'
import { geminiChat } from '../../gemini-api'

export default function TestGeminiPage() {
    const [response, setResponse] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')

    const testGemini = async () => {
        setLoading(true)
        setError('')
        setResponse('')

        try {
            const result = await geminiChat({
                model: 'gemini-2.5-flash',
                messages: [
                    {
                        role: 'user',
                        content: 'Explain in one sentence what is the benefit of using AI in agriculture?'
                    }
                ],
                temperature: 0.7,
                max_tokens: 1000
            })

            setResponse(result.choices[0]?.message?.content || 'No response received')
        } catch (err) {
            console.error('Error testing Gemini:', err)
            setError(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Gemini API Integration Test</h1>

            <div className="mb-6">
                <button
                    onClick={testGemini}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    {loading ? 'Testing...' : 'Test Gemini API'}
                </button>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                    <strong>Error:</strong> {error}
                </div>
            )}

            {response && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <strong>Response:</strong>
                    <p className="mt-2 whitespace-pre-wrap">{response}</p>
                </div>
            )}

            {!response && !error && !loading && (
                <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded">
                    Click the button above to test the Gemini API integration.
                </div>
            )}
        </div>
    )
}