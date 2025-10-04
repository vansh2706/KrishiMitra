'use client'

import { EnhancedPestDetection } from '@/components/EnhancedPestDetection'
import { useState } from 'react'

export default function FullPestTest() {
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
                <h1 className="text-3xl font-bold mb-6 text-center">Full Pest Detection Test</h1>
                <p className="text-gray-600 mb-8 text-center">
                    This page tests the complete pest detection functionality including camera access and AI analysis.
                </p>
                
                <EnhancedPestDetection 
                    voiceEnabled={voiceEnabled} 
                    onSpeak={speak} 
                />
            </div>
        </div>
    )
}