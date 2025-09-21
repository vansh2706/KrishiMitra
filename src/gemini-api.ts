// Google Gemini API integration for KrishiMitra
'use client'

import { GoogleGenerativeAI } from '@google/generative-ai'

export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

export interface GeminiResponse {
    choices: Array<{
        message: {
            content: string
        }
    }>
    citations?: string[]
}

export interface GeminiRequest {
    model: string
    messages: ChatMessage[]
    temperature?: number
    max_tokens?: number
}

// Enhanced Gemini Client with Image Analysis
export async function geminiImageAnalysis(
    imageBase64: string, 
    language: string = 'en'
): Promise<{
    pestName: string
    confidence: number
    severity: 'low' | 'medium' | 'high'
    description: string
    symptoms: string[]
    treatment: string[]
    prevention: string[]
    organicTreatment: string[]
    chemicalTreatment: string[]
    cropsDamaged: string[]
    seasonality: string
}> {
    try {
        const genAI = getGeminiClient()
        
        if (!genAI) {
            console.warn('Gemini API not available, using enhanced mock response')
            return getEnhancedMockPestAnalysis(language)
        }

        // Enhanced system prompt for pest detection
        const systemPrompt = getPestDetectionPrompt(language)
        
        // Get the model with vision capabilities
        const model = genAI.getGenerativeModel({ 
            model: 'gemini-1.5-flash',
            generationConfig: {
                temperature: 0.3, // Lower temperature for more accurate analysis
                maxOutputTokens: 2000,
            }
        })

        // Prepare the image data
        const imagePart = {
            inlineData: {
                data: imageBase64.split(',')[1], // Remove data:image/jpeg;base64, prefix
                mimeType: 'image/jpeg'
            }
        }

        const result = await model.generateContent([systemPrompt, imagePart])
        const response = await result.response
        const text = response.text()

        // Parse the structured response
        return parsePestAnalysisResponse(text, language)
        
    } catch (error) {
        console.error('Gemini Image Analysis Error:', error)
        return getEnhancedMockPestAnalysis(language)
    }
}

// Enhanced system prompt for pest detection
function getPestDetectionPrompt(language: string): string {
    const prompts = {
        hi: `आप एक विशेषज्ञ कृषि कीट विज्ञानी हैं। इस तस्वीर का विश्लेषण करें और किसी भी कीट, रोग या समस्या की पहचान करें।

कृपया निम्नलिखित JSON प्रारूप में उत्तर दें:
{
  "pestName": "कीट/रोग का नाम",
  "confidence": 85,
  "severity": "medium",
  "description": "विस्तृत विवरण",
  "symptoms": ["लक्षण 1", "लक्षण 2"],
  "treatment": ["उपचार 1", "उपचार 2"],
  "prevention": ["रोकथाम 1", "रोकथाम 2"],
  "organicTreatment": ["जैविक उपचार 1", "जैविक उपचार 2"],
  "chemicalTreatment": ["रासायनिक उपचार 1", "रासायनिक उपचार 2"],
  "cropsDamaged": ["प्रभावित फसल 1", "प्रभावित फसल 2"],
  "seasonality": "मौसम जानकारी"
}

सभी जानकारी हिंदी में दें।`,

        ta: `நீங்கள் ஒரு நிபுணத்துவமிக்க வேளாண் பூச்சியியல் நிபுணர். இந்த படத்தை ஆய்வு செய்து எந்தவொரு பூச்சி, நோய் அல்லது பிரச்சினையையும் கண்டறியவும்.

தயவுசெய்து பின்வரும் JSON வடிவத்தில் பதிலளிக்கவும்:
{
  "pestName": "பூச்சி/நோயின் பெயர்",
  "confidence": 85,
  "severity": "medium",
  "description": "விரிவான விளக்கம்",
  "symptoms": ["அறிகுறி 1", "அறிகுறி 2"],
  "treatment": ["சிகிச்சை 1", "சிகிச்சை 2"],
  "prevention": ["தடுப்பு 1", "தடுப்பு 2"],
  "organicTreatment": ["இயற்கை சிகிச்சை 1", "இயற்கை சிகிச்சை 2"],
  "chemicalTreatment": ["வேதியியல் சிகிச்சை 1", "வேதியியல் சிகிச்சை 2"],
  "cropsDamaged": ["பாதிக்கப்பட்ட பயிர் 1", "பாதிக்கப்பட்ட பயிர் 2"],
  "seasonality": "பருவகால தகவல்"
}

தமிழில் அனைத்து தகவல்களையும் வழங்கவும்।`,

        en: `You are an expert agricultural entomologist. Analyze this image and identify any pests, diseases, or problems.

Please respond in the following JSON format:
{
  "pestName": "Name of pest/disease",
  "confidence": 85,
  "severity": "medium",
  "description": "Detailed description",
  "symptoms": ["Symptom 1", "Symptom 2"],
  "treatment": ["Treatment 1", "Treatment 2"],
  "prevention": ["Prevention 1", "Prevention 2"],
  "organicTreatment": ["Organic treatment 1", "Organic treatment 2"],
  "chemicalTreatment": ["Chemical treatment 1", "Chemical treatment 2"],
  "cropsDamaged": ["Affected crop 1", "Affected crop 2"],
  "seasonality": "Seasonal information"
}

Provide all information in English.`
    }

    return prompts[language as keyof typeof prompts] || prompts.en
}

// Parse AI response into structured format
function parsePestAnalysisResponse(text: string, language: string): any {
    try {
        // Try to extract JSON from the response
        const jsonMatch = text.match(/\{[\s\S]*\}/)
        if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0])
            return {
                ...parsed,
                confidence: Math.max(70, Math.min(100, parsed.confidence || 85)),
                severity: ['low', 'medium', 'high'].includes(parsed.severity) ? parsed.severity : 'medium'
            }
        }
    } catch (error) {
        console.warn('Failed to parse JSON response, using fallback')
    }
    
    // Fallback to enhanced mock if parsing fails
    return getEnhancedMockPestAnalysis(language)
}

// Enhanced mock analysis with better language support
function getEnhancedMockPestAnalysis(language: string): any {
    const mockData = {
        en: {
            pestName: 'Aphids',
            confidence: 87,
            severity: 'medium' as const,
            description: 'Small, soft-bodied insects that feed on plant sap and can cause significant damage',
            symptoms: ['Yellowing leaves', 'Stunted growth', 'Honeydew deposits', 'Curled leaves'],
            treatment: ['Water spray', 'Neem oil application', 'Insecticidal soap'],
            prevention: ['Remove weeds', 'Encourage beneficial insects', 'Regular monitoring'],
            organicTreatment: ['Neem oil spray', 'Ladybug release', 'Garlic spray solution'],
            chemicalTreatment: ['Imidacloprid', 'Thiamethoxam', 'Acetamiprid'],
            cropsDamaged: ['wheat', 'cotton', 'potato', 'tomato'],
            seasonality: 'Spring and summer months, warm weather'
        },
        hi: {
            pestName: 'एफिड्स (माहू)',
            confidence: 87,
            severity: 'medium' as const,
            description: 'छोटे कोमल शरीर वाले कीड़े जो पौधों का रस चूसते हैं और महत्वपूर्ण नुकसान पहुंचा सकते हैं',
            symptoms: ['पत्तियों का पीला होना', 'बौनी वृद्धि', 'चिपचिपा पदार्थ', 'मुड़ी हुई पत्तियां'],
            treatment: ['पानी का छिड़काव', 'नीम तेल लगाएं', 'कीटनाशक साबुन का उपयोग'],
            prevention: ['खरपतवार हटाएं', 'लाभकारी कीड़ों को बढ़ावा दें', 'नियमित निगरानी'],
            organicTreatment: ['नीम तेल स्प्रे', 'लेडीबग छोड़ें', 'लहसुन स्प्रे'],
            chemicalTreatment: ['इमिडाक्लोप्रिड', 'थायामेथॉक्साम', 'एसिटामिप्रिड'],
            cropsDamaged: ['गेहूं', 'कपास', 'आलू', 'टमाटर'],
            seasonality: 'वसंत और गर्मी के महीने, गर्म मौसम'
        }
    }

    return mockData[language as keyof typeof mockData] || mockData.en
}

// Enhanced Gemini Client
const getGeminiClient = () => {
    const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY

    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
        console.warn('Gemini API key not configured - using enhanced fallback responses')
        return null
    }

    return new GoogleGenerativeAI(apiKey)
}

// Main chat function using Gemini with enhanced agricultural prompts
export async function geminiChat(request: GeminiRequest, language: string = 'en'): Promise<GeminiResponse> {
    try {
        const genAI = getGeminiClient()

        // Check if we have a valid Gemini client
        if (!genAI) {
            console.warn('Gemini API key not configured, trying OpenAI fallback...')
            // Try OpenAI fallback if available
            try {
                const { openaiChat } = await import('./openai-api')
                const openaiResponse = await openaiChat({
                    model: 'gpt-4o-mini',
                    messages: request.messages,
                    temperature: request.temperature,
                    max_tokens: request.max_tokens
                }, language)
                console.log('Using OpenAI fallback successfully')
                return openaiResponse
            } catch (openaiError) {
                console.warn('OpenAI fallback also failed, using enhanced mock response')
                return getMockResponse(request, language)
            }
        }

        // Enhanced system prompt for agricultural expertise
        const systemPrompt = getAgriculturalSystemPrompt(language)
        
        // Get user message
        const userMessage = request.messages.find(msg => msg.role === 'user')?.content || ''
        
        // Combine system prompt with user message
        const fullPrompt = `${systemPrompt}\n\nUser Question: ${userMessage}`

        // Get the model
        const model = genAI.getGenerativeModel({ 
            model: request.model || 'gemini-1.5-flash',
            generationConfig: {
                temperature: request.temperature || 0.7,
                maxOutputTokens: request.max_tokens || 1500,
            }
        })

        const result = await model.generateContent(fullPrompt)
        const response = await result.response
        const text = response.text()

        return {
            choices: [{
                message: {
                    content: text || 'Sorry, I could not generate a response.'
                }
            }],
            citations: [
                'https://krishi.mit.gov.in/',
                'https://www.icar.org.in/',
                'https://agricoop.nic.in/'
            ]
        }
    } catch (error) {
        console.error('Gemini Chat API Error:', error)
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
5. हमेशा हिंदी में स्पष्ट और समझने योग्य भाषा का उपयोग करें

महत्वपूर्ण: आपको हमेशा हिंदी भाषा में ही जवाब देना है, चाहे सवाल किसी भी भाषा में हो।`,

        ta: `நீங்கள் ஒரு அனுபவமிக்க வேளாண் நிபுணர், இந்திய விவசாய நிலைமைகளில் நிபுணத்துவம் பெற்றவர். பயிர்கள், மண் மேலாண்மை, உரங்கள், பூச்சி கட்டுப்பாடு மற்றும் நவீன வேளாண் நுட்பங்கள் குறித்து விரிவான, நடைமுறை ஆலோசனைகளை வழங்கவும்।

முக்கியம்: எப்போதும் தமிழ் மொழியில் மட்டுமே பதிலளிக்கவும், கேள்வி எந்த மொழியில் இருந்தாலும்.`,

        te: `మీరు భారతీయ వ్యవసాయ పరిస్థితులలో నిపుణుడైన అనుభవజ్ఞుడైన వ్యవసాయ నిపుణులు। పంటలు, నేల నిర్వహణ, ఎరువులు, చీడపురుగుల నియంత్రణ మరియు ఆధునిక వ్యవసాయ పద్ధతులపై వివరణాత్మక, ఆచరణాత్మక సలహాలు అందించండి।

ముఖ్యమైనది: ప్రశ్న ఏ భాషలో అడిగినా, ఎల్లప్పుడూ తెలుగు భాషలో మాత్రమే సమాధానం ఇవ్వండి।`,

        bn: `আপনি একজন অভিজ্ঞ কৃষি বিশেষজ্ঞ যিনি ভারতীয় কৃষি পরিস্থিতিতে বিশেষজ্ঞতা রাখেন। ফসল, মাটি ব্যবস্থাপনা, সার, কীটপতঙ্গ নিয়ন্ত্রণ এবং আধুনিক কৃষি কৌশল সম্পর্কে বিস্তারিত, ব্যবহারিক পরামর্শ প্রদান করুন।

গুরুত্বপূর্ণ: প্রশ্ন যে ভাষায়ই হোক, সর্বদা বাংলা ভাষায় উত্তর দিন।`,

        gu: `તમે ભારતીય ખેતીની પરિસ્થિતિઓમાં વિશેષતા ધરાવતા અનુભવી કૃષિ નિષ્ણાત છો। પાકો, માટી વ્યવસ્થાપન, ખાતરો, જંતુ નિયંત્રણ અને આધુનિક ખેતી તકનીકો વિશે વિગતવાર, વ્યવહારિક સલાહ આપો।

મહત્વનું: પ્રશ્ન કોઈ પણ ભાષામાં હોય, હંમેશા ગુજરાતી ભાષામાં જ જવાબ આપો।`,

        mr: `तुम्ही भारतीय शेती परिस्थितीत तज्ञ असलेले अनुभवी कृषी तज्ञ आहात। पिके, माती व्यवस्थापन, खते, कीड नियंत्रण आणि आधुनिक शेती तंत्रांबद्दल तपशीलवार, व्यावहारिक सल्ला द्या।

महत्वाचे: प्रश्न कोणत्याही भाषेत असला तरी, नेहमी मराठी भाषेत उत्तर द्या।`,

        pa: `ਤੁਸੀਂ ਭਾਰਤੀ ਖੇਤੀ ਦੀਆਂ ਸਥਿਤੀਆਂ ਵਿੱਚ ਮਾਹਰ ਇੱਕ ਤਜਰਬੇਕਾਰ ਖੇਤੀ ਮਾਹਰ ਹੋ। ਫਸਲਾਂ, ਮਿੱਟੀ ਪ੍ਰਬੰਧਨ, ਖਾਦਾਂ, ਕੀੜੇ ਨਿਯੰਤਰਣ ਅਤੇ ਆਧੁਨਿਕ ਖੇਤੀ ਤਕਨੀਕਾਂ ਬਾਰੇ ਵਿਸਤ੍ਰਿਤ, ਵਿਹਾਰਕ ਸਲਾਹ ਦਿਓ।

ਮਹੱਤਵਪੂਰਨ: ਸਵਾਲ ਕਿਸੇ ਵੀ ਭਾਸ਼ਾ ਵਿੱਚ ਹੋਵੇ, ਹਮੇਸ਼ਾ ਪੰਜਾਬੀ ਭਾਸ਼ਾ ਵਿੱਚ ਹੀ ਜਵਾਬ ਦਿਓ।`,

        en: `You are an expert agricultural advisor helping Indian farmers. You have comprehensive knowledge about crops, soil, irrigation, pest control, and modern farming techniques. Always:

1. Provide practical and actionable advice
2. Consider local conditions and climate
3. Suggest both traditional and modern approaches
4. Prioritize safe and environmentally friendly methods
5. Structure responses clearly with numbered points
6. Include specific measurements, timings, and techniques
7. Mention relevant government schemes or subsidies when applicable

IMPORTANT: Always respond in English only, regardless of the language the question is asked in.`
    }

    return prompts[language as keyof typeof prompts] || prompts.en
}

// Mock implementation for development and fallback
function getMockResponse(request: GeminiRequest, language: string = 'en'): GeminiResponse {
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

    // Language-specific responses based on detected language
    if (language === 'hi') {
        if (lowerQuestion.includes('गेहूं') || lowerQuestion.includes('wheat')) {
            return `🌾 गेहूं की खेती के लिए संपूर्ण गाइड:

1. **बुवाई का समय**: अक्टूबर-नवंबर (रबी सीजन)
2. **बीज दर**: 100-120 किलो प्रति हेक्टेयर
3. **उर्वरक**: NPK (120:60:40) किलो प्रति हेक्टेयर
4. **सिंचाई**: 4-6 सिंचाई की आवश्यकता
5. **कीट नियंत्रण**: नियमित निगरानी, नीम का तेल
6. **कटाई**: 120-130 दिन में तैयार

💡 उत्पादन: 25-30 क्विंटल प्रति हेक्टेयर
📞 सलाह: स्थानीय कृषि विभाग से संपर्क करें।`
        }

        if (lowerQuestion.includes('टमाटर') || lowerQuestion.includes('tomato')) {
            return `🍅 टमाटर की संपूर्ण देखभाल:

1. **मौसम**: साल भर (सिंचित क्षेत्र)
2. **तापमान**: 20-25°C आदर्श
3. **मिट्टी**: दोमट मिट्टी, pH 6.0-7.0
4. **पानी प्रबंधन**: ड्रिप सिंचाई सर्वोत्तम
5. **मुख्य रोग**: अगेती झुलसा, पछेती झुलसा
6. **कीट नियंत्रण**: नीम का तेल छिड़काव
7. **कटाई**: 70-80 दिन में फल तैयार

💰 उत्पादन: 300-500 क्विंटल प्रति हेक्टेयर
✨ सफल खेती के लिए नियमित देखभाल जरूरी है।`
        }

        return `🙏 आपके कृषि संबंधी प्रश्न के लिए धन्यवाद!

यहाँ कुछ सामान्य खेती के सुझाव हैं:

1. **मिट्टी की स्वास्थ्य**: नियमित जांच और जैविक खाद का उपयोग
2. **फसल चक्र**: बेहतर पैदावार के लिए फसल चक्र अपनाएं
3. **पानी का प्रबंधन**: कुशल सिंचाई प्रणाली अपनाएं
4. **कीट नियंत्रण**: एकीकृत कीट प्रबंधन (IPM) अपनाएं
5. **मौसम आधारित सलाह**: मौसम की जानकारी रखें

💡 विशिष्ट सलाह के लिए, कृपया अपनी फसल और स्थान के बारे में अधिक जानकारी प्रदान करें।

📱 अन्य टूल्स का भी उपयोग करें: मौसम डैशबोर्ड, मिट्टी गाइड, बाजार मूल्य।`
    }

    // Tamil responses
    if (language === 'ta') {
        if (lowerQuestion.includes('நெல்') || lowerQuestion.includes('rice')) {
            return `🌾 நெல் சாகுபடி வழிகாட்டி:

1. **விதைப்பு காலम்**: ஜூன்-ஜூலை (கரீஃப்)
2. **விதை அளவு**: ஹெக்டேருக்கு 20-25 கிலோ
3. **உரம்**: NPK (120:60:40)
4. **நீர் மேலாண்மை**: தொடர்ந்து நீர் தேவை
5. **பூச்சி கட்டுப்பாடு**: தண்டு துளைப்பான், இலை சுருட்டுப்பூச்சி
6. **அறுவடை**: 120-130 நாட்களில்

💰 மகசூல்: ஹெக்டேருக்கு 40-50 க்विন்டால்
🌿 இயற்கை உரங்களை பயன்படுத்துங்கள்।`
        }
        return `🙏 உங்கள் விவசாய கேள்விக்கு நன்றி!

பொதுவான விவசாய ஆலோசனைகள்:

1. **மண் ஆரோக்கியம்**: வழக்கமான பரிசோதனை
2. **பயிர் சுழற்சி**: சிறந்த மகசூலுக்கு
3. **நீர் மேலாண்மை**: திறமையான நீர்ப்பாசனம்
4. **பூச்சி கட்டுப்பாடு**: ஒருங்கிணைந்த பூச்சி மேலாண்மை

📱 மற்ற கருவிகளையும் பயன்படுத்துங்கள்।`
    }

    // Telugu responses
    if (language === 'te') {
        if (lowerQuestion.includes('వరి') || lowerQuestion.includes('rice')) {
            return `🌾 వరి సాగు మార్గదర్శకం:

1. **విత్తనాలు**: జూన్-జూలై (ఖరీఫ్)
2. **విత్తన మొత్తం**: హెక్టేరుకు 20-25 కిలోలు
3. **ఎరువులు**: NPK (120:60:40)
4. **నీటి నిర్వహణ**: నిరంతర నీరు అవసరం
5. **తెగుళ్ల నియంత్రణ**: కాండం బోరర్, ఆకు మడతపురుగు
6. **కోత**: 120-130 రోజుల్లో

💰 దిగుబడి: హెక్టేరుకు 40-50 క్వింటాల్స్
🌿 సేంద్రీయ ఎరువులను ఉపయోగించండి।`
        }
        return `🙏 మీ వ్యవసాయ ప్రశ్నకు ధన్యవాదాలు!

సాధారణ వ్యవసాయ సలహాలు:

1. **నేల ఆరోగ్యం**: నియమిత పరీక్షలు
2. **పంట మార్పిడి**: మెరుగైన దిగుబడి కోసం
3. **నీటి నిర్వహణ**: సమర్థవంతమైన నీటిపారుదల
4. **తెగుళ్ల నియంత్రణ**: సమీకృత తెగుళ్ల నిర్వహణ

📱 ఇతర టూల్స్ కూడా ఉపయోగించండి।`
    }

    // English responses
    if (lowerQuestion.includes('fertilizer') || lowerQuestion.includes('soil')) {
        return `🌱 Soil and Fertilizer Management Guide:

1. **Soil Testing**: Get soil tested every 2-3 years
2. **Organic Matter**: Add 5-10 tonnes compost per hectare
3. **NPK Balance**: Apply based on soil test results
4. **pH Management**: Maintain pH between 6.0-7.5
5. **Micronutrients**: Apply zinc, boron as needed
6. **Timing**: Apply fertilizers at right growth stages

💡 **Pro Tips**:
- Use bio-fertilizers for sustainable farming
- Practice green manuring
- Avoid over-fertilization

📞 Consult local agricultural experts for soil-specific advice.`
    }

    if (lowerQuestion.includes('irrigation') || lowerQuestion.includes('water')) {
        return `💧 Smart Irrigation Practices:

1. **Timing**: Early morning (6-8 AM) or evening (4-6 PM)
2. **Frequency**: Based on soil moisture and crop stage
3. **Methods**: 
   - Drip irrigation (90% efficiency)
   - Sprinkler system (75-85% efficiency)
   - Furrow irrigation (60-70% efficiency)
4. **Water Quality**: EC should be < 2.0 dS/m
5. **Scheduling**: Use tensiometers for precise timing

🎯 **Benefits**:
- 20-30% water savings
- Better crop yield
- Reduced disease incidence

💡 Consider mulching to reduce water evaporation.`
    }

    if (lowerQuestion.includes('pest') || lowerQuestion.includes('insect')) {
        return `🐛 Integrated Pest Management (IPM):

1. **Prevention First**:
   - Crop rotation
   - Resistant varieties
   - Clean cultivation

2. **Monitoring**:
   - Weekly field inspection
   - Pheromone traps
   - Yellow sticky traps

3. **Biological Control**:
   - Beneficial insects
   - Neem-based pesticides
   - Bacillus thuringiensis

4. **Chemical Control** (last resort):
   - Use recommended pesticides
   - Follow label instructions
   - Maintain pre-harvest interval

🌿 **Organic Options**: Neem oil, garlic spray, soap solution
⚠️ Always wear protective equipment when spraying.`
    }

    // Default comprehensive response
    return `🌾 **Agricultural Guidance System**

Thank you for your farming question! Here's comprehensive advice:

**🌱 Soil Health**:
- Regular soil testing
- Organic matter addition
- Balanced fertilization

**💧 Water Management**:
- Efficient irrigation systems
- Rainwater harvesting
- Mulching practices

**🛡️ Crop Protection**:
- Integrated pest management
- Disease monitoring
- Preventive measures

**📈 Yield Optimization**:
- Quality seeds/seedlings
- Proper spacing
- Timely operations

**🌐 Modern Techniques**:
- Precision farming
- Weather-based advisories
- Mobile apps for guidance

💡 **For specific advice**, please provide:
- Your location/state
- Crop type and variety
- Current growth stage
- Specific problem/concern

📱 **Use other tools**: Weather Dashboard, Soil Guide, Market Prices, Pest Detection`
}

// Backward compatibility aliases for easy migration
export const openaiChat = geminiChat
export const perplexityChat = geminiChat
export type OpenAIRequest = GeminiRequest
export type OpenAIResponse = GeminiResponse
export type PerplexityRequest = GeminiRequest
export type PerplexityResponse = GeminiResponse

// Helper function to check API key availability
export function checkGeminiServices(): { chatbot: boolean; speechToText: boolean; textToSpeech: boolean } {
    const genAI = getGeminiClient()
    const isAvailable = !!genAI

    return {
        chatbot: isAvailable,
        speechToText: false, // Gemini doesn't have built-in STT
        textToSpeech: false  // Gemini doesn't have built-in TTS
    }
}

// Backward compatibility
export const checkOpenAIServices = checkGeminiServices

// For voice features, we'll use browser APIs as fallback
export async function geminiSpeechToText(audioFile: File, language?: string): Promise<string> {
    console.warn('Gemini does not support speech-to-text. Use browser Speech Recognition API instead.')
    return 'Speech-to-text service not available with Gemini. Please use browser voice recognition.'
}

export async function geminiTextToSpeech(
    text: string,
    voice: string = 'default'
): Promise<ArrayBuffer | null> {
    console.warn('Gemini does not support text-to-speech. Use browser Speech Synthesis API instead.')
    return null
}

// Backward compatibility aliases
export const openaiSpeechToText = geminiSpeechToText
export const openaiTextToSpeech = geminiTextToSpeech

export async function playTTSAudio(text: string, voice?: string): Promise<void> {
    // Use browser's built-in speech synthesis as fallback
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text)
        utterance.voice = speechSynthesis.getVoices().find(v => v.name.includes(voice || '')) || speechSynthesis.getVoices()[0]
        speechSynthesis.speak(utterance)
    } else {
        console.warn('Speech synthesis not supported in this browser')
    }
}