'use client'

import React, { useState } from 'react'

export default function TestDeploymentPage() {
    const [response, setResponse] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string>('')
    const [healthStatus, setHealthStatus] = useState<any>(null)

    const testGeminiAPI = async () => {
        setLoading(true)
        setError('')
        setResponse('')

        try {
            const res = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'user', content: 'What are the benefits of using AI in agriculture?' }
                    ],
                    model: 'gemini-2.5-flash',
                }),
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }

            const data = await res.json()
            setResponse(data.choices[0]?.message?.content || 'No response received')
        } catch (err) {
            console.error('Error testing Gemini API:', err)
            setError(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`)
        } finally {
            setLoading(false)
        }
    }

    const testOpenAIAPI = async () => {
        setLoading(true)
        setError('')
        setResponse('')

        try {
            const res = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        { role: 'user', content: 'What are the benefits of using AI in agriculture?' }
                    ],
                    model: 'gpt-4o-mini',
                }),
            })

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }

            const data = await res.json()
            setResponse(data.choices[0]?.message?.content || 'No response received')
        } catch (err) {
            console.error('Error testing OpenAI API:', err)
            setError(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`)
        } finally {
            setLoading(false)
        }
    }

    const checkHealth = async () => {
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/health-check')

            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`)
            }

            const data = await res.json()
            setHealthStatus(data)
        } catch (err) {
            console.error('Error checking health:', err)
            setError(`Error: ${err instanceof Error ? err.message : 'Unknown error occurred'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Deployment Test</h1>

            <div className="mb-6 space-x-4">
                <button
                    onClick={testGeminiAPI}
                    disabled={loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    {loading ? 'Testing...' : 'Test Gemini API'}
                </button>

                <button
                    onClick={testOpenAIAPI}
                    disabled={loading}
                    className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    {loading ? 'Testing...' : 'Test OpenAI API'}
                </button>

                <button
                    onClick={checkHealth}
                    disabled={loading}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded disabled:opacity-50"
                >
                    {loading ? 'Checking...' : 'Check Health'}
                </button>
            </div>

            {healthStatus && (
                <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded mb-6">
                    <strong>Health Status:</strong>
                    <pre className="mt-2 text-sm whitespace-pre-wrap">{JSON.stringify(healthStatus, null, 2)}</pre>
                </div>
            )}

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

            {!response && !error && !loading && !healthStatus && (
                <div className="bg-gray-100 border border-gray-400 text-gray-700 px-4 py-3 rounded">
                    Click the buttons above to test the API integrations or check the application health.
                </div>
            )}
        </div>
    )
}