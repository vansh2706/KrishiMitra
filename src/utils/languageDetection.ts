// Language Detection Utility for KrishiMitra
// Detects input language and returns appropriate language code

interface LanguagePattern {
    code: 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'mr' | 'pa'
    patterns: RegExp[]
    keywords: string[]
    unicodeRanges: [number, number][]
}

const languagePatterns: LanguagePattern[] = [
    {
        code: 'hi',
        patterns: [
            /[\u0900-\u097F]/,  // Devanagari script
            /क्या|कैसे|कब|कहाँ|क्यों|कौन|किसका|किसको|मैं|तुम|आप|है|हैं|था|थे|होगा|होंगे/,
        ],
        keywords: ['क्या', 'कैसे', 'कब', 'कहाँ', 'क्यों', 'कौन', 'मैं', 'तुम', 'आप', 'है', 'हैं', 'फसल', 'खेती', 'मिट्टी', 'गेहूं', 'चावल'],
        unicodeRanges: [[0x0900, 0x097F]]
    },
    {
        code: 'ta',
        patterns: [
            /[\u0B80-\u0BFF]/,  // Tamil script
            /என்ன|எப்படி|எப்போது|எங்கே|ஏன்|யார்|நான்|நீ|நீங்கள்|இது|அது|உள்ளது|இருக்கிறது/,
        ],
        keywords: ['என்ன', 'எப்படி', 'எப்போது', 'எங்கே', 'ஏன்', 'யார்', 'நான்', 'நீ', 'விவசாயம்', 'பயிர்', 'மண்', 'கோதுமை'],
        unicodeRanges: [[0x0B80, 0x0BFF]]
    },
    {
        code: 'te',
        patterns: [
            /[\u0C00-\u0C7F]/,  // Telugu script
            /ఏమిటి|ఎలా|ఎప్పుడు|ఎక్కడ|ఎందుకు|ఎవరు|నేను|మీరు|ఇది|అది|ఉంది|ఉన్నాయి/,
        ],
        keywords: ['ఏమిటి', 'ఎలా', 'ఎప్పుడు', 'ఎక్కడ', 'ఎందుకు', 'ఎవరు', 'నేను', 'మీరు', 'వ్యవసాయం', 'పంట', 'మట్టి', 'గోధుమ'],
        unicodeRanges: [[0x0C00, 0x0C7F]]
    },
    {
        code: 'bn',
        patterns: [
            /[\u0980-\u09FF]/,  // Bengali script
            /কি|কীভাবে|কখন|কোথায়|কেন|কে|আমি|তুমি|আপনি|এটি|সেটি|আছে|রয়েছে/,
        ],
        keywords: ['কি', 'কীভাবে', 'কখন', 'কোথায়', 'কেন', 'কে', 'আমি', 'তুমি', 'কৃষি', 'ফসল', 'মাটি', 'গম'],
        unicodeRanges: [[0x0980, 0x09FF]]
    },
    {
        code: 'gu',
        patterns: [
            /[\u0A80-\u0AFF]/,  // Gujarati script
            /શું|કેવી રીતે|ક્યારે|ક્યાં|શા માટે|કોણ|હું|તમે|આ|તે|છે|છે/,
        ],
        keywords: ['શું', 'કેવી', 'ક્યારે', 'ક્યાં', 'શા', 'કોણ', 'હું', 'તમે', 'ખેતી', 'પાક', 'માટી', 'ઘઉં'],
        unicodeRanges: [[0x0A80, 0x0AFF]]
    },
    {
        code: 'mr',
        patterns: [
            /[\u0900-\u097F]/,  // Devanagari script (same as Hindi but different keywords)
            /काय|कसे|केव्हा|कुठे|का|कोण|मी|तू|तुम्ही|हे|ते|आहे|आहेत/,
        ],
        keywords: ['काय', 'कसे', 'केव्हा', 'कुठे', 'का', 'कोण', 'मी', 'तू', 'शेती', 'पीक', 'माती', 'गहू'],
        unicodeRanges: [[0x0900, 0x097F]]
    },
    {
        code: 'pa',
        patterns: [
            /[\u0A00-\u0A7F]/,  // Gurmukhi script
            /ਕੀ|ਕਿਵੇਂ|ਕਦੋਂ|ਕਿੱਥੇ|ਕਿਉਂ|ਕੌਣ|ਮੈਂ|ਤੁਸੀਂ|ਇਹ|ਉਹ|ਹੈ|ਹਨ/,
        ],
        keywords: ['ਕੀ', 'ਕਿਵੇਂ', 'ਕਦੋਂ', 'ਕਿੱਥੇ', 'ਕਿਉਂ', 'ਕੌਣ', 'ਮੈਂ', 'ਤੁਸੀਂ', 'ਖੇਤੀਬਾੜੀ', 'ਫਸਲ', 'ਮਿੱਟੀ', 'ਕਣਕ'],
        unicodeRanges: [[0x0A00, 0x0A7F]]
    },
    {
        code: 'en',
        patterns: [
            /^[a-zA-Z\s\d.,!?;:()'-]+$/,  // English characters only
            /what|how|when|where|why|who|i|you|this|that|is|are|was|were/i,
        ],
        keywords: ['what', 'how', 'when', 'where', 'why', 'who', 'farming', 'crop', 'soil', 'wheat', 'rice'],
        unicodeRanges: [[0x0020, 0x007F], [0x00A0, 0x00FF]]
    }
]

/**
 * Detects the language of the input text
 * @param text - Input text to analyze
 * @returns Detected language code or 'en' as fallback
 */
export function detectInputLanguage(text: string): 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'mr' | 'pa' {
    if (!text || text.trim().length === 0) {
        return 'en'
    }

    const cleanText = text.toLowerCase().trim()
    const scores: { [key: string]: number } = {}

    // Initialize scores
    languagePatterns.forEach(lang => {
        scores[lang.code] = 0
    })

    languagePatterns.forEach(lang => {
        let score = 0

        // Check Unicode ranges
        for (const char of text) {
            const charCode = char.charCodeAt(0)
            for (const [start, end] of lang.unicodeRanges) {
                if (charCode >= start && charCode <= end) {
                    score += 3 // High weight for script detection
                    break
                }
            }
        }

        // Check regex patterns
        lang.patterns.forEach(pattern => {
            if (pattern.test(text)) {
                score += 2
            }
        })

        // Check keywords
        lang.keywords.forEach(keyword => {
            const keywordLower = keyword.toLowerCase()
            if (cleanText.includes(keywordLower)) {
                score += 1
            }
        })

        scores[lang.code] = score
    })

    // Find the language with the highest score
    const detectedLang = Object.keys(scores).reduce((a, b) => 
        scores[a] > scores[b] ? a : b
    ) as 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'mr' | 'pa'

    // Return detected language if score is above threshold, otherwise default to English
    return scores[detectedLang] > 0 ? detectedLang : 'en'
}

/**
 * Gets the confidence level of language detection
 * @param text - Input text to analyze
 * @returns Confidence percentage (0-100)
 */
export function getDetectionConfidence(text: string): number {
    if (!text || text.trim().length === 0) {
        return 0
    }

    const detectedLang = detectInputLanguage(text)
    const scores: { [key: string]: number } = {}

    languagePatterns.forEach(lang => {
        scores[lang.code] = 0
    })

    languagePatterns.forEach(lang => {
        let score = 0

        for (const char of text) {
            const charCode = char.charCodeAt(0)
            for (const [start, end] of lang.unicodeRanges) {
                if (charCode >= start && charCode <= end) {
                    score += 3
                    break
                }
            }
        }

        lang.patterns.forEach(pattern => {
            if (pattern.test(text)) {
                score += 2
            }
        })

        lang.keywords.forEach(keyword => {
            if (text.toLowerCase().includes(keyword.toLowerCase())) {
                score += 1
            }
        })

        scores[lang.code] = score
    })

    const maxScore = Math.max(...Object.values(scores))
    const totalScore = Object.values(scores).reduce((a, b) => a + b, 0)

    if (totalScore === 0) return 0

    return Math.round((scores[detectedLang] / maxScore) * 100)
}

/**
 * Checks if the detected language differs from the currently selected language
 * @param text - Input text to analyze
 * @param currentLanguage - Currently selected language
 * @returns Object with detection results
 */
export function checkLanguageMismatch(
    text: string, 
    currentLanguage: 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'mr' | 'pa'
) {
    const detectedLang = detectInputLanguage(text)
    const confidence = getDetectionConfidence(text)
    
    return {
        detectedLanguage: detectedLang,
        currentLanguage,
        languageMismatch: detectedLang !== currentLanguage && confidence > 50,
        confidence,
        shouldSuggestChange: detectedLang !== currentLanguage && confidence > 70
    }
}

/**
 * Gets the display name for a language code
 * @param langCode - Language code
 * @returns Display name in English and native script
 */
export function getLanguageDisplayName(langCode: 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'mr' | 'pa'): string {
    const names = {
        'en': '🇺🇸 English',
        'hi': '🇮🇳 हिंदी (Hindi)',
        'ta': '🇮🇳 தமிழ் (Tamil)',
        'te': '🇮🇳 తెలుగు (Telugu)',
        'bn': '🇧🇩 বাংলা (Bengali)',
        'gu': '🇮🇳 ગુજરાતી (Gujarati)',
        'mr': '🇮🇳 मराठी (Marathi)',
        'pa': '🇮🇳 ਪੰਜਾਬੀ (Punjabi)'
    }
    return names[langCode] || names.en
}