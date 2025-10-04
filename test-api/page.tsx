'use client'

import React, { useState, useEffect } from 'react'

export default function TestApiPage() {
    const [healthCheck, setHealthCheck] = useState<any>(null)
    const [geminiTest, setGeminiTest] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const runTests = async () => {
            try {
                // Test health check
                const healthResponse = await fetch('/api/health-check', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                })
                const healthData = await healthResponse.json()
                setHealthCheck(healthData)

                // Test Gemini API
                const geminiResponse = await fetch('/api/gemini', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        messages: [
                            {
                                role: 'user',
                                content: 'Hello, this is a test message'
                            }
                        ],
                        model: 'gemini-2.5-flash',
                        temperature: 0.7,
                        maxTokens: 100
                    }),
                })

                const geminiData = await geminiResponse.json()
                setGeminiTest({
                    status: geminiResponse.status,
                    ok: geminiResponse.ok,
                    data: geminiData
                })
            } catch (err) {
                console.error('Error testing APIs:', err)
                setError(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`)
            } finally {
                setLoading(false)
            }
        }

        runTests()
    }, [])

    if (loading) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">API Test</h1>
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                    Testing APIs...
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6">API Test</h1>
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    <strong>Error:</strong> {error}
                </div>
            </div>
        )
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">API Test Results</h1>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">Health Check</h2>
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(healthCheck, null, 2)}</pre>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold mb-3">Gemini API Test</h2>
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
                    <pre className="whitespace-pre-wrap">{JSON.stringify(geminiTest, null, 2)}</pre>
                </div>
            </div>
        </div>
    )
}