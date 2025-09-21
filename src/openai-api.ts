// OpenAI API integration for KrishiMitra - Enhanced Implementation
'use client'

import OpenAI from 'openai'

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export interface OpenAIResponse {
    choices: Array<{
        message: {
            content: string
        }
    }>
    citations?: string[]
}

export interface OpenAIRequest {
    model: string
    messages: ChatMessage[]
    temperature?: number
    max_tokens?: number
}

// Enhanced OpenAI Client - follows official SDK patterns
const getOpenAIClient = () => {
    const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY || process.env.OPENAI_API_KEY

    if (!apiKey) {
        console.warn('OpenAI API key not found - using fallback responses')
        return null
    }

    // Remove specific key pattern validation that was blocking valid keys
    return new OpenAI({
        apiKey: apiKey,
        dangerouslyAllowBrowser: true // Only for client-side usage
    })
}

// Main chat function using OpenAI with enhanced agricultural prompts
export async function openaiChat(request: OpenAIRequest, language: string = 'en'): Promise<OpenAIResponse> {
    try {
        const client = getOpenAIClient()

        // Check if we have a valid OpenAI client
        if (!client) {
            console.warn('OpenAI API key not found or invalid, using mock response')
            return getMockResponse(request, language)
        }

        // Enhanced system prompt for agricultural expertise
        const systemPrompt = getAgriculturalSystemPrompt(language)
        const enhancedMessages: ChatMessage[] = [
            { role: 'system', content: systemPrompt },
            ...request.messages.filter(m => m.role !== 'system')
        ]

        const response = await client.chat.completions.create({
            model: request.model || 'gpt-4o-mini', // Use the latest model you mentioned
            messages: enhancedMessages,
            temperature: request.temperature || 0.7,
            max_tokens: request.max_tokens || 1500
        })

        return {
            choices: [{
                message: {
                    content: response.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
                }
            }],
            citations: [
                'https://krishi.mit.gov.in/',
                'https://www.icar.org.in/',
                'https://agricoop.nic.in/'
            ]
        }
    } catch (error) {
        console.error('OpenAI Chat API Error:', error)
        // Fallback to mock response on error
        return getMockResponse(request, language)
    }
}

// Enhanced agricultural system prompt
function getAgriculturalSystemPrompt(language: string): string {
    const prompts = {
        hi: `आप एक विशेषज्ञ कृषि सलाहकार हैं जो भारतीय किसानों की मदद करते हैं। आपको फसलों, मिट्टी, सिंचाई, कीट नियंत्रण, और आधुनिक कृषि तकनीकों के बारे में व्यापक जानकारी है। हमेशा:

1. व्यावहारिक और लागू करने योग्य सलाह दें
2. स्थानीय परिस्थितियों को ध्यान में रखें
3. पारंपरिक और आधुनिक दोनों तरीकों का सुझाव दें
4. सुरक्षा और पर्यावरण के अनुकूल तरीकों को प्राथमिकता दें
5. हिंदी में स्पष्ट और समझने योग्य भाषा का उपयोग करें

किसान के सवालों का विस्तृत, संरचित जवाब दें।`,

        en: `You are an expert agricultural advisor helping Indian farmers. You have comprehensive knowledge about crops, soil, irrigation, pest control, and modern farming techniques. Always:

1. Provide practical and actionable advice
2. Consider local conditions and climate
3. Suggest both traditional and modern approaches
4. Prioritize safe and environmentally friendly methods
5. Structure responses clearly with numbered points
6. Include specific measurements, timings, and techniques
7. Mention relevant government schemes or subsidies when applicable

Provide detailed, well-structured answers to farmers' questions.`
    }

    return prompts[language as keyof typeof prompts] || prompts.en
}

// Mock implementation for development and fallback
function getMockResponse(request: OpenAIRequest, language: string = 'en'): OpenAIResponse {
    const userMessage = request.messages.find(msg => msg.role === 'user')?.content || ''
    const mockResponse = generateMockResponse(userMessage, language)

    return {
        choices: [{
            message: {
                content: mockResponse
            }
        }],
        citations: [
            'https://krishi.mit.gov.in/',
            'https://www.icar.org.in/',
            'https://agricoop.nic.in/'
        ]
    }
}

function generateMockResponse(question: string, language: string): string {
    const lowerQuestion = question.toLowerCase()

    // Hindi responses
    if (language === 'hi') {
        if (lowerQuestion.includes('गेहूं') || lowerQuestion.includes('wheat')) {
            return `गेहूं की खेती के लिए सुझाव:

1. **बुवाई का समय**: अक्टूबर-नवंबर में बुवाई करें
2. **उर्वरक**: NPK (120:60:40) किलो प्रति हेक्टेयर
3. **सिंचाई**: 3-4 सिंचाई की आवश्यकता
4. **कीट नियंत्रण**: नियमित निगरानी रखें

अधिक जानकारी के लिए कृषि विभाग से संपर्क करें।`
        }

        if (lowerQuestion.includes('टमाटर') || lowerQuestion.includes('tomato')) {
            return `टमाटर की देखभाल:

1. **मौसम**: बारिश के दौरान जल निकासी का ध्यान रखें
2. **सहारा**: पौधों को सहारा दें
3. **कीट नियंत्रण**: नीम का तेल छिड़कें
4. **कटाई**: 70-80 दिन में फल तैयार

सफल खेती के लिए नियमित देखभाल जरूरी है।`
        }

        return `आपके कृषि संबंधी प्रश्न के लिए धन्यवाद। यहां कुछ सामान्य खेती के सुझाव हैं:

1. **मिट्टी की स्वास्थ्य**: नियमित जांच और जैविक खाद का उपयोग
2. **फसल चक्र**: बेहतर पैदावार के लिए फसल चक्र अपनाएं
3. **पानी का प्रबंधन**: कुशल सिंचाई प्रणाली
4. **कीट नियंत्रण**: एकीकृत कीट प्रबंधन (IPM)

विशिष्ट सलाह के लिए, कृपया अपनी फसल और स्थान के बारे में अधिक जानकारी प्रदान करें।`
    }

    // English responses
    if (lowerQuestion.includes('fertilizer') || lowerQuestion.includes('soil')) {
        return `Soil and Fertilizer Management:

1. **Soil Testing**: Get your soil tested regularly
2. **Organic Matter**: Add compost and manure
3. **NPK Balance**: Maintain proper nutrient ratio
4. **pH Level**: Keep soil pH between 6.0-7.5

For best results, consult with local agricultural experts.`
    }

    if (lowerQuestion.includes('irrigation') || lowerQuestion.includes('water')) {
        return `Irrigation Best Practices:

1. **Timing**: Early morning or evening
2. **Frequency**: Based on soil moisture
3. **Methods**: Drip irrigation is most efficient
4. **Water Quality**: Use clean, pH-balanced water

Proper irrigation can increase yield by 20-30%.`
    }

    // Default response
    return `Thank you for your agricultural question. Here are some general farming tips:

1. **Soil Health**: Regular testing and organic matter addition
2. **Crop Rotation**: Practice crop rotation for better yields
3. **Water Management**: Efficient irrigation systems
4. **Pest Control**: Integrated Pest Management (IPM)
5. **Technology**: Use modern farming techniques

For specific advice, please provide more details about your crop and location.`
}

// Backward compatibility aliases
export const perplexityChat = openaiChat
export type PerplexityRequest = OpenAIRequest
export type PerplexityResponse = OpenAIResponse

// 🛠 Step 4: Voice Features Implementation
// Speech-to-Text function using OpenAI Whisper
export async function openaiSpeechToText(audioFile: File, language?: string): Promise<string> {
    try {
        const client = getOpenAIClient()

        if (!client) {
            console.warn('OpenAI API key not found or invalid')
            return 'Speech-to-text service unavailable. Please configure the API key.'
        }

        const response = await client.audio.transcriptions.create({
            file: audioFile,
            model: 'whisper-1',
            language: language || 'en' // Auto-detect or use specified language
        })

        return response.text || 'Could not transcribe audio'
    } catch (error) {
        console.error('OpenAI Speech-to-Text Error:', error)
        return 'Speech transcription failed'
    }
}

// Text-to-Speech function using OpenAI TTS 
export async function openaiTextToSpeech(
    text: string,
    voice: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer' = 'alloy'
): Promise<ArrayBuffer | null> {
    try {
        const client = getOpenAIClient()

        if (!client) {
            console.warn('OpenAI API key not found or invalid')
            return null
        }

        const response = await client.audio.speech.create({
            model: 'tts-1',
            voice: voice,
            input: text,
        })

        return response.arrayBuffer()
    } catch (error) {
        console.error('OpenAI Text-to-Speech Error:', error)
        return null
    }
}

// Helper function to check API key availability
export function checkOpenAIServices(): { chatbot: boolean; speechToText: boolean; textToSpeech: boolean } {
    const client = getOpenAIClient()
    const isAvailable = !!client

    return {
        chatbot: isAvailable,
        speechToText: isAvailable,
        textToSpeech: isAvailable
    }
}

// Helper function to play TTS audio
export async function playTTSAudio(text: string, voice?: 'alloy' | 'echo' | 'fable' | 'onyx' | 'nova' | 'shimmer'): Promise<void> {
    try {
        const audioBuffer = await openaiTextToSpeech(text, voice)
        if (audioBuffer) {
            const audioBlob = new Blob([audioBuffer], { type: 'audio/mpeg' })
            const audioUrl = URL.createObjectURL(audioBlob)
            const audio = new Audio(audioUrl)

            await audio.play()

            // Clean up after playing
            audio.addEventListener('ended', () => {
                URL.revokeObjectURL(audioUrl)
            })
        }
    } catch (error) {
        console.error('Error playing TTS audio:', error)
    }
}