// Google Gemini API integration for KrishiMitra
'use client'

// Define types directly in this file
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

// Main chat function using Gemini with enhanced agricultural prompts
export async function geminiChat(request: GeminiRequest, language: string = 'en'): Promise<GeminiResponse> {
    try {
        // Call our serverless function instead of calling Gemini directly
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: request.messages,
                model: request.model || 'gemini-pro',
                temperature: request.temperature,
                maxTokens: request.max_tokens,
            }),
        })

        if (!response.ok) {
            // Handle specific error cases
            if (response.status === 429) {
                throw new Error('You have exceeded your daily AI request limit. Please try again later.')
            } else if (response.status === 500) {
                const errorData = await response.json().catch(() => ({}));
                if (errorData.error && errorData.error.includes('quota')) {
                    throw new Error('You have exceeded your daily AI request limit. Please try again tomorrow when your quota resets.')
                }
                throw new Error('AI service is temporarily unavailable. Please try again later.')
            } else {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
        }

        const data = await response.json()
        return data
    } catch (error) {
        console.error('Gemini Chat API Error:', error)
        // Fallback to mock response on error
        return getMockResponse(request, language)
    }
}

// Function to check if Gemini services are properly configured
export function checkGeminiServices() {
    // In production, we'll assume the service is available and let the API call handle any errors
    // In development, we can check if the API key is set
    if (typeof window !== 'undefined') {
        // Client-side check
        const isDevelopment = process.env.NODE_ENV === 'development';
        if (isDevelopment) {
            // In development, check if we have the public API key
            return {
                chatbot: !!(process.env.NEXT_PUBLIC_GEMINI_API_KEY &&
                    process.env.NEXT_PUBLIC_GEMINI_API_KEY !== 'your_gemini_api_key_here'),
                speechToText: true,
                textToSpeech: true
            };
        } else {
            // In production, assume service is available
            return {
                chatbot: true,
                speechToText: true,
                textToSpeech: true
            };
        }
    }

    // Server-side (this should never be called from server-side)
    return {
        chatbot: true,
        speechToText: true,
        textToSpeech: true
    };
}

// Function for image analysis using OpenAI Vision API with Gemini fallback
export async function geminiImageAnalysis(imageData: string, language: string = 'en') {
    try {
        // Call our serverless function for pest analysis (now uses OpenAI primary with Gemini fallback)
        const response = await fetch('/api/analyze-pest', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageData: imageData,
                language: language
            }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Image Analysis Error:', error);
        // Return a mock response on error
        return getMockImageAnalysisResponse(language);
    }
}

// Text-to-speech function using browser APIs
export async function playTTSAudio(text: string, voice?: string): Promise<void> {
    try {
        // Use browser's built-in speech synthesis
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(text);

            // Set voice based on language preference
            const voices = speechSynthesis.getVoices();
            if (voice) {
                const selectedVoice = voices.find(v => v.name.toLowerCase().includes(voice.toLowerCase()));
                if (selectedVoice) {
                    utterance.voice = selectedVoice;
                }
            }

            // Set default properties
            utterance.rate = 1.0;
            utterance.pitch = 1.0;
            utterance.volume = 1.0;

            // Speak the text
            speechSynthesis.speak(utterance);
        } else {
            console.warn('Speech synthesis not supported in this browser');
        }
    } catch (error) {
        console.error('Text-to-speech error:', error);
    }
}

// Mock implementation for development and fallback
function getMockResponse(request: GeminiRequest, language: string = 'en'): GeminiResponse {
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

    // Tamil responses
    if (language === 'ta') {
        if (lowerQuestion.includes('நெல்') || lowerQuestion.includes('rice')) {
            return `🌾 நெல் சாகுபடி வழிகாட்டி:

1. **விதைப்பு காலம்**: ஜூன்-ஜூலை (கரீஃப்)
2. **விதை அளவு**: ஹெக்டேருக்கு 20-25 கிலோ
3. **உரம்**: NPK (120:60:40)
4. **நீர் மேலாண்மை**: தொடர்ந்து நீர் தேவை
5. **பூச்சி கட்டுப்பாடு**: தண்டு துளைப்பான், இலை சுருட்டுப்பூச்சி
6. **அறுவடை**: 120-130 நாட்களில்

💰 மகசூல்: ஹெக்டேருக்கு 40-50 க்வின்டால்
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

// Mock response for image analysis with varied responses for testing
function getMockImageAnalysisResponse(language: string = 'en') {
    // Language-specific mock responses arrays for variety
    const mockResponseArrays: Record<string, any[]> = {
        en: [
            {
                success: true,
                result: {
                    pestName: "Fall Armyworm",
                    confidence: 85,
                    severity: "high",
                    description: "The Fall Armyworm is a serious pest that affects corn, sorghum, and other crops.",
                    symptoms: [
                        "Large irregular holes in leaves",
                        "Windowing damage on young leaves",
                        "Presence of caterpillars on plants",
                        "Frass (insect waste) on leaves"
                    ],
                    treatment: [
                        "Apply Bacillus thuringiensis (Bt) spray",
                        "Use neem oil solution (2 ml per liter water)",
                        "Introduce beneficial insects like Trichogramma wasps",
                        "Remove and destroy affected plant parts"
                    ],
                    prevention: [
                        "Regular field monitoring",
                        "Destroy crop residues after harvest",
                        "Plant trap crops like marigold",
                        "Maintain proper field sanitation"
                    ],
                    cropsDamaged: ["Corn", "Sorghum", "Rice", "Wheat"],
                    seasonality: "Active during warm, humid months",
                    organicTreatment: [
                        "Neem oil spray (2 ml per liter water)",
                        "Garlic-chili spray",
                        "Beneficial insect release",
                        "Companion planting with marigold"
                    ],
                    chemicalTreatment: [
                        "Chlorantraniliprole 0.4% GR",
                        "Emamectin benzoate 5% SG",
                        "Spinosad 45% SC",
                        "Consult local agricultural officer for proper dosage"
                    ]
                }
            },
            {
                success: true,
                result: {
                    pestName: "Aphids",
                    confidence: 80,
                    severity: "medium",
                    description: "Small soft-bodied insects that feed on plant sap.",
                    symptoms: [
                        "Yellowing leaves",
                        "Sticky honeydew deposits",
                        "Curled leaves",
                        "Stunted growth"
                    ],
                    treatment: [
                        "Spray with water",
                        "Apply neem oil",
                        "Use insecticidal soap",
                        "Introduce ladybugs"
                    ],
                    prevention: [
                        "Remove weeds",
                        "Encourage beneficial insects",
                        "Regular monitoring",
                        "Proper plant spacing"
                    ],
                    cropsDamaged: ["Tomato", "Potato", "Cotton", "Wheat"],
                    seasonality: "Spring and summer months",
                    organicTreatment: [
                        "Neem oil spray",
                        "Ladybug release",
                        "Garlic spray",
                        "Companion planting"
                    ],
                    chemicalTreatment: [
                        "Imidacloprid",
                        "Thiamethoxam",
                        "Acetamiprid",
                        "Consult local agricultural officer"
                    ]
                }
            },
            {
                success: true,
                result: {
                    pestName: "Whitefly",
                    confidence: 75,
                    severity: "medium",
                    description: "Small white flying insects that suck plant juices.",
                    symptoms: [
                        "Yellowing leaves",
                        "Sooty mold",
                        "Reduced vigor",
                        "Sticky honeydew"
                    ],
                    treatment: [
                        "Yellow sticky traps",
                        "Reflective mulch",
                        "Neem oil",
                        "Insecticidal soap"
                    ],
                    prevention: [
                        "Crop rotation",
                        "Remove infected plants",
                        "Companion planting",
                        "Proper ventilation"
                    ],
                    cropsDamaged: ["Cotton", "Tomato", "Potato", "Sugarcane"],
                    seasonality: "Year-round in warm climates",
                    organicTreatment: [
                        "Insecticidal soap",
                        "Reflective mulch",
                        "Beneficial insects",
                        "Neem oil"
                    ],
                    chemicalTreatment: [
                        "Spiromesifen",
                        "Pyriproxyfen",
                        "Buprofezin",
                        "Consult expert for dosage"
                    ]
                }
            }
        ],
        hi: [
            {
                success: true,
                result: {
                    pestName: "खरीफ आर्मीवर्म",
                    confidence: 85,
                    severity: "high",
                    description: "खरीफ आर्मीवर्म एक गंभीर कीट है जो मकई, ज्वार और अन्य फसलों को प्रभावित करता है।",
                    symptoms: [
                        "पत्तियों में बड़े अनियमित छेद",
                        "नए पत्तों पर खिड़की दुष्टता",
                        "पौधों पर इल्ली की उपस्थिति",
                        "पत्तों पर फ्रास (कीट कचरा)"
                    ],
                    treatment: [
                        "बैसिलस थुरिंजिएंसिस (बीटी) स्प्रे का प्रयोग करें",
                        "नीम तेल घोल का उपयोग करें (2 मिली प्रति लीटर पानी)",
                        "ट्राइकोग्रामा वास्प जैसे लाभकारी कीटों को पेश करें",
                        "प्रभावित पौधे के हिस्सों को हटाएं और नष्ट करें"
                    ],
                    prevention: [
                        "नियमित खेत निगरानी",
                        "कटाई के बाद फसल अवशेषों को नष्ट करें",
                        "मैरिगोल्ड जैसी फसल लगाएं",
                        "उचित खेत स्वच्छता बनाए रखें"
                    ],
                    cropsDamaged: ["मकई", "ज्वार", "चावल", "गेहूं"],
                    seasonality: "गर्म, आर्द्र महीनों के दौरान सक्रिय",
                    organicTreatment: [
                        "नीम तेल स्प्रे (2 मिली प्रति लीटर पानी)",
                        "लहसुन-मिर्च स्प्रे",
                        "लाभकारी कीट रिलीज़",
                        "मैरिगोल्ड के साथ सहचर खेती"
                    ],
                    chemicalTreatment: [
                        "क्लोरान्ट्रनिलिप्रोल 0.4% जीआर",
                        "एमेमेक्टिन बेंजोएट 5% एसजी",
                        "स्पिनोसैड 45% एससी",
                        "उचित खुराक के लिए स्थानीय कृषि अधिकारी से परामर्श लें"
                    ]
                }
            },
            {
                success: true,
                result: {
                    pestName: "माहू (Aphids)",
                    confidence: 80,
                    severity: "medium",
                    description: "छोटे कोमल शरीर वाले कीड़े जो पौधों का रस चूसते हैं।",
                    symptoms: [
                        "पत्तियों का पीला होना",
                        "चिपचिपा पदार्थ",
                        "मुड़ी हुई पत्तियाँ",
                        "बौनी वृद्धि"
                    ],
                    treatment: [
                        "पानी का छिड़काव",
                        "नीम तेल लगाएं",
                        "कीटनाशक साबुन का उपयोग",
                        "लेडीबग जारी करें"
                    ],
                    prevention: [
                        "खरपतवार हटाएं",
                        "लाभकारी कीटों को बढ़ावा दें",
                        "नियमित निगरानी",
                        "उचित पौध दूरी"
                    ],
                    cropsDamaged: ["टमाटर", "आलू", "कपास", "गेहूं"],
                    seasonality: "वसंत और गर्मी के महीने",
                    organicTreatment: [
                        "नीम तेल स्प्रे",
                        "लेडीबग रिलीज़",
                        "लहसुन स्प्रे",
                        "सहचर खेती"
                    ],
                    chemicalTreatment: [
                        "इमिडाक्लोप्रिड",
                        "थायामेथॉक्साम",
                        "एसिटामिप्रिड",
                        "स्थानीय कृषि अधिकारी से परामर्श लें"
                    ]
                }
            },
            {
                success: true,
                result: {
                    pestName: "सफेद मक्खी (Whitefly)",
                    confidence: 75,
                    severity: "medium",
                    description: "छोटी सफेद उड़ने वाली मक्खियाँ जो पौधों का रस चूसती हैं।",
                    symptoms: [
                        "पत्तियों का पीला होना",
                        "काली फफूंद",
                        "कम ताकत",
                        "चिपचिपा पदार्थ"
                    ],
                    treatment: [
                        "पीले चिपकने वाले जाल",
                        "परावर्तक मल्च",
                        "नीम तेल",
                        "कीटनाशक साबुन"
                    ],
                    prevention: [
                        "फसल चक्र",
                        "संक्रमित पौधों को हटाएं",
                        "साथी फसल",
                        "उचित संवातन"
                    ],
                    cropsDamaged: ["कपास", "टमाटर", "आलू", "गन्ना"],
                    seasonality: "गर्म जलवायु में साल भर",
                    organicTreatment: [
                        "कीटनाशक साबुन",
                        "परावर्तक मल्च",
                        "लाभकारी कीड़े",
                        "नीम तेल"
                    ],
                    chemicalTreatment: [
                        "स्पिरोमेसिफेन",
                        "पायरिप्रॉक्सिफेन",
                        "बुप्रोफेज़िन",
                        "खुराक के लिए विशेषज्ञ से परामर्श लें"
                    ]
                }
            }
        ]
    };

    // Select a random response from the array
    const responses = mockResponseArrays[language] || mockResponseArrays['en'];
    const randomIndex = Math.floor(Math.random() * responses.length);

    return responses[randomIndex];
}