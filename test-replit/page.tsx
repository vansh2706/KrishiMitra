'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function ReplitTestPage() {
    const [healthStatus, setHealthStatus] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    const checkHealth = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/health')
            const data = await response.json()
            setHealthStatus(data.status === 'ok' ? '✅ Working' : '❌ Not Working')
        } catch (error) {
            setHealthStatus('❌ Error')
            console.error('Health check failed:', error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        checkHealth()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold text-center">
                        KrishiMitra Replit Test
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="text-center">
                        <p className="text-gray-600 mb-4">
                            This page verifies that your KrishiMitra application is properly deployed on Replit.
                        </p>

                        <div className="bg-gray-100 rounded-lg p-4 mb-4">
                            <p className="font-semibold">Health Check Status:</p>
                            <p className="text-lg font-bold mt-2">
                                {loading ? '⏳ Checking...' : healthStatus || '⏳ Initializing...'}
                            </p>
                        </div>

                        <Button
                            onClick={checkHealth}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? 'Checking...' : 'Refresh Status'}
                        </Button>
                    </div>

                    <div className="border-t pt-4">
                        <h3 className="font-semibold mb-2">Next Steps:</h3>
                        <ul className="text-sm text-gray-600 space-y-1">
                            <li>• Update your .env file with API keys</li>
                            <li>• Configure Google OAuth credentials</li>
                            <li>• Test the advisor functionality</li>
                            <li>• Verify pest detection is working</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}