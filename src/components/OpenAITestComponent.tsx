'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Mic, Volume2, MessageSquare, RefreshCw } from 'lucide-react'
import { openaiChat, openaiSpeechToText, playTTSAudio, checkOpenAIServices, type ChatMessage } from '@/openai-api'

export function OpenAITestComponent() {
    const [inputText, setInputText] = useState('')
    const [response, setResponse] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isRecording] = useState(false)
    const [serviceStatus, setServiceStatus] = useState(checkOpenAIServices())
    const [audioFile, setAudioFile] = useState<File | null>(null)

    const handleChatTest = async () => {
        if (!inputText.trim()) return

        setIsLoading(true)
        try {
            const messages: ChatMessage[] = [
                {
                    role: 'user',
                    content: inputText
                }
            ]

            const chatResponse = await openaiChat({
                model: 'gpt-4o-mini',
                messages,
                temperature: 0.7,
                max_tokens: 150
            }, 'en')

            const responseText = chatResponse.choices[0]?.message?.content || 'No response received'
            setResponse(responseText)
        } catch (error) {
            console.error('Chat test error:', error)
            setResponse('Error: ' + (error as Error).message)
        } finally {
            setIsLoading(false)
        }
    }

    const handleTTSTest = async () => {
        if (!response) return

        try {
            await playTTSAudio(response, 'alloy')
        } catch (error) {
            console.error('TTS test error:', error)
        }
    }

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0]
        if (file && file.type.startsWith('audio/')) {
            setAudioFile(file)
        }
    }

    const handleSTTTest = async () => {
        if (!audioFile) return

        setIsLoading(true)
        try {
            const transcription = await openaiSpeechToText(audioFile, 'en')
            setInputText(transcription)
        } catch (error) {
            console.error('STT test error:', error)
            setInputText('Error: ' + (error as Error).message)
        } finally {
            setIsLoading(false)
        }
    }

    const refreshStatus = () => {
        setServiceStatus(checkOpenAIServices())
    }

    return (
        <div className="max-w-2xl mx-auto space-y-6 p-4">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MessageSquare className="w-5 h-5" />
                        OpenAI Integration Test
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={refreshStatus}
                            className="ml-auto"
                        >
                            <RefreshCw className="w-4 h-4" />
                        </Button>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    {/* Service Status */}
                    <div className="flex gap-2">
                        <Badge variant={serviceStatus.chatbot ? 'default' : 'destructive'}>
                            Chat: {serviceStatus.chatbot ? 'Available' : 'Unavailable'}
                        </Badge>
                        <Badge variant={serviceStatus.speechToText ? 'default' : 'secondary'}>
                            STT: {serviceStatus.speechToText ? 'Available' : 'Unavailable'}
                        </Badge>
                        <Badge variant={serviceStatus.textToSpeech ? 'default' : 'secondary'}>
                            TTS: {serviceStatus.textToSpeech ? 'Available' : 'Unavailable'}
                        </Badge>
                    </div>

                    {/* Chat Test */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">💬 Chat Test</h3>
                        <div className="flex gap-2">
                            <Input
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                placeholder="Ask about farming: How to grow wheat?"
                                onKeyPress={(e) => e.key === 'Enter' && handleChatTest()}
                            />
                            <Button
                                onClick={handleChatTest}
                                disabled={isLoading || !inputText.trim()}
                            >
                                {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : 'Send'}
                            </Button>
                        </div>

                        {response && (
                            <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                <p className="text-sm">{response}</p>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={handleTTSTest}
                                    className="mt-2"
                                    disabled={!serviceStatus.textToSpeech}
                                >
                                    <Volume2 className="w-4 h-4 mr-2" />
                                    Play Response
                                </Button>
                            </div>
                        )}
                    </div>

                    {/* Speech to Text Test */}
                    <div className="space-y-3">
                        <h3 className="font-semibold">🎙️ Speech to Text Test</h3>
                        <div className="flex gap-2">
                            <Input
                                type="file"
                                accept="audio/*"
                                onChange={handleFileUpload}
                                disabled={!serviceStatus.speechToText}
                            />
                            <Button
                                onClick={handleSTTTest}
                                disabled={!audioFile || !serviceStatus.speechToText}
                            >
                                <Mic className="w-4 h-4 mr-2" />
                                Transcribe
                            </Button>
                        </div>
                    </div>

                    {/* Example Usage */}
                    <div className="space-y-3 border-t pt-4">
                        <h3 className="font-semibold">📝 Example Usage</h3>
                        <div className="text-sm space-y-2 text-gray-600 dark:text-gray-400">
                            <p><strong>1. Chat:</strong> &quot;What is the best time to plant rice in India?&quot;</p>
                            <p><strong>2. Voice:</strong> Upload an audio file asking about farming</p>
                            <p><strong>3. TTS:</strong> Click &quot;Play Response&quot; to hear AI response</p>
                        </div>
                    </div>

                    {/* API Key Status */}
                    {!serviceStatus.chatbot && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
                            <p className="text-sm text-yellow-700 dark:text-yellow-300">
                                <strong>⚠️ API Key Required:</strong> Add your OpenAI API key to .env.local file:
                                <br />
                                <code className="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">
                                    OPENAI_API_KEY=sk-your-key-here
                                </code>
                            </p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}