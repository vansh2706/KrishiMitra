'use client'

import React, { useState, useRef, useEffect } from 'react'
import { Send, Mic, MicOff, Volume2, VolumeX, Bot, User, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { useLanguage } from '@/hooks/useLanguage'
import { geminiChat, checkGeminiServices, playTTSAudio, type ChatMessage } from '@/gemini-api'
import { getLanguageDisplayName } from '@/utils/languageDetection'

interface Message {
    id: string
    type: 'user' | 'bot'
    content: string
    timestamp: Date
    lang: string
}

interface EnhancedChatBotProps {
    voiceEnabled: boolean
    onSpeak: (text: string) => void
}

export function EnhancedChatBot({ voiceEnabled, onSpeak }: EnhancedChatBotProps) {
    const { t, language, isOnline, detectAndSuggestLanguage, autoSetLanguageFromInput } = useLanguage()
    const [messages, setMessages] = useState<Message[]>([])
    const [isInitialized, setIsInitialized] = useState(false)
    const [inputValue, setInputValue] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [isListening, setIsListening] = useState(false)
    const [voiceSupported, setVoiceSupported] = useState(false)
    const [serviceStatus, setServiceStatus] = useState({ chatbot: false, speechToText: false, textToSpeech: false })
    const [languageSuggestion, setLanguageSuggestion] = useState<{
        show: boolean;
        detectedLang: string;
        confidence: number;
    }>({ show: false, detectedLang: '', confidence: 0 })
    const scrollAreaRef = useRef<HTMLDivElement>(null)
    const recognitionRef = useRef<any>(null)

    // Initialize speech recognition and update language
    useEffect(() => {
        if (typeof window !== 'undefined' && ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
            const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition
            recognitionRef.current = new SpeechRecognition()

            recognitionRef.current.continuous = false
            recognitionRef.current.interimResults = false
            recognitionRef.current.lang = getVoiceLang(language)

            recognitionRef.current.onresult = (event: any) => {
                const transcript = event.results[0][0].transcript
                setInputValue(transcript)
                setIsListening(false)
            }

            recognitionRef.current.onerror = (event: any) => {
                console.error('Speech recognition error:', event.error)
                setIsListening(false)
            }

            recognitionRef.current.onend = () => {
                setIsListening(false)
            }

            setVoiceSupported(true)
        }

        // Update language for existing recognition instance
        if (recognitionRef.current) {
            recognitionRef.current.lang = getVoiceLang(language)
        }
    }, [language])

    // Scroll to bottom when new messages arrive
    useEffect(() => {
        if (scrollAreaRef.current) {
            scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight
        }
    }, [messages])

    // Add welcome message on mount only
    useEffect(() => {
        const services = checkGeminiServices()
        setServiceStatus(services)

        // Only add welcome message if no messages exist (first mount)
        if (messages.length === 0 && !isInitialized) {
            const welcomeMessage: Message = {
                id: '1',
                type: 'bot',
                content: services.chatbot
                    ? language === 'hi'
                        ? `🌾 नमस्ते! मैं आपका स्मार्ट कृषि सहायक हूं।

✨ **नई सुविधा**: अब मैं आपकी भाषा को समझकर उसी में जवाब दूंगा!

💬 आप मुझसे किसी भी भाषा में पूछ सकते हैं:
• हिंदी में: "गेहूं की खेती कैसे करें?"
• English में: "How to grow wheat?"
• தமிழ் में: "கோதுமை விவசாயம் எப்படி?"

🚀 बस टाइप करें, मैं समझ जाऊंगा!`
                        : `🌾 Hello! I'm your intelligent agricultural assistant.

✨ **New Feature**: I can now understand and respond in your preferred language!

💬 You can ask me in any language:
• English: "How to grow wheat?"
• हिंदी में: "गेहूं की खेती कैसे करें?"
• தமிழ் में: "கோதுமை விவசாயம் எப்படி?"
• తెలుగులో: "గోధుమ వ్యవసాయం ఎలా?"

🚀 Just type in your preferred language, I'll understand!`
                    : language === 'hi'
                        ? `नमस्ते! मैं आपका कृषि सहायक हूं। 🌾

⚠️ नोट: बेहतर AI सुविधाओं के लिए Gemini API key की आवश्यकता है। 

📖 सेटअप गाइड देखें: GEMINI_SETUP.md फाइल
🔗 मुफ्त API key पाएं: https://makersuite.google.com/app/apikey

अभी भी मैं बुनियादी कृषि सलाह दे सकता हूं! 💪`
                        : `Hello! I'm your agricultural assistant. 🌾

⚠️ Note: For enhanced AI features, Gemini API key is required.

📖 Setup Guide: Check GEMINI_SETUP.md file
🔗 Get free API key: https://makersuite.google.com/app/apikey

I can still provide basic agricultural advice! 💪`,
                timestamp: new Date(),
                lang: language
            }
            setMessages([welcomeMessage])
            setIsInitialized(true)
        }
    }, []) // Remove language dependency to prevent clearing history

    // Separate effect to update service status when language changes
    useEffect(() => {
        const services = checkGeminiServices()
        setServiceStatus(services)
    }, [language])

    const getVoiceLang = (lang: string): string => {
        const langMap: { [key: string]: string } = {
            'en': 'en-US',
            'hi': 'hi-IN',
            'ta': 'ta-IN',
            'te': 'te-IN',
            'bn': 'bn-IN',
            'gu': 'gu-IN',
            'mr': 'mr-IN',
            'pa': 'pa-IN'
        }
        return langMap[lang] || 'en-US'
    }

    const startVoiceRecognition = () => {
        if (recognitionRef.current && voiceSupported) {
            recognitionRef.current.lang = getVoiceLang(language)
            setIsListening(true)
            recognitionRef.current.start()
        }
    }

    const stopVoiceRecognition = () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop()
            setIsListening(false)
        }
    }

    const generateAIResponse = async (userMessage: string, responseLanguage: string = language): Promise<string> => {
        try {
            // Enhanced: Detect input language for more natural interaction
            const detectedLang = detectAndSuggestLanguage(userMessage).detectedLanguage
            const confidence = detectAndSuggestLanguage(userMessage).confidence
            
            // Handle code-mixed languages (like Hinglish) intelligently
            const isCodeMixed = confidence < 70 && confidence > 30
            
            // Use detected language if confidence is high, or use bilingual approach for code-mixed
            let aiResponseLanguage = responseLanguage
            if (confidence > 70 && detectedLang !== 'en') {
                aiResponseLanguage = detectedLang
            } else if (isCodeMixed && (detectedLang === 'hi' || responseLanguage === 'hi')) {
                // For Hinglish or mixed languages, use a bilingual approach
                aiResponseLanguage = 'hi'
            }
            
            const getSystemMessage = (lang: string) => {
                const messages: Record<string, string> = {
                    hi: `आप भारतीय कृषि विशेषज्ञ हैं। आकर्षक और संरचित उत्तर दें:

✅ हमेशा emoji से शुरुआत करें
📋 मुख्य बिंदुओं को bullet points में दें
💰 लागत/मात्रा शामिल करें (₹ में)
🏛️ सरकारी योजनाओं का उल्लेख करें (PM-KISAN, etc.)
⚠️ सुरक्षा चेतावनी यदि आवश्यक हो
💡 व्यावहारिक टिप्स के साथ समाप्त करें
• हिंदी में ही उत्तर

✨ विशेष: आप किसी भी भाषा में पूछें, मैं समझकर जवाब दूंगा। Hinglish bhi samajh aata hai!`, en: `You are an Indian agricultural expert. Provide ENGAGING and STRUCTURED answers:

✅ Always start with relevant emoji
📋 Use bullet points for main information
💰 Include costs/quantities (in ₹)
🏛️ Reference government schemes (PM-KISAN, etc.)
⚠️ Add safety warnings if needed
💡 End with practical tips
• English language only`,
                    ta: `நீங்கள் இந்திய வேளாண் நிபுணர். கவர்ச்சிகரமான பதில்:

✅ emoji உடன் தொடங்கவும்
📋 bullet points பயன்படுத்தவும்
💰 விலை/அளவு (₹ இல்)
🏛️ அரசு திட்டங்கள் குறிப்பிடவும்
💡 நடைமுறை யோசனைகளுடன் முடிவு
• தமிழில் மட்டும்`,
                    te: `మీరు భారతీయ వ్యవసాయ నిపుణులు. ఆకర్షక సమాధానం:

✅ emoji తో ప్రారంభించండి
📋 bullet points వాడండి
💰 విలువలు/పరిమాణాలు (₹ లో)
🏛️ సర్కారు యోజనల ని చెప్పండి
💡 వ్యవహారిక సలావంతీని
• తెలుగులో మాత్రమే`,
                    bn: `আপনি ভারতীয় কৃষি বিশেষজ্ঞ। আকর্ষণীয় উত্তর:

✅ emoji দিয়ে শুরু করুন
📋 bullet points ব্যবহার করুন
💰 দাম/পরিমাণ (₹ এ)
🏛️ সরকারী পরিকল্পনা উল্লেখ করুন
💡 ব্যবহারিক টিপস দিন
• শুধু বাংলায়`,
                    gu: `તમે ભારતીય કૃષિ નિષ્ણાત છો। આકર્ષક જવાબ:

✅ emoji થી શરુ કરો
📋 bullet points વાપરો
💰 દર/માત્રા (₹ માં)
🏛️ સરકારી યોજના ઉલ્લેખ કરો
💡 વ્યવહારિક સલાહ
• માત્ર ગુજરાતીમાં`,
                    mr: `तुम्ही भारतीय कृषी तज्ञ आहात. आकर्षक उत्तर:

✅ emoji ने सुरू करा
📋 bullet points वापरा
💰 खर्च/प्रमाण (₹ मध्ये)
🏛️ सरकारी योजना सांगा
💡 व्यावहारिक सल्ला
• फक्त मराठीत`,
                    pa: `ਤੁਸੀਂ ਭਾਰਤੀ ਖੇਤੀ ਮਾਹਰ ਹੋ। ਦਿਲਚਸਪ ਜਵਾਬ:

✅ emoji ਨਾਲ ਸ਼ੁਰੂ ਕਰੋ
📋 bullet points ਵਰਤੋ
💰 ਕੀਮਤ/ਮਾਤਰਾ (₹ ਵਿੱਚ)
🏛️ ਸਰਕਾਰੀ ਸਕੀਮਾਂ ਦਾ ਜ਼ਿਕਰ
💡 ਵਿਹਾਰਕ ਸਲਾਹਾਂ
• ਸਿਰਫ਼ ਪੰਜਾਬੀ ਵਿੱਚ`
                }
                return messages[lang] || messages.en
            }

            const systemMessage = getSystemMessage(aiResponseLanguage)

            // Enhanced context: Include user's input language for better understanding
            const enhancedUserMessage = confidence > 70 && detectedLang !== responseLanguage 
                ? `[User is communicating in ${getLanguageName(detectedLang)}] ${userMessage}`
                : isCodeMixed 
                ? `[User is using mixed language/Hinglish] ${userMessage}`
                : userMessage

            const chatMessages: ChatMessage[] = [
                {
                    role: 'system',
                    content: systemMessage
                },
                {
                    role: 'user',
                    content: enhancedUserMessage
                }
            ]

            const response = await geminiChat({
                model: 'gemini-1.5-flash', // Using Gemini model
                messages: chatMessages,
                temperature: 0.7,
                max_tokens: 300
            }, aiResponseLanguage) // Pass detected/preferred language

            return response.choices[0]?.message?.content || getFallbackResponse(userMessage)
        } catch (error) {
            console.error('AI response error:', error)
            return getFallbackResponse(userMessage)
        }
    }

    const getLanguageName = (lang: string): string => {
        const names: { [key: string]: string } = {
            'hi': 'Hindi',
            'ta': 'Tamil',
            'te': 'Telugu',
            'bn': 'Bengali',
            'gu': 'Gujarati',
            'mr': 'Marathi',
            'pa': 'Punjabi'
        }
        return names[lang] || 'English'
    }

    const getFallbackResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase()

        // Check if Gemini API key is missing
        const services = checkGeminiServices()
        if (!services.chatbot) {
            // Provide detailed agricultural advice even without API key
            if (lowerMessage.includes('wheat') || lowerMessage.includes('गेहूं')) {
                return language === 'hi'
                    ? `🌾 **गेहूं की खेती गाइड**

📅 **बुवाई का समय:** अक्टूबर-नवंबर
🌱 **बीज दर:** 100-125 किलो/हेक्टेयर
💧 **सिंचाई:** 4-6 बार आवश्यक
🧪 **उर्वरक:** NPK 120:60:40
🦗 **कीट नियंत्रण:** नीम तेल स्प्रे
📈 **उत्पादन:** 25-30 क्विंटल/हेक्टेयर

💡 **टिप:** मिट्टी परीक्षण कराना जरूरी!`
                    : `🌾 **Wheat Cultivation Guide**

📅 **Sowing Time:** October-November
🌱 **Seed Rate:** 100-125 kg/hectare
💧 **Irrigation:** 4-6 times needed
🧪 **Fertilizer:** NPK 120:60:40
🦗 **Pest Control:** Neem oil spray
📈 **Expected Yield:** 25-30 quintals/hectare

💡 **Tip:** Soil testing is essential!`
            }

            if (lowerMessage.includes('rice') || lowerMessage.includes('धान') || lowerMessage.includes('चावल')) {
                return language === 'hi'
                    ? `चावल की खेती के बारे में:

🌾 बुवाई: जून-जुलाई (खरीफ)
💧 पानी: लगातार खड़े पानी की आवश्यकता
🌱 रोपण: 20-25 दिन की पौध
🧪 उर्वरक: नाइट्रोजन की अधिक आवश्यकता
🦗 मुख्य कीट: तना छेदक, पत्ती लपेटक`
                    : `Rice Cultivation Guide:

🌾 Sowing: June-July (Kharif)
💧 Water: Continuous standing water required
🌱 Transplanting: 20-25 day old seedlings
🧪 Fertilizer: High nitrogen requirement
🦗 Major Pests: Stem borer, leaf folder`
            }

            if (lowerMessage.includes('tomato') || lowerMessage.includes('टमाटर')) {
                return language === 'hi'
                    ? `टमाटर की खेती:

🍅 बुवाई: साल भर (सिंचित क्षेत्र)
🌡️ तापमान: 20-25°C आदर्श
💧 जल प्रबंधन: ड्रिप सिंचाई सर्वोत्तम
🦠 मुख्य रोग: अगेती झुलसा, पछेती झुलसा
📈 उत्पादन: 300-500 क्विंटल प्रति हेक्टेयर`
                    : `Tomato Cultivation:

🍅 Sowing: Year-round (irrigated areas)
🌡️ Temperature: 20-25°C ideal
💧 Water Management: Drip irrigation best
🦠 Major Diseases: Early blight, late blight
📈 Yield: 300-500 quintals/hectare`
            }

            return language === 'hi'
                ? `आपका सवाल: ${userMessage}

AI सुविधा उपलब्ध नहीं है, लेकिन यहाँ कुछ सामान्य कृषि सलाह है:

• नियमित मिट्टी जांच कराएं
• फसल चक्र अपनाएं
• जैविक खाद का उपयोग करें
• एकीकृत कीट प्रबंधन अपनाएं
• मौसम आधारित सलाह लें

अधिक जानकारी के लिए अन्य टूल्स का उपयोग करें।`
                : `Your question: ${userMessage}

AI feature unavailable, but here's general agricultural advice:

• Conduct regular soil testing
• Practice crop rotation
• Use organic fertilizers
• Implement integrated pest management
• Follow weather-based advisories

Use other tools for more specific information.`
        }

        // Basic keyword-based responses for when API is available but fails
        if (lowerMessage.includes('weather') || lowerMessage.includes('rain') || lowerMessage.includes('मौसम')) {
            return language === 'hi'
                ? 'मौसम की नियमित जांच करें और सिंचाई की योजना बनाएं। Weather Dashboard का उपयोग करें।'
                : 'Check weather conditions regularly and plan irrigation accordingly. Use the Weather Dashboard.'
        }
        if (lowerMessage.includes('pest') || lowerMessage.includes('insect') || lowerMessage.includes('कीट')) {
            return language === 'hi'
                ? 'फसलों में कीट की नियमित निगरानी करें। एकीकृत कीट प्रबंधन का उपयोग करें। Pest Detection टूल का उपयोग करें।'
                : 'Monitor crops regularly for pest activity. Use integrated pest management practices. Try the Pest Detection tool.'
        }
        if (lowerMessage.includes('soil') || lowerMessage.includes('fertilizer') || lowerMessage.includes('मिट्टी')) {
            return language === 'hi'
                ? 'नियमित मिट्टी परीक्षण कराएं और मिट्टी की सेहत के अनुसार उर्वरक डालें। Soil Guide देखें।'
                : 'Get soil tested regularly and apply fertilizers based on soil health. Check the Soil Guide.'
        }
        if (lowerMessage.includes('price') || lowerMessage.includes('market') || lowerMessage.includes('बाजार')) {
            return language === 'hi'
                ? 'विश्वसनीय स्रोतों से बाजार मूल्यों की निगरानी करें। Market Prices टूल का उपयोग करें।'
                : 'Monitor market prices through reliable sources. Use the Market Prices tool.'
        }

        return language === 'hi'
            ? 'कृषि संबंधी प्रश्न के लिए धन्यवाद। विशिष्ट सलाह के लिए स्थानीय कृषि विशेषज्ञों से सलाह लें या हमारे अन्य टूल्स का उपयोग करें।'
            : 'Thank you for your agricultural question. For specific advice, please consult with local agricultural experts or use our other tools.'
    }

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return

        // Enhanced: Detect input language for intelligent response
        const inputDetection = detectAndSuggestLanguage(inputValue)
        const detectedLang = inputDetection.detectedLanguage
        const confidence = inputDetection.confidence
        
        // Use detected language if confidence is high, otherwise use current app language
        const messageLanguage = (confidence > 70 && detectedLang !== 'en') ? detectedLang : language
        
        // Show language suggestion only for significant language switches
        if (inputDetection.shouldSuggest && confidence > 80 && detectedLang !== language) {
            setLanguageSuggestion({
                show: true,
                detectedLang: detectedLang,
                confidence: confidence
            })
        } else {
            setLanguageSuggestion({ show: false, detectedLang: '', confidence: 0 })
        }

        const userMessage: Message = {
            id: Date.now().toString(),
            type: 'user',
            content: inputValue.trim(),
            timestamp: new Date(),
            lang: detectedLang // Store detected language with message
        }

        setMessages(prev => [...prev, userMessage])
        setInputValue('')
        setIsLoading(true)

        try {
            // Generate AI response in the detected/preferred language
            const aiResponse = await generateAIResponse(userMessage.content, messageLanguage)

            const botMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: aiResponse,
                timestamp: new Date(),
                lang: messageLanguage // AI responds in the same language
            }

            setMessages(prev => [...prev, botMessage])

            // Manual speech output - only speak when user clicks the speech button
            if (voiceEnabled && aiResponse) {
                // Don't auto-speak, let user control when to hear the response
                // onSpeak(aiResponse)
            }
        } catch (error) {
            console.error('Error generating response:', error)
            const errorMessage: Message = {
                id: (Date.now() + 1).toString(),
                type: 'bot',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
                lang: language
            }
            setMessages(prev => [...prev, errorMessage])
        } finally {
            setIsLoading(false)
        }
    }

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSendMessage()
        }
    }

    const getQuickQuestions = () => {
        const questions: Record<string, string[]> = {
            hi: [
                'इस मौसम में कौन सी फसल बोनी चाहिए?',
                'कीट नुकसान से कैसे बचाव करें?',
                'गेहूं के लिए सबसे अच्छा उर्वरक?',
                'चावल की कटाई कब करें?',
                'कपास की सिंचाई का समय?',
                'मिट्टी तैयार करने के तरीके?'
            ],
            en: [
                'What crops should I plant this season?',
                'How to prevent pest damage?',
                'Best fertilizer for wheat?',
                'When to harvest rice?',
                'Irrigation schedule for cotton?',
                'Soil preparation tips?'
            ],
            ta: [
                'இந்த பருவத்தில் எந்த பயிர் நடவேண்டும்?',
                'பூச்சி தாக்குதலை எப்படி தடுப்பது?',
                'கோதுமைக்கு சிறந்த உரம்?',
                'நெல் அறுவடை எப்போது?',
                'பருத்திக்கு நீர்ப்பாசன அட்டவணை?',
                'மண் தயாரிப்பு வழிகள்?'
            ],
            te: [
                'ఈ సీజన్‌లో ఏ పంట వేయాలి?',
                'పురుగుల నష్టాన్ని ఎలా నివారించాలి?',
                'గోధుమకు ఉత్తమ ఎరువు?',
                'వరిని ఎప్పుడు కోయాలి?',
                'పత్తికి నీటిపారుదల కాలక్రమం?',
                'మట్టి తయారీ చిట్కాలు?'
            ],
            bn: [
                'এই মৌসুমে কোন ফসল বপন করব?',
                'পোকার ক্ষতি থেকে কীভাবে রক্ষা পাব?',
                'গমের জন্য সেরা সার?',
                'ধান কাটার সময় কখন?',
                'তুলার সেচের সময়সূচী?',
                'মাটি প্রস্তুতির উপায়?'
            ],
            gu: [
                'આ મોસમમાં કયા પાક વાવવા?',
                'જંતુના નુકસાનથી કેવી રીતે બચાવ?',
                'ઘઉં માટે શ્રેષ્ઠ ખાતર?',
                'ચોખાની કાપણી ક્યારે?',
                'કપાસ માટે સિંચાઈનું શેડ્યૂલ?',
                'માટી તૈયાર કરવાની ટિપ્સ?'
            ],
            mr: [
                'या हंगामात कोणते पीक पेरावे?',
                'कीड नुकसानीपासून कसे बचाव?',
                'गहूसाठी सर्वोत्तम खत?',
                'भात कापणीची वेळ कधी?',
                'कापसाच्या पाण्याचे वेळापत्रक?',
                'जमीन तयार करण्याच्या टिपा?'
            ],
            pa: [
                'ਇਸ ਸੀਜ਼ਨ ਵਿੱਚ ਕਿਹੜੀ ਫਸਲ ਬੀਜਣੀ ਚਾਹੀਦੀ?',
                'ਕੀੜਿਆਂ ਦੇ ਨੁਕਸਾਨ ਤੋਂ ਕਿਵੇਂ ਬਚਾਅ?',
                'ਕਣਕ ਲਈ ਸਭ ਤੋਂ ਵਧੀਆ ਖਾਦ?',
                'ਚਾਵਲ ਦੀ ਵਾਢੀ ਕਦੋਂ?',
                'ਕਪਾਸ ਲਈ ਸਿੰਚਾਈ ਦਾ ਸਮਾਂ?',
                'ਮਿੱਟੀ ਤਿਆਰ ਕਰਨ ਦੇ ਤਰੀਕੇ?'
            ]
        }
        return questions[language] || questions.en
    }

    const quickQuestions = getQuickQuestions()

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bot className="h-5 w-5" />
                        {t('aiAdvisor')}
                        <Badge variant={isOnline ? 'default' : 'secondary'}>
                            {isOnline ? 'Online' : t('offlineMode')}
                        </Badge>
                        {/* Service Status Badges */}
                        <Badge variant={serviceStatus.chatbot ? 'outline' : 'destructive'} className="text-xs">
                            Chat {serviceStatus.chatbot ? '✓' : '✗'}
                        </Badge>
                        <Badge variant={serviceStatus.speechToText ? 'outline' : 'secondary'} className="text-xs">
                            STT {serviceStatus.speechToText ? '✓' : '✗'}
                        </Badge>
                        <Badge variant={serviceStatus.textToSpeech ? 'outline' : 'secondary'} className="text-xs">
                            TTS {serviceStatus.textToSpeech ? '✓' : '✗'}
                        </Badge>
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {/* API Key Setup Instructions */}
                    {(() => {
                        const apiKey = process.env.NEXT_PUBLIC_OPENAI_API_KEY
                        const isApiKeyValid = apiKey && apiKey.length > 20
                        return !isApiKeyValid ? (
                            <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                                <div className="flex items-start gap-3">
                                    <div className="bg-yellow-100 dark:bg-yellow-900/50 rounded-full p-1">
                                        <svg className="w-4 h-4 text-yellow-600 dark:text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="text-sm font-medium text-yellow-800 dark:text-yellow-200 mb-1">
                                            {language === 'hi' ? 'AI आदेश के लिए API Key की आवश्यकता' : 'OpenAI API Key Required for AI Features'}
                                        </h4>
                                        <div className="text-xs text-yellow-700 dark:text-yellow-300 space-y-2">
                                            <p>
                                                {language === 'hi'
                                                    ? 'पूरी AI क्षमताओं के लिए:'
                                                    : 'To enable full AI capabilities:'
                                                }
                                            </p>
                                            <ol className="list-decimal list-inside space-y-1 ml-2">
                                                <li>{language === 'hi' ? 'OpenAI वेबसाइट पर जाएं' : 'Visit OpenAI website'}</li>
                                                <li>{language === 'hi' ? 'API key बनाएं' : 'Generate an API key'}</li>
                                                <li>{language === 'hi' ? '.env.local फाइल में जोड़ें' : 'Add to .env.local file'}</li>
                                                <li>{language === 'hi' ? 'सर्वर रीस्टार्ट करें' : 'Restart the server'}</li>
                                            </ol>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ) : null
                    })()}

                    {/* Language Detection Suggestion */}
                    {languageSuggestion.show && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                            <div className="flex items-start gap-3">
                                <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full p-1">
                                    <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-sm font-medium text-blue-800 dark:text-blue-200 mb-1">
                                        {t('languageSwitchSuggestion')}
                                    </h4>
                                    <p className="text-xs text-blue-700 dark:text-blue-300 mb-3">
                                        {t('languageDetectedMessage')
                                            .replace('{language}', getLanguageName(languageSuggestion.detectedLang))
                                            .replace('{confidence}', languageSuggestion.confidence.toString())
                                        }
                                    </p>
                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => {
                                                autoSetLanguageFromInput(inputValue || messages[messages.length - 2]?.content || '')
                                                setLanguageSuggestion({ show: false, detectedLang: '', confidence: 0 })
                                            }}
                                            className="text-xs h-7"
                                        >
                                            {t('yesSwitch')}
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => setLanguageSuggestion({ show: false, detectedLang: '', confidence: 0 })}
                                            className="text-xs h-7"
                                        >
                                            {t('noThanks')}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                    {/* Chat Messages */}
                    <ScrollArea ref={scrollAreaRef} className="h-96 w-full border rounded-lg p-4">
                        <div className="space-y-4">
                            {messages.map((message) => (
                                <div
                                    key={message.id}
                                    className={`flex gap-3 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    <div className={`flex gap-2 max-w-[80%] ${message.type === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${message.type === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-green-500 text-white'
                                            }`}>
                                            {message.type === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                                        </div>
                                        <div className={`p-3 rounded-lg ${message.type === 'user'
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-100 dark:bg-gray-700'
                                            }`}>
                                            {message.type === 'bot' ? (
                                                <div 
                                                    className="text-sm prose prose-sm max-w-none dark:prose-invert"
                                                    dangerouslySetInnerHTML={{
                                                        __html: message.content
                                                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                                                            .replace(/\n/g, '<br/>')
                                                            .replace(/• /g, '<br/>• ')
                                                            .replace(/💰 /g, '<br/>💰 ')
                                                            .replace(/🌱 /g, '<br/>🌱 ')
                                                            .replace(/💧 /g, '<br/>💧 ')
                                                            .replace(/🧪 /g, '<br/>🧪 ')
                                                            .replace(/🦗 /g, '<br/>🦗 ')
                                                            .replace(/📈 /g, '<br/>📈 ')
                                                            .replace(/💡 /g, '<br/>💡 ')
                                                            .replace(/📅 /g, '<br/>📅 ')
                                                            .replace(/⚠️ /g, '<br/>⚠️ ')
                                                            .replace(/🏛️ /g, '<br/>🏛️ ')
                                                            .replace(/📋 /g, '<br/>📋 ')
                                                    }}
                                                />
                                            ) : (
                                                <p className="text-sm">{message.content}</p>
                                            )}
                                            <div className="flex justify-between items-center mt-1">
                                                <div className="flex items-center gap-2">
                                                    <p className="text-xs opacity-70">
                                                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </p>
                                                    {/* Language indicator for interactive feedback */}
                                                    {message.lang && message.lang !== 'en' && (
                                                        <span className="text-xs opacity-60 bg-white/20 px-1 rounded">
                                                            {getLanguageName(message.lang)}
                                                        </span>
                                                    )}
                                                </div>
                                                {/* Speech button for bot messages */}
                                                {message.type === 'bot' && voiceEnabled && (
                                                    <Button
                                                        size="sm"
                                                        variant="ghost"
                                                        className="h-6 w-6 p-0 ml-2"
                                                        onClick={() => onSpeak(message.content)}
                                                        title="Read aloud"
                                                    >
                                                        <Volume2 className="h-3 w-3" />
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                            {isLoading && (
                                <div className="flex justify-start">
                                    <div className="flex gap-2">
                                        <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center">
                                            <Bot className="h-4 w-4" />
                                        </div>
                                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                                            <div className="flex items-center gap-2">
                                                <Loader2 className="h-4 w-4 animate-spin" />
                                                <span className="text-sm">{t('thinkingAI')}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </ScrollArea>

                    {/* Quick Questions - Enhanced with multilingual examples */}
                    <div className="space-y-2">
                        <p className="text-sm font-medium">{t('quickQuestions')}:</p>
                        <div className="flex flex-wrap gap-2">
                            {quickQuestions.slice(0, 2).map((question, index) => (
                                <Button
                                    key={index}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setInputValue(question)}
                                    className="text-xs"
                                >
                                    {question}
                                </Button>
                            ))}
                            {/* Add cross-language examples for demonstration */}
                            {language === 'en' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setInputValue('गेहूं की खेती कैसे करें?')}
                                    className="text-xs bg-blue-50 border-blue-200"
                                    title="Try asking in Hindi"
                                >
                                    🇮🇳 गेहूं की खेती कैसे करें?
                                </Button>
                            )}
                            {language === 'hi' && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => setInputValue('How to grow rice?')}
                                    className="text-xs bg-blue-50 border-blue-200"
                                    title="Try asking in English"
                                >
                                    🇺🇸 How to grow rice?
                                </Button>
                            )}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                            💡 {language === 'hi' 
                                ? 'टिप: आप किसी भी भाषा में सवाल पूछ सकते हैं, मैं समझ जाऊंगा!'
                                : 'Tip: Ask questions in any language - I\'ll understand and respond accordingly!'}
                        </p>
                    </div>

                    {/* Input Area */}
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Input
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={t('typeMessage')}
                                disabled={isLoading}
                                className="pr-16"
                            />
                            {voiceSupported && (
                                <Button
                                    size="lg"
                                    variant="ghost"
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-10 w-10 p-0"
                                    onClick={isListening ? stopVoiceRecognition : startVoiceRecognition}
                                    disabled={isLoading}
                                >
                                    {isListening ? (
                                        <MicOff className="h-6 w-6 text-red-500" />
                                    ) : (
                                        <Mic className="h-6 w-6 text-blue-500" />
                                    )}
                                </Button>
                            )}
                        </div>
                        <Button
                            onClick={handleSendMessage}
                            disabled={isLoading || !inputValue.trim()}
                            size="sm"
                        >
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>

                    {/* Voice Controls */}
                    {voiceEnabled && (
                        <div className="flex items-center justify-between p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
                            <div className="flex items-center gap-2">
                                <Volume2 className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">{t('voiceEnabled')}</span>
                            </div>
                            <Badge variant="secondary">{getLanguageName(language)}</Badge>
                        </div>
                    )}

                    {isListening && (
                        <div className="flex items-center justify-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                            <div className="flex items-center gap-2">
                                <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                <span className="text-sm text-blue-600">Listening...</span>
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}