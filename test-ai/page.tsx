'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { geminiChat } from '@/gemini-api'

export default function TestAIPage() {
    const [input, setInput] = useState('')
    const [response, setResponse] = useState('')
    const [loading, setLoading] = useState(false)

    const handleTest = async () => {
        if (!input.trim()) return

        setLoading(true)
        setResponse('')

        try {
            const result = await geminiChat({
                model: 'gemini-2.5-flash',
                messages: [
                    {
                        role: 'user',
                        content: input
                    }
                ],
                temperature: 0.7,
                max_tokens: 300
            }, 'en')

            setResponse(result.choices[0]?.message?.content || 'No response received')
        } catch (error) {
            console.error('AI Test Error:', error)
            setResponse(`Error: ${error instanceof Error ? error.message : 'Failed to get AI response'}`)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-800 p-4 sm:p-6">
            <div className="max-w-4xl mx-auto">
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="text-2xl font-bold text-center">AI Advisor Test</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex gap-2">
                            <Input
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Ask a question about agriculture..."
                                className="flex-1"
                                disabled={loading}
                            />
                            <Button onClick={handleTest} disabled={loading || !input.trim()}>
                                {loading ? 'Testing...' : 'Test AI'}
                            </Button>
                        </div>

                        {response && (
                            <Card className="bg-gray-50 dark:bg-gray-800">
                                <CardContent className="pt-4">
                                    <h3 className="font-semibold mb-2">AI Response:</h3>
                                    <div className="whitespace-pre-wrap">{response}</div>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}