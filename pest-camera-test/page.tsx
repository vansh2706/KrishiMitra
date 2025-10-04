'use client'

import { useState } from 'react'
import { EnhancedPestDetection } from '@/components/EnhancedPestDetection'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PestCameraTest() {
    const [voiceEnabled, setVoiceEnabled] = useState(false)
    
    const speak = (text: string) => {
        if (voiceEnabled && window.speechSynthesis) {
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(text)
            window.speechSynthesis.speak(utterance)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-6xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-2 text-center">Pest Detection Camera Test</h1>
                <p className="text-gray-600 mb-8 text-center">
                    Test the complete pest detection functionality including camera access
                </p>
                
                <Card>
                    <CardHeader>
                        <CardTitle>Enhanced Pest Detection Test</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EnhancedPestDetection 
                            voiceEnabled={voiceEnabled} 
                            onSpeak={speak} 
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}