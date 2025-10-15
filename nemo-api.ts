// OpenRouter API integration for KrishiMitra
'use client'

// Define types directly in this file
export interface ChatMessage {
    role: 'system' | 'user' | 'assistant'
    content: string
}

interface NeMoResponse {
    choices: Array<{
        message: {
            content: string
        }
    }>
    citations?: string[]
}

interface NeMoRequest {
    model: string
    messages: ChatMessage[]
    temperature?: number
    max_tokens?: number
}

// Main chat function using OpenRouter with NVIDIA NeMo model
export async function nemoChat(request: NeMoRequest, language: string = 'en'): Promise<NeMoResponse> {
    try {
        // Call our serverless function instead of calling NVIDIA NeMo directly
        const response = await fetch('/api/nemo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: request.messages,
                model: request.model || 'nvidia/nemotron-4-340b-instruct',
                temperature: request.temperature,
                maxTokens: request.max_tokens,
            }),
        })

        if (!response.ok) {
            // Handle specific error cases
            const errorData = await response.json().catch(() => ({ error: `HTTP ${response.status}: ${response.statusText}` }));

            if (response.status === 429) {
                throw new Error('You have exceeded your daily AI request limit. Please try again later.')
            } else if (response.status === 500) {
                if (errorData.error && errorData.error.includes('Invalid OpenRouter API key')) {
                    throw new Error('OpenRouter service is not properly configured. Please contact the administrator.')
                }
                throw new Error(`AI service is temporarily unavailable. Please try again later. Details: ${errorData.error || 'Unknown error'}`)
            } else {
                throw new Error(`HTTP error! status: ${response.status}, details: ${errorData.error || 'Unknown error'}`)
            }
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('OpenRouter Chat API Error:', error)
        // Re-throw the error so the calling function can handle the fallback
        throw error
    }
}

// Mock implementation for development and fallback
function getMockResponse(request: NeMoRequest, language: string = 'en'): NeMoResponse {
    const userMessage = request.messages.find((msg: ChatMessage) => msg.role === 'user')?.content || ''
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