import { useState, useCallback, useEffect } from 'react'
import { useLanguage } from '@/hooks/useLanguage'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Sprout, Share2, Volume2, Mic, MicOff } from 'lucide-react'

// TypeScript declarations for Web Speech API
declare global {
    interface Window {
        webkitSpeechRecognition: any;
        SpeechRecognition: any;
    }
}

interface SpeechRecognitionError extends Event {
    error: string;
    message?: string;
}

interface SpeechRecognitionEvent extends Event {
    results: SpeechRecognitionResultList;
    resultIndex: number;
    emma?: Document;
}

interface VoiceState {
    isListening: boolean;
    error: string | null;
    supported: boolean;
}

interface FormattedResponse {
    text: string;
    recommendations?: string[];
    warnings?: string[];
    relatedTopics?: string[];
    timestamp: number;
}

interface QueryHistoryItem {
    query: string;
    response: FormattedResponse;
    timestamp: number;
}

interface TopicMapping {
    keywords: string[];
    agricultureContext: string;
    examples: string[];
}

const TOPIC_MAPPINGS: Record<string, TopicMapping> = {
    irrigation: {
        keywords: ['water', 'irrigation', 'drip', 'sprinkler', 'moisture', 'watering'],
        agricultureContext: 'water management and irrigation systems',
        examples: [
            'Drip irrigation setup',
            'Water conservation methods',
            'Irrigation scheduling',
            'Smart watering systems'
        ]
    },
    soilHealth: {
        keywords: ['soil', 'fertility', 'nutrient', 'organic', 'compost', 'fertilizer'],
        agricultureContext: 'soil health and fertility management',
        examples: [
            'Soil testing methods',
            'Organic fertilizers',
            'Composting techniques',
            'Nutrient management'
        ]
    },
    cropProtection: {
        keywords: ['disease', 'pest', 'protection', 'spray', 'treatment', 'prevention'],
        agricultureContext: 'crop protection and disease management',
        examples: [
            'Integrated pest management',
            'Disease identification',
            'Organic pest control',
            'Preventive measures'
        ]
    }
};

// Function to determine the query context and generate a response
interface WeatherData {
    temperature: number;
    humidity: number;
    rainfall: number;
    forecast: string;
    windSpeed: number;
}

interface LocationData {
    district: string;
    state: string;
    soilType: string;
    nearestMarket: string;
}

interface MarketData {
    cropPrices: Record<string, number>;
    demandTrends: Record<string, 'high' | 'medium' | 'low'>;
}

const getCurrentSeason = (): string => {
    const month = new Date().getMonth();
    if (month >= 6 && month <= 9) return 'Kharif';
    if (month >= 10 || month <= 1) return 'Rabi';
    return 'Zaid';
};

const fetchWeatherData = async (): Promise<WeatherData> => {
    try {
        const response = await fetch('/api/weather');
        if (!response.ok) throw new Error('Weather data fetch failed');
        return await response.json();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        return {
            temperature: 25,
            humidity: 65,
            rainfall: 0,
            forecast: 'sunny',
            windSpeed: 10
        };
    }
};

const fetchLocationData = async (): Promise<LocationData> => {
    try {
        const response = await fetch('/api/location');
        if (!response.ok) throw new Error('Location data fetch failed');
        return await response.json();
    } catch (error) {
        console.error('Error fetching location data:', error);
        return {
            district: 'Unknown',
            state: 'Unknown',
            soilType: 'Unknown',
            nearestMarket: 'Unknown'
        };
    }
};

const fetchMarketData = async (): Promise<MarketData> => {
    try {
        const response = await fetch('/api/market-prices');
        if (!response.ok) throw new Error('Market data fetch failed');
        return await response.json();
    } catch (error) {
        console.error('Error fetching market data:', error);
        return {
            cropPrices: {},
            demandTrends: {}
        };
    }
};

const AI_ENDPOINTS = {
    gemini: '/api/gemini',
    openai: '/api/openai',
    fallback: '/api/agriculture-ai'
};

const generateAgricultureResponse = async (query: string): Promise<string> => {
    try {
        // Attempt to get the topic context first
        const detectedTopic = Object.entries(TOPIC_MAPPINGS).find(([_, mapping]) =>
            mapping.keywords.some(keyword => query.toLowerCase().includes(keyword))
        )?.[0] || 'general';

        // Initialize context with guaranteed data
        const currentSeason = getCurrentSeason();
        const currentHour = new Date().getHours();
        const timeOfDay = currentHour < 12 ? 'morning' : currentHour < 17 ? 'afternoon' : 'evening';

        // Function to call an AI endpoint with fallback
        const callAIEndpoint = async (endpoint: string, payload: any) => {
            try {
                const response = await fetch(endpoint, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                if (!data.text || typeof data.text !== 'string' || data.text.length < 50) {
                    throw new Error('Invalid response format or too short');
                }

                return data.text;
            } catch (error) {
                console.error(`Error with ${endpoint}:`, error);
                throw error;
            }
        };

        // Build the base prompt
        let prompt = `
            Query: "${query}"
            Topic: ${detectedTopic}
            Season: ${currentSeason}
            Time: ${timeOfDay}
            Context: ${TOPIC_MAPPINGS[detectedTopic]?.agricultureContext || 'general agriculture advice'}
        `;

        // Try to enrich with additional context
        try {
            const [weatherData, locationData, marketData] = await Promise.allSettled([
                fetchWeatherData(),
                fetchLocationData(),
                fetchMarketData()
            ]);

            // Add available weather context
            if (weatherData.status === 'fulfilled') {
                prompt += `\nWeather Context:
                - Temperature: ${weatherData.value.temperature}°C
                - Humidity: ${weatherData.value.humidity}%
                - Rainfall: ${weatherData.value.rainfall}mm
                - Forecast: ${weatherData.value.forecast}
                - Wind Speed: ${weatherData.value.windSpeed}km/h`;
            }

            // Add available location context
            if (locationData.status === 'fulfilled') {
                prompt += `\nLocation Context:
                - District: ${locationData.value.district}
                - State: ${locationData.value.state}
                - Soil Type: ${locationData.value.soilType}
                - Nearest Market: ${locationData.value.nearestMarket}`;
            }

            // Add available market context
            if (marketData.status === 'fulfilled' && Object.keys(marketData.value.cropPrices).length > 0) {
                prompt += '\nMarket Context:';
                Object.entries(marketData.value.cropPrices).forEach(([crop, price]) => {
                    const demand = marketData.value.demandTrends[crop] || 'unknown';
                    prompt += `\n- ${crop}: ₹${price}/kg (Demand: ${demand})`;
                });
            }
        } catch (error) {
            console.error('Error fetching context data:', error);
            // Continue with base prompt if context fetching fails
        }

        // Always add the examples from topic mapping
        if (TOPIC_MAPPINGS[detectedTopic]?.examples) {
            prompt += '\nRelevant Examples:\n' + TOPIC_MAPPINGS[detectedTopic].examples.join('\n');
        }

        // Try OpenAI first (primary provider)
        try {
            const response = await fetch('/api/openai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    messages: [
                        {
                            role: 'system',
                            content: getAgriculturalSystemPrompt()
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    model: 'gpt-4o-mini'
                })
            });

            if (!response.ok) {
                throw new Error('OpenAI API error');
            }

            const data = await response.json();
            const content = data.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

            // Validate response length
            if (content.length < 50) {
                throw new Error('Response too short or empty');
            }

            return content;
        } catch (openAIError) {
            console.log('OpenAI failed, falling back to agriculture-ai endpoint:', openAIError);
            // Fallback to the agriculture-ai endpoint (which now uses OpenAI primary with Gemini fallback)
            const response = await fetch('/api/agriculture-ai', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    query,
                    prompt,
                    topic: detectedTopic,
                    season: currentSeason
                })
            });

            if (!response.ok) {
                throw new Error('Failed to get response');
            }

            const data = await response.json();

            // Validate response length
            if (!data.text || data.text.length < 50) {
                throw new Error('Response too short or empty');
            }

            return data.text;
        }
    } catch (err) {
        console.error('Error in agriculture response:', err);
        const error = err as Error;
        if (error.message === 'Response too short or empty') {
            return 'I apologize, but I need to provide a more complete answer. Could you please ask your question again?';
        }
        throw err;
    }
};

function getAgriculturalSystemPrompt(): string {
    return `You are an expert agricultural advisor helping Indian farmers. You have comprehensive knowledge about crops, soil, irrigation, pest control, and modern farming techniques. Always:

1. Provide practical and actionable advice
2. Consider local conditions and climate
3. Suggest both traditional and modern approaches
4. Prioritize safe and environmentally friendly methods
5. Structure responses clearly with numbered points
6. Include specific measurements, timings, and techniques
7. Mention relevant government schemes or subsidies when applicable

Provide detailed, well-structured answers to farmers' questions.`;
}

export function KrishiMitraAI() {
    const { t, language } = useLanguage()
    const [query, setQuery] = useState('')
    const [response, setResponse] = useState<FormattedResponse | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [voiceState, setVoiceState] = useState<VoiceState>({
        isListening: false,
        error: null,
        supported: typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)
    })
    const [queryHistory, setQueryHistory] = useState<QueryHistoryItem[]>(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('krishimitra_history')
            return saved ? JSON.parse(saved) : []
        }
        return []
    })
    const [recognition, setRecognition] = useState<any>(null);

    // Save to local storage
    const saveToHistory = (item: QueryHistoryItem) => {
        const updatedHistory = [item, ...queryHistory].slice(0, 10) // Keep last 10 queries
        setQueryHistory(updatedHistory)
        if (typeof window !== 'undefined') {
            localStorage.setItem('krishimitra_history', JSON.stringify(updatedHistory))
        }
    }

    // Voice recognition setup
    useEffect(() => {
        if (typeof window !== 'undefined' && voiceState.supported) {
            const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
            const recognitionInstance = new SpeechRecognition();
            recognitionInstance.lang = language;
            recognitionInstance.continuous = false;
            recognitionInstance.interimResults = false;

            recognitionInstance.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript;
                setQuery(transcript);
                handleSubmit(new Event('submit') as any);
            };

            recognitionInstance.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error);
                setVoiceState(prev => ({
                    ...prev,
                    error: event.error,
                    isListening: false
                }));
            };

            recognitionInstance.onend = () => {
                setVoiceState(prev => ({
                    ...prev,
                    isListening: false
                }));
            };

            setRecognition(recognitionInstance);
        }
    }, [language]);

    // Voice synthesis
    const speak = (text: string) => {
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.lang = language;
            window.speechSynthesis.speak(utterance);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!query.trim()) return;

        setIsLoading(true)

        try {
            const agricultureResponse = await generateAgricultureResponse(query)
            const formattedResponse: FormattedResponse = {
                text: agricultureResponse,
                recommendations: [],
                warnings: [],
                relatedTopics: Object.values(TOPIC_MAPPINGS)
                    .flatMap(mapping => mapping.examples)
                    .slice(0, 5),
                timestamp: Date.now()
            }
            setResponse(formattedResponse)

            // Save to history
            saveToHistory({
                query,
                response: formattedResponse,
                timestamp: Date.now()
            })

            // Speak response if in voice mode
            if (voiceState.isListening) {
                speak(formattedResponse.text)
            }
        } catch (error) {
            const errorResponse: FormattedResponse = {
                text: t('onlyAgricultureQuestions'),
                timestamp: Date.now()
            }
            setResponse(errorResponse)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Sprout className="h-5 w-5 text-green-600" />
                    {t('krishiMitraAI')}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            placeholder={t('askAboutFarming')}
                            className="flex-1 p-2 border rounded-md"
                        />
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {isLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : t('ask')}
                        </Button>
                        {voiceState.supported && (
                            <Button
                                type="button"
                                variant={voiceState.isListening ? "destructive" : "secondary"}
                                onClick={() => {
                                    if (voiceState.isListening) {
                                        recognition?.stop();
                                    } else {
                                        recognition?.start();
                                    }
                                }}
                            >
                                {voiceState.isListening ? (
                                    <MicOff className="h-4 w-4" />
                                ) : (
                                    <Mic className="h-4 w-4" />
                                )}
                            </Button>
                        )}
                    </div>
                </form>

                {response && (
                    <div className="space-y-4">
                        <div className="p-4 bg-green-50 rounded-md border border-green-200">
                            <div className="flex justify-between items-start">
                                <div className="flex-1">
                                    <p className="text-green-800 whitespace-pre-wrap">{response.text}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={async () => {
                                            const weatherData = await fetchWeatherData();
                                            const locationData = await fetchLocationData();

                                            const shareText = `
🌾 KrishiMitra AI Advice

${response.text}

📍 Location: ${locationData.district}, ${locationData.state}
🌡️ Weather: ${weatherData.temperature}°C, ${weatherData.forecast}
💧 Humidity: ${weatherData.humidity}%
🌱 Soil Type: ${locationData.soilType}
🌺 Season: ${getCurrentSeason()}

${response.recommendations?.length ? `\n💡 Recommendations:\n${response.recommendations.join('\n')}` : ''}
${response.warnings?.length ? `\n⚠️ Warnings:\n${response.warnings.join('\n')}` : ''}

#KrishiMitra #Agriculture #FarmerAdvice
                                            `.trim();

                                            if (navigator.share) {
                                                try {
                                                    await navigator.share({
                                                        title: 'KrishiMitra AI Advice',
                                                        text: shareText,
                                                        url: window.location.href
                                                    });
                                                } catch (error) {
                                                    console.error('Error sharing:', error);
                                                    navigator.clipboard.writeText(shareText);
                                                    alert(t('copiedToClipboard'));
                                                }
                                            } else {
                                                navigator.clipboard.writeText(shareText);
                                                alert(t('copiedToClipboard'));
                                            }
                                        }}
                                    >
                                        <Share2 className="h-4 w-4 mr-1" />
                                        {t('share')}
                                    </Button>
                                    {voiceState.supported && (
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => speak(response.text)}
                                        >
                                            <Volume2 className="h-4 w-4 mr-1" />
                                            {t('speak')}
                                        </Button>
                                    )}
                                </div>
                            </div>

                            {response.recommendations && response.recommendations.length > 0 && (
                                <div className="mt-4">
                                    <h4 className="font-medium text-green-700">{t('recommendations')}</h4>
                                    <ul className="list-disc pl-5 mt-2">
                                        {response.recommendations.map((rec, index) => (
                                            <li key={index} className="text-green-700">{rec}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {response.warnings && response.warnings.length > 0 && (
                                <div className="mt-4 p-2 bg-yellow-50 rounded">
                                    <h4 className="font-medium text-yellow-700">{t('warnings')}</h4>
                                    <ul className="list-disc pl-5 mt-2">
                                        {response.warnings.map((warning, index) => (
                                            <li key={index} className="text-yellow-700">{warning}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </div>

                        {/* Query History */}
                        {queryHistory.length > 0 && (
                            <div className="mt-6">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium">{t('recentQueries')}</h4>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => {
                                            if (window.confirm(t('clearHistoryConfirm'))) {
                                                setQueryHistory([]);
                                                localStorage.removeItem('krishimitra_history');
                                            }
                                        }}
                                    >
                                        {t('clearHistory')}
                                    </Button>
                                </div>
                                <div className="mt-2 space-y-3">
                                    {queryHistory.slice(0, 5).map((item, index) => (
                                        <div
                                            key={index}
                                            className="p-3 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors"
                                        >
                                            <div className="flex items-start justify-between">
                                                <div
                                                    className="cursor-pointer"
                                                    onClick={() => {
                                                        setQuery(item.query);
                                                        setResponse(item.response);
                                                    }}
                                                >
                                                    <p className="text-sm font-medium text-green-800">{item.query}</p>
                                                    <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                                                        {item.response.text}
                                                    </p>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    <Badge variant="outline" className="text-xs">
                                                        {new Date(item.timestamp).toLocaleString()}
                                                    </Badge>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => {
                                                            const updatedHistory = queryHistory.filter((_, i) => i !== index);
                                                            setQueryHistory(updatedHistory);
                                                            localStorage.setItem('krishimitra_history', JSON.stringify(updatedHistory));
                                                        }}
                                                    >
                                                        {t('remove')}
                                                    </Button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </CardContent>
        </Card>
    )
}