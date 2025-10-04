'use client'

import { useState, useEffect } from 'react'
import { Calendar, Search, Filter, Sprout, Sun, CloudRain, Wind } from 'lucide-react'

// Define the language type
type Language = 'en' | 'hi' | 'ta' | 'te' | 'bn' | 'gu' | 'mr' | 'pa'

// Define the crop data structure
interface CropData {
  id: number
  name: {
    en: string
    hi: string
    ta: string
    te: string
    bn: string
    gu: string
    mr: string
    pa: string
  }
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'All'
  cropType: 'Cereal' | 'Oilseeds' | 'Fibers' | 'Fruits' | 'Pulses' | 'Vegetables' | 'All'
  sowingStart: number
  sowingEnd: number
  harvestingStart: number
  harvestingEnd: number
  description?: {
    en: string
    hi: string
    ta: string
    te: string
    bn: string
    gu: string
    mr: string
    pa: string
  }
  waterRequirement: 'Low' | 'Medium' | 'High'
  soilType: string[]
  bestYield: string
}

export default function CropCalendarPage() {
  const [language, setLanguage] = useState<Language>('en')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSeason, setSelectedSeason] = useState<'Kharif' | 'Rabi' | 'Zaid' | 'All'>('All')
  const [selectedCropType, setSelectedCropType] = useState<'Cereal' | 'Oilseeds' | 'Fibers' | 'Fruits' | 'Pulses' | 'Vegetables' | 'All'>('All')
  
  // Get month name by index (1-12)
  const getMonthName = (monthIndex: number): string => {
    const months = {
      en: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      hi: ['जन', 'फर', 'मार्च', 'अप्रै', 'मई', 'जून', 'जुल', 'अग', 'सित', 'अक्टू', 'नव', 'दिस'],
      ta: ['ஜன', 'பிப்', 'மார்', 'ஏப்', 'மே', 'ஜூன்', 'ஜூலை', 'ஆக', 'செப்', 'அக்', 'நவ', 'டிச'],
      te: ['జన', 'ఫిబ్ర', 'మార్చి', 'ఏప్రి', 'మే', 'జూన్', 'జూలై', 'ఆగ', 'సెప్టెం', 'అక్టో', 'నవం', 'డిసెం'],
      bn: ['জানু', 'ফেব্রু', 'মার্চ', 'এপ্রিল', 'মে', 'জুন', 'জুলাই', 'আগস্ট', 'সেপ্টে', 'অক্টো', 'নভে', 'ডিসে'],
      gu: ['જાન્યુ', 'ફેબ્રુ', 'માર્ચ', 'એપ્રિલ', 'મે', 'જૂન', 'જુલાઈ', 'ઑગસ્ટ', 'સપ્ટે', 'ઑક્ટો', 'નવે', 'ડિસે'],
      mr: ['जाने', 'फेब्रु', 'मार्च', 'एप्रि', 'मे', 'जून', 'जुलै', 'ऑग', 'सप्टें', 'ऑक्टो', 'नोव्हें', 'डिसें'],
      pa: ['ਜਨ', 'ਫਰਵਰੀ', 'ਮਾਰਚ', 'ਅਪ੍ਰੈਲ', 'ਮਈ', 'ਜੂਨ', 'ਜੁਲਾਈ', 'ਅਗਸਤ', 'ਸਤੰਬਰ', 'ਅਕਤੂਬਰ', 'ਨਵੰਬਰ', 'ਦਸੰਬਰ']
    }
    return months[language][monthIndex - 1] || ''
  }

  // Extended crop data with more Indian crops
  const allCrops: CropData[] = [
    {
      id: 1,
      name: { en: 'Rice', hi: 'चावल', ta: 'அரிசி', te: 'బియ్యం', bn: 'ধান', gu: 'ચોખા', mr: 'तांदूळ', pa: 'ਚਾਵਲ' },
      season: 'Kharif',
      cropType: 'Cereal',
      sowingStart: 6, // June
      sowingEnd: 7,   // July
      harvestingStart: 10, // October
      harvestingEnd: 11,   // November
      description: {
        en: 'Major Kharif crop requiring plenty of water',
        hi: 'प्रमुख खरीफ फसल जिसके लिए पर्याप्त पानी की आवश्यकता होती है',
        ta: 'நீர் அதிகமாக தேவைப்படும் முக்கிய கரீஃப் பயிர்',
        te: 'చాలా నీరు అవసరమైన ప్రధాన ఖరీఫ్ పంట',
        bn: 'প্রচুর জল প্রয়োজন হয় এমন প্রধান খরিফ ফসল',
        gu: 'પ્રચુર પાણીની જરૂર ધરાવતી મુખ્ય ખરીફ પાક',
        mr: 'पुष्कळ पाण्याची आवश्यकता असलेली मुख्य खरीफ पीक',
        pa: 'ਬਹੁਤ ਸਾਰਾ ਪਾਣੀ ਚਾਹੁੰਦੀ ਹੈ ਮੁੱਖ ਖਰੀਫ ਫਸਲ'
      },
      waterRequirement: 'High',
      soilType: ['Clay', 'Loamy'],
      bestYield: '4-6 tons/hectare'
    },
    {
      id: 2,
      name: { en: 'Wheat', hi: 'गेहूँ', ta: 'கோதுமை', te: 'గోధుమ', bn: 'গম', gu: 'ઘઉં', mr: 'गहू', pa: 'ਕਣਕ' },
      season: 'Rabi',
      cropType: 'Cereal',
      sowingStart: 10, // October
      sowingEnd: 11,   // November
      harvestingStart: 3,  // March
      harvestingEnd: 4,    // April
      description: {
        en: 'Major Rabi crop sown in winter',
        hi: 'प्रमुख रबी फसल शीतकाल में बोई जाती है',
        ta: 'குளிர்காலத்தில் விதைக்கப்படும் முக்கிய ரபி பயிர்',
        te: 'శీతాకాలంలో నాటే ప్రధాన రబీ పంట',
        bn: 'শীতকালে রোপণ করা প্রধান রবি ফসল',
        gu: 'શિયાળામાં રોપવામાં આવતી મુખ્ય રબી પાક',
        mr: 'हिवाळ्यात लावलेली मुख्य रब्बी पीक',
        pa: 'ਸਰਦੀਆਂ ਵਿੱਚ ਲਗਾਈ ਜਾਣ ਵਾਲੀ ਮੁੱਖ ਰਬੀ ਫਸਲ'
      },
      waterRequirement: 'Medium',
      soilType: ['Loamy', 'Sandy Loam'],
      bestYield: '3-5 tons/hectare'
    },
    {
      id: 3,
      name: { en: 'Maize', hi: 'मक्का', ta: 'சோளம்', te: 'మొక్కజొన్న', bn: 'ভুট্টা', gu: 'મકાઈ', mr: 'मका', pa: 'ਮੱਕੀ' },
      season: 'Kharif',
      cropType: 'Cereal',
      sowingStart: 6, // June
      sowingEnd: 8, // August
      harvestingStart: 9, // September
      harvestingEnd: 11, // November
      description: {
        en: 'Kharif cereal crop used for food and fodder',
        hi: 'खरीफ अनाज फसल जिसका उपयोग खाद्य और चारा के लिए किया जाता है',
        ta: 'உணவு மற்றும் தீன்றுகொள்ளுதலுக்காக பயன்படுத்தப்படும் கரீஃப் கோதுமை பயிர்',
        te: 'ఆహారం మరియు ఎండబెట్టుకోడానికి ఉపయోగించే ఖరీఫ్ ధాన్యం',
        bn: 'খাদ্য এবং চারা হিসাবে ব্যবহৃত খরিফ শস্য ফসল',
        gu: 'ખાદ્ય અને ચારો માટે ઉપયોગમાં લેવાતી ખરીફ અનાજની પાક',
        mr: 'अन्न आणि चारा म्हणून वापरली जाणारी खरीफ धान्य पीक',
        pa: 'ਖੁਰਾਕ ਅਤੇ ਚਾਰਾ ਲਈ ਵਰਤੀ ਜਾਣ ਵਾਲੀ ਖਰੀਫ ਅਨਾਜ ਫਸਲ'
      },
      waterRequirement: 'High',
      soilType: ['Loamy', 'Sandy Loam'],
      bestYield: '3-8 tons/hectare'
    },
    {
      id: 4,
      name: { en: 'Barley', hi: 'जौ', ta: 'வாற்கோதுமை', te: 'యవలు', bn: 'যব', gu: 'જવ', mr: 'जव', pa: 'ਜੌਂ' },
      season: 'Rabi',
      cropType: 'Cereal',
      sowingStart: 10, // October
      sowingEnd: 11, // November
      harvestingStart: 3, // March
      harvestingEnd: 4, // April
      description: {
        en: 'Rabi cereal crop tolerant to cold and drought',
        hi: 'रबी अनाज फसल जो ठंड और सूखे के प्रति सहनशील है',
        ta: 'குளிர் மற்றும் வறட்சிக்கு தாங்கும் ரபி கோதுமை பயிர்',
        te: 'చల్లడం మరియు వర్షం లేకపోవడం పట్ల ఓపిక కలిగిన రబీ ధాన్యం',
        bn: 'ঠান্ডা এবং শুকনো আবহাওয়ার প্রতি সহনশীল রবি শস্য ফসল',
        gu: 'શીત અને સૂકા પ્રત્યે સહનશીલ રબી અનાજની પાક',
        mr: 'थंड आणि ड्राऊट यांच्या प्रति सहनशील रब्बी धान्य पीक',
        pa: 'ਠੰਢ ਅਤੇ ਡਰਾਊਟ ਪ੍ਰਤੀ ਸਹਿਣਸ਼ੀਲ ਰਬੀ ਅਨਾਜ ਫਸਲ'
      },
      waterRequirement: 'Low',
      soilType: ['Sandy Loam', 'Loamy'],
      bestYield: '2-4 tons/hectare'
    },
    {
      id: 5,
      name: { en: 'Mustard', hi: 'सरसों', ta: 'கடுகு', te: 'ఆవాలు', bn: 'সরিষা', gu: 'રાઈ', mr: 'मोहरी', pa: 'ਸਰੋਂ' },
      season: 'Rabi',
      cropType: 'Oilseeds',
      sowingStart: 10, // October
      sowingEnd: 12, // December
      harvestingStart: 2, // February
      harvestingEnd: 4, // April
      description: {
        en: 'Major Rabi oilseed crop',
        hi: 'प्रमुख रबी तिलहन फसल',
        ta: 'முக்கிய ரபி எண்ணெய் பயிர்',
        te: 'ప్రధాన రబీ ఎండు ధాన్యం',
        bn: 'প্রধান রবি তেল ফসল',
        gu: 'મુખ્ય રબી તેલદાણાંની પાક',
        mr: 'मुख्य रब्बी तेलबियाणे पीक',
        pa: 'ਮੁੱਖ ਰਬੀ ਤੇਲ ਫਸਲ'
      },
      waterRequirement: 'Medium',
      soilType: ['Clay Loam', 'Loamy'],
      bestYield: '1-2 tons/hectare'
    },
    {
      id: 6,
      name: { en: 'Cotton', hi: 'कपास', ta: 'பருத்தி', te: 'పత్తి', bn: 'তুলা', gu: 'કપાસ', mr: 'कापूस', pa: 'ਕਪਾਹ' },
      season: 'Kharif',
      cropType: 'Fibers',
      sowingStart: 5, // May
      sowingEnd: 7, // July
      harvestingStart: 10, // October
      harvestingEnd: 12, // December
      description: {
        en: 'Kharif fiber crop',
        hi: 'खरीफ रेशम फसल',
        ta: 'கரீஃப் இழை பயிர்',
        te: 'ఖరీఫ్ ఫైబర్ పంట',
        bn: 'খরিফ ফাইবার ফসল',
        gu: 'ખરીફ રેશમની પાક',
        mr: 'खरीफ फायबर पीक',
        pa: 'ਖਰੀਫ ਰੇਸ਼ਮ ਫਸਲ'
      },
      waterRequirement: 'Medium',
      soilType: ['Black', 'Loamy'],
      bestYield: '400-600 kg/hectare'
    },
    {
      id: 7,
      name: { en: 'Sugarcane', hi: 'गन्ना', ta: 'கரும்பு', te: 'చెరకు', bn: 'আখ', gu: 'શેરડી', mr: 'ऊस', pa: 'ਗੰਨਾ' },
      season: 'Zaid',
      cropType: 'Cereal',
      sowingStart: 1, // January
      sowingEnd: 3, // March
      harvestingStart: 9, // September
      harvestingEnd: 12, // December
      description: {
        en: 'Long duration Zaid crop',
        hi: 'लंबी अवधि की ज़ैद फसल',
        ta: 'நீண்ட கால ஜைத் பயிர்',
        te: 'దీర్ఘకాలం పడిన జైత్ పంట',
        bn: 'দীর্ঘ সময়ের জাইদ ফসল',
        gu: 'લાંબા સમયની જૈત પાક',
        mr: 'दीर्घ कालीन जैत पीक',
        pa: 'ਲੰਬੇ ਸਮੇਂ ਦੀ ਜ਼ੈਦ ਫਸਲ'
      },
      waterRequirement: 'High',
      soilType: ['Alluvial', 'Black'],
      bestYield: '60-80 tons/hectare'
    },
    {
      id: 8,
      name: { en: 'Watermelon', hi: 'तरबूज', ta: 'தர்பூசணி', te: 'బంతాకాయ', bn: 'তরমুজ', gu: 'તરબૂચ', mr: 'तरबूज', pa: 'ਤਰਬੂਜ਼' },
      season: 'Zaid',
      cropType: 'Fruits',
      sowingStart: 3, // March
      sowingEnd: 5, // May
      harvestingStart: 6, // June
      harvestingEnd: 8, // August
      description: {
        en: 'Summer Zaid fruit crop',
        hi: 'ग्रीष्मकालीन ज़ैद फल फसल',
        ta: 'கோடை ஜைத் பழ பயிர்',
        te: 'వేసవి జైత్ పండు పంట',
        bn: 'গ্রীষ্মকালীন জাইদ ফল ফসল',
        gu: 'ઉનાળાની જૈત ફળની પાક',
        mr: 'उन्हाळ्यातील जैत फळ पीक',
        pa: 'ਗਰਮੀਆਂ ਦੀ ਜ਼ੈਦ ਫਲ ਫਸਲ'
      },
      waterRequirement: 'High',
      soilType: ['Sandy Loam', 'Loamy'],
      bestYield: '20-30 tons/hectare'
    },
    {
      id: 9,
      name: { en: 'Groundnut', hi: 'मूंगफली', ta: 'நிலக்கடலை', te: 'భూభున్న', bn: 'চলা মেচ', gu: 'ચુખા', mr: 'भुईमूग', pa: 'ਮੰਗਫਲੀ' },
      season: 'Kharif',
      cropType: 'Oilseeds',
      sowingStart: 6, // June
      sowingEnd: 7, // July
      harvestingStart: 9, // September
      harvestingEnd: 10, // October
      description: {
        en: 'Kharif oilseed crop grown underground',
        hi: 'खरीफ तिलहन फसल जो भूमि के नीचे उगती है',
        ta: 'மண்ணடியில் வளரும் கரீஃப் எண்ணெய் பயிர்',
        te: 'భూగర్భంలో పెరిగే ఖరీఫ్ ఎండు ధాన్యం',
        bn: 'মাটির নিচে গজানো খরিফ তেল ফসল',
        gu: 'જમીન નીચે ઉગતી ખરીફ તેલદાણાંની પાક',
        mr: 'जमिनीखाली वाढणारी खरीफ तेलबियाणे पीक',
        pa: 'ਧਰਤੀ ਹੇਠਾਂ ਵਧਣ ਵਾਲੀ ਖਰੀਫ ਤੇਲ ਫਸਲ'
      },
      waterRequirement: 'Medium',
      soilType: ['Sandy Loam', 'Red'],
      bestYield: '1.5-2.5 tons/hectare'
    },
    {
      id: 10,
      name: { en: 'Pulses', hi: 'दालें', ta: 'பருப்புகள்', te: 'పప్పులు', bn: 'ডাল', gu: 'દાળ', mr: 'डाळी', pa: 'ਦਾਲਾਂ' },
      season: 'Rabi',
      cropType: 'Pulses',
      sowingStart: 10, // October
      sowingEnd: 11, // November
      harvestingStart: 2, // February
      harvestingEnd: 4, // April
      description: {
        en: 'Rabi pulse crops rich in protein',
        hi: 'प्रोटीन से समृद्ध रबी दाल फसलें',
        ta: 'புரதம் சத்தான ரபி பருப்பு பயிர்கள்',
        te: 'ప్రోటీన్ లో ధనికమైన రబీ పప్పు పంటలు',
        bn: 'প্রোটিন সমৃদ্ধ রবি ডাল ফসল',
        gu: 'પ્રોટીનથી સમૃદ્ધ રબી દાળની પાક',
        mr: 'प्रोटीनयुक्त रब्बी डाळी पीक',
        pa: 'ਪ੍ਰੋਟੀਨ ਨਾਲ ਭਰਪੂਰ ਰਬੀ ਦਾਲਾਂ ਦੀਆਂ ਫਸਲਾਂ'
      },
      waterRequirement: 'Low',
      soilType: ['Loamy', 'Sandy Loam'],
      bestYield: '0.8-1.5 tons/hectare'
    },
    {
      id: 11,
      name: { en: 'Potato', hi: 'आलू', ta: 'உருளைக்கிழங்கு', te: 'ఉల్లిగడ్డ', bn: 'আলু', gu: 'બટાટા', mr: 'बटाटा', pa: 'ਆਲੂ' },
      season: 'Rabi',
      cropType: 'Vegetables',
      sowingStart: 10, // October
      sowingEnd: 12, // December
      harvestingStart: 1, // January
      harvestingEnd: 3, // March
      description: {
        en: 'Cool season vegetable crop',
        hi: 'शीत ऋतु की सब्जी फसल',
        ta: 'குளிர்கால காய்கறி பயிர்',
        te: 'చల్లని ఋతువు కూరగాయల పంట',
        bn: 'শীতকালীন সবজি ফসল',
        gu: 'શિયાળાની શાકભાજીની પાક',
        mr: 'हिवाळ्यातील भाजीपाला पीक',
        pa: 'ਠੰਢੀ ਮੌਸਮ ਦੀ ਸਬਜ਼ੀ ਦੀ ਫਸਲ'
      },
      waterRequirement: 'Medium',
      soilType: ['Sandy Loam', 'Loamy'],
      bestYield: '15-25 tons/hectare'
    },
    {
      id: 12,
      name: { en: 'Onion', hi: 'प्याज', ta: 'வெங்காயம்', te: 'ఉల్లిపాయ', bn: 'পেঁয়াজ', gu: 'દુંગળી', mr: 'कांदा', pa: 'ਪਿਆਜ਼' },
      season: 'Rabi',
      cropType: 'Vegetables',
      sowingStart: 10, // October
      sowingEnd: 11, // November
      harvestingStart: 1, // January
      harvestingEnd: 2, // February
      description: {
        en: 'Rabi vegetable crop with high market value',
        hi: 'उच्च बाजार मूल्य वाली रबी सब्जी फसल',
        ta: 'அதிக சந்தை மதிப்புடைய ரபி காய்கறி பயிர்',
        te: 'అధిక మార్కెట్ విలువ కలిగిన రబీ కూరగాయల పంట',
        bn: 'উচ্চ বাজার মূল্যের রবি সবজি ফসল',
        gu: 'ઉચ્ચ બજાર મૂલ્ય ધરાવતી રબી શાકભાજીની પાક',
        mr: 'उच्च बाजार भावाची रब्बी भाजीपाला पीक',
        pa: 'ਉੱਚ ਬਾਜ਼ਾਰ ਮੁੱਲ ਵਾਲੀ ਰਬੀ ਸਬਜ਼ੀ ਦੀ ਫਸਲ'
      },
      waterRequirement: 'Low',
      soilType: ['Sandy Loam', 'Loamy'],
      bestYield: '10-15 tons/hectare'
    }
  ]

  // Filter crops based on search and filters
  const filteredCrops = allCrops.filter(crop => {
    const matchesSearch = crop.name[language].toLowerCase().includes(searchQuery.toLowerCase()) || 
                          crop.description?.[language].toLowerCase().includes(searchQuery.toLowerCase())
    const matchesSeason = selectedSeason === 'All' || crop.season === selectedSeason
    const matchesCropType = selectedCropType === 'All' || crop.cropType === selectedCropType
    
    return matchesSearch && matchesSeason && matchesCropType
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-800 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-900 dark:to-green-800 mb-4 shadow-lg">
            <Calendar className="text-green-600 dark:text-green-400 w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            {language === 'hi' ? 'फसल कैलेंडर' : language === 'ta' ? 'பயிர் நாட்காட்டி' : language === 'te' ? 'పంట క్యాలెండర్' : language === 'bn' ? 'ফসল ক্যালেন্ডার' : language === 'gu' ? 'પાક કૅલેન્ડર' : language === 'mr' ? 'पीक दिनदर्शिका' : language === 'pa' ? 'ਫਸਲ ਕੈਲੰਡਰ' : 'Crop Calendar'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-3xl mx-auto text-base sm:text-lg">
            {language === 'hi'
              ? 'अपनी फसलों के लिए समय पर बोने और काटने की जानकारी प्राप्त करें। इस कैलेंडर का उपयोग करके अपनी फसलों की उपज को अधिकतम करें।'
              : language === 'ta'
                ? 'உங்கள் பயிர்களை நேரம் செலுத்தி விதைக்கவும் மற்றும் அறுவடை செய்யவும் தகவலைப் பெறுங்கள். இந்த நாட்காட்டியைப் பயன்படுத்தி உங்கள் பயிர் விளைச்சலை அதிகரிக்கவும்.'
                : language === 'te'
                  ? 'మీ పంటలను సమయానికి నాటడం మరియు పంట కోసడం కోసం సమాచారం పొందండి. ఈ క్యాలెండర్‌ను ఉపయోగించడం ద్వారా మీ పంట దిగుబడిని గరిష్ఠం చేయండి.'
                  : language === 'bn'
                    ? 'আপনার ফসলগুলি সময়মতো রোপণ এবং ফসল কাটার জন্য তথ্য পান। এই ক্যালেন্ডারটি ব্যবহার করে আপনার ফসলের ফলন সর্বাধিক করুন।'
                    : language === 'gu'
                      ? 'તમારા પાકના સમયસર રોપણ અને કાપવા માટે માહિતી મેળવો. આ કૅલેન્ડરનો ઉપયોગ કરીને તમારા પાકની ઉપજ વધારો.'
                      : language === 'mr'
                        ? 'तुमच्या पिकांच्या वेळेवर लावण्यासाठी आणि कापण्यासाठी माहिती मिळवा. या दिनदर्शिकेचा वापर करून तुमच्या पिकाची उत्पादन वाढवा.'
                        : language === 'pa'
                          ? 'ਆਪਣੀਆਂ ਫਸਲਾਂ ਨੂੰ ਸਮੇਂ ਸਿੱਟਣ ਅਤੇ ਕਟਾਈ ਲਈ ਜਾਣਕਾਰੀ ਪ੍ਰਾਪਤ ਕਰੋ। ਇਸ ਕੈਲੰਡਰ ਦੀ ਵਰਤੋਂ ਕਰਕੇ ਆਪਣੀਆਂ ਫਸਲਾਂ ਦੀ ਪੈਦਾਵਾਰ ਵਧਾਓ।'
                          : 'Get timely information for sowing and harvesting your crops. Maximize your crop yield by using this calendar.'}
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-6 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                placeholder={language === 'hi' ? 'फसल खोजें...' : language === 'ta' ? 'பயிர்களைத் தேடு...' : language === 'te' ? 'పంటలను శోధించండి...' : language === 'bn' ? 'ফসল খুঁজুন...' : language === 'gu' ? 'પાક શોધો...' : language === 'mr' ? 'पीक शोधा...' : language === 'pa' ? 'ਫਸਲਾਂ ਦੀ ਖੋਜ ਕਰੋ...' : 'Search crops...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* Season Filter */}
            <div className="w-full md:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Sun className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  value={selectedSeason}
                  onChange={(e) => setSelectedSeason(e.target.value as 'Kharif' | 'Rabi' | 'Zaid' | 'All')}
                >
                  <option value="All">{language === 'hi' ? 'सभी ऋतुएँ' : language === 'ta' ? 'அனைத்து வருடங்கள்' : language === 'te' ? 'అన్ని ఋతువులు' : language === 'bn' ? 'সব মৌসুম' : language === 'gu' ? 'બધા ઋતુ' : language === 'mr' ? 'सर्व ऋतू' : language === 'pa' ? 'ਸਾਰੇ ਮਹੀਨੇ' : 'All Seasons'}</option>
                  <option value="Kharif">Kharif ({language === 'hi' ? 'खरीफ' : 'Monsoon'})</option>
                  <option value="Rabi">Rabi ({language === 'hi' ? 'रबी' : 'Winter'})</option>
                  <option value="Zaid">Zaid ({language === 'hi' ? 'जैद' : 'Summer'})</option>
                </select>
              </div>
            </div>

            {/* Crop Type Filter */}
            <div className="w-full md:w-48">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Sprout className="w-5 h-5 text-gray-400" />
                </div>
                <select
                  className="block w-full pl-10 p-3 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-green-500 focus:border-green-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-green-500 dark:focus:border-green-500"
                  value={selectedCropType}
                  onChange={(e) => setSelectedCropType(e.target.value as 'Cereal' | 'Oilseeds' | 'Fibers' | 'Fruits' | 'Pulses' | 'Vegetables' | 'All')}
                >
                  <option value="All">{language === 'hi' ? 'सभी प्रकार' : language === 'ta' ? 'அனைத்து வகைகள்' : language === 'te' ? 'అన్ని రకాలు' : language === 'bn' ? 'সব ধরণ' : language === 'gu' ? 'બધા પ્રકાર' : language === 'mr' ? 'सर्व प्रकार' : language === 'pa' ? 'ਸਾਰੇ ਕਿਸਮਾਂ' : 'All Types'}</option>
                  <option value="Cereal">{language === 'hi' ? 'अनाज' : language === 'ta' ? 'கோதுமை' : language === 'te' ? 'ధాన్యాలు' : language === 'bn' ? 'শস্য' : language === 'gu' ? 'અનાજ' : language === 'mr' ? 'धान्य' : language === 'pa' ? 'ਅਨਾਜ' : 'Cereal'}</option>
                  <option value="Pulses">{language === 'hi' ? 'दालें' : language === 'ta' ? 'பருப்புகள்' : language === 'te' ? 'పప్పులు' : language === 'bn' ? 'ডাল' : language === 'gu' ? 'દાળ' : language === 'mr' ? 'डाळी' : language === 'pa' ? 'ਦਾਲਾਂ' : 'Pulses'}</option>
                  <option value="Oilseeds">{language === 'hi' ? 'तिलहन' : language === 'ta' ? 'எண்ணெய் விதைகள்' : language === 'te' ? 'ఎండు ధాన్యాలు' : language === 'bn' ? 'তেল বীজ' : language === 'gu' ? 'તેલદાણાં' : language === 'mr' ? 'तेलबियाणे' : language === 'pa' ? 'ਤੇਲ ਦਾਣੇ' : 'Oilseeds'}</option>
                  <option value="Vegetables">{language === 'hi' ? 'सब्जियाँ' : language === 'ta' ? 'காய்கறிகள்' : language === 'te' ? 'కూరగాయలు' : language === 'bn' ? 'সবজি' : language === 'gu' ? 'શાકભાજી' : language === 'mr' ? 'भाज्या' : language === 'pa' ? 'ਸਬਜ਼ੀਆਂ' : 'Vegetables'}</option>
                  <option value="Fruits">{language === 'hi' ? 'फल' : language === 'ta' ? 'பழங்கள்' : language === 'te' ? 'పండ్లు' : language === 'bn' ? 'ফল' : language === 'gu' ? 'ફળો' : language === 'mr' ? 'फळे' : language === 'pa' ? 'ਫਲ' : 'Fruits'}</option>
                  <option value="Fibers">{language === 'hi' ? 'रेशम' : language === 'ta' ? 'இழைகள்' : language === 'te' ? 'ఫైబర్లు' : language === 'bn' ? 'ফাইবার' : language === 'gu' ? 'રેશમ' : language === 'mr' ? 'फायबर' : language === 'pa' ? 'ਰੇਸ਼ਮ' : 'Fibers'}</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Language Selector */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex flex-wrap rounded-md shadow-sm" role="group">
            {(['en', 'hi', 'ta', 'te', 'bn', 'gu', 'mr', 'pa'] as Language[]).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={`px-3 py-2 text-sm font-medium ${
                  language === lang
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600'
                } border border-gray-200 dark:border-gray-600 first:rounded-l-lg last:rounded-r-lg`}
              >
                {lang === 'en' ? 'English' : 
                 lang === 'hi' ? 'हिंदी' : 
                 lang === 'ta' ? 'தமிழ்' : 
                 lang === 'te' ? 'తెలుగు' : 
                 lang === 'bn' ? 'বাংলা' : 
                 lang === 'gu' ? 'ગુજરાતી' : 
                 lang === 'mr' ? 'मराठी' : 'ਪੰਜਾਬੀ'}
              </button>
            ))}
          </div>
        </div>

        {/* Results Info */}
        <div className="mb-4 text-center">
          <p className="text-gray-600 dark:text-gray-400">
            {language === 'hi' 
              ? `${filteredCrops.length} फसलें मिलीं` 
              : language === 'ta' 
                ? `${filteredCrops.length} பயிர்கள் கண்டறியப்பட்டன` 
                : language === 'te' 
                  ? `${filteredCrops.length} పంటలు కనుగొనబడ్డాయి` 
                  : language === 'bn' 
                    ? `${filteredCrops.length} টি ফসল পাওয়া গেছে` 
                    : language === 'gu' 
                      ? `${filteredCrops.length} પાક મળ્યા` 
                      : language === 'mr' 
                        ? `${filteredCrops.length} पीक मिळाली` 
                        : language === 'pa' 
                          ? `${filteredCrops.length} ਫਸਲਾਂ ਮਿਲੀਆਂ` 
                          : `${filteredCrops.length} crops found`}
          </p>
        </div>

        {/* Crop List */}
        {filteredCrops.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredCrops.map(crop => (
              <div key={crop.id} className="bg-white dark:bg-gray-700 rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {crop.name[language]}
                  </h2>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    crop.season === 'Kharif' 
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100' 
                      : crop.season === 'Rabi' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100' 
                        : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100'
                  }`}>
                    {crop.season}
                  </span>
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {language === 'hi' ? 'प्रकार' : language === 'ta' ? 'வகை' : language === 'te' ? 'రకం' : language === 'bn' ? 'ধরণ' : language === 'gu' ? 'પ્રકાર' : language === 'mr' ? 'प्रकार' : language === 'pa' ? 'ਕਿਸਮ' : 'Type'}: {crop.cropType}
                </p>
                
                {crop.description && (
                  <p className="text-xs text-gray-500 dark:text-gray-300 mb-3">
                    {crop.description[language]}
                  </p>
                )}
                
                <div className="space-y-2">
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <CloudRain className="w-3 h-3 mr-1" />
                    <span>
                      {language === 'hi' ? 'पानी' : language === 'ta' ? 'நீர்' : language === 'te' ? 'నీరు' : language === 'bn' ? 'জল' : language === 'gu' ? 'પાણી' : language === 'mr' ? 'पाणी' : language === 'pa' ? 'ਪਾਣੀ' : 'Water'}: {crop.waterRequirement}
                    </span>
                  </div>
                  
                  <div className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                    <Wind className="w-3 h-3 mr-1" />
                    <span>
                      {language === 'hi' ? 'मिट्टी' : language === 'ta' ? 'மண்' : language === 'te' ? 'నేల' : language === 'bn' ? 'মাটি' : language === 'gu' ? 'માટી' : language === 'mr' ? 'जमीन' : language === 'pa' ? 'ਮਿੱਟੀ' : 'Soil'}: {crop.soilType.join(', ')}
                    </span>
                  </div>
                  
                  <div className="text-xs text-gray-600 dark:text-gray-400">
                    <span className="font-medium">
                      {language === 'hi' ? 'उत्पादन' : language === 'ta' ? 'விளைச்சல்' : language === 'te' ? 'దిగుబడి' : language === 'bn' ? 'ফলন' : language === 'gu' ? 'ઉત્પાદન' : language === 'mr' ? 'उत्पादन' : language === 'pa' ? 'ਪੈਦਾਵਾਰ' : 'Yield'}:
                    </span> {crop.bestYield}
                  </div>
                </div>
                
                <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                  <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                    {language === 'hi' ? 'बोना' : language === 'ta' ? 'விதைத்தல்' : language === 'te' ? 'నాటడం' : language === 'bn' ? 'রোপণ' : language === 'gu' ? 'રોપણ' : language === 'mr' ? 'लावणे' : language === 'pa' ? 'ਬੋਨਾ' : 'Sowing'}: {getMonthName(crop.sowingStart)} - {getMonthName(crop.sowingEnd)}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {language === 'hi' ? 'काटना' : language === 'ta' ? 'அறுவடை' : language === 'te' ? 'పంట కోసడం' : language === 'bn' ? 'ফসল কাটানো' : language === 'gu' ? 'કાપવું' : language === 'mr' ? 'कापणे' : language === 'pa' ? 'ਕਟਾਈ' : 'Harvesting'}: {getMonthName(crop.harvestingStart)} - {getMonthName(crop.harvestingEnd)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Sprout className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-1">
              {language === 'hi' ? 'कोई फसल नहीं मिली' : language === 'ta' ? 'பயிர்கள் எதுவும் கிடைக்கவில்லை' : language === 'te' ? 'పంటలు ఏవీ కనబడలేదు' : language === 'bn' ? 'কোন ফসল পাওয়া যায়নি' : language === 'gu' ? 'કોઈ પાક મળ્યું નથી' : language === 'mr' ? 'कोणतीही पीक मिळाली नाही' : language === 'pa' ? 'ਕੋਈ ਫਸਲ ਨਹੀਂ ਮਿਲੀ' : 'No crops found'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {language === 'hi'
                ? 'अपने खोज या फ़िल्टर को समायोजित करने का प्रयास करें'
                : language === 'ta' ? 'உங்கள் தேடல் அல்லது வடிப்பான்களைச் சரிசெய்ய முயற்சிக்கவும்'
                : language === 'te' ? 'మీ శోధన లేదా ఫిల్టర్లను సర్దుబాటు చేయడానికి ప్రయత్నించండి'
                : language === 'bn' ? 'আপনার অনুসন্ধান বা ফিল্টার সামঞ্জস্য করার চেষ্টা করুন'
                : language === 'gu' ? 'તમારી શોધ અથવા ફિલ્ટરોને સમાયોજિત કરવાનો પ્રયત્ન કરો'
                : language === 'mr' ? 'तुमच्या शोध किंवा फिल्टरची समायोजने करण्याचा प्रयत्न करा'
                : language === 'pa' ? 'ਆਪਣੀ ਖੋਜ ਜਾਂ ਫਿਲਟਰਾਂ ਨੂੰ ਸਮਾਯੋਜਿਤ ਕਰਨ ਦੀ ਕੋਸ਼ਿਸ਼ ਕਰੋ'
                : 'Try adjusting your search or filters'}
            </p>
          </div>
        )}

        {/* Information Section */}
        <div className="mt-8 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
          <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2 flex items-center">
            <Filter className="w-5 h-5 mr-2" />
            {language === 'hi' ? 'कैलेंडर कैसे उपयोग करें' : 
             language === 'ta' ? 'நாட்காட்டியை எவ்வாறு பயன்படுத்துவது' : 
             language === 'te' ? 'క్యాలెండర్‌ను ఎలా ఉపయోగించాలి' : 
             language === 'bn' ? 'ক্যালেন্ডার কিভাবে ব্যবহার করবেন' : 
             language === 'gu' ? 'કૅલેન્ડર કેવી રીતે ઉપયોગ કરવો' : 
             language === 'mr' ? 'दिनदर्शिका कशी वापरावी' : 
             language === 'pa' ? 'ਕੈਲੰਡਰ ਕਿਵੇਂ ਵਰਤਣਾ ਹੈ' : 
             'How to Use the Calendar'}
          </h3>
          <ul className="list-disc list-inside text-sm text-blue-700 dark:text-blue-300 space-y-1">
            <li>
              {language === 'hi' ? 'अपनी स्थानीय मौसम स्थितियों के अनुसार बोने और काटने के समय को समायोजित करें' : 
               language === 'ta' ? 'உங்கள் உள்ளூர் வானிலை நிலைகளைப் பொறுத்து விதைப்பதற்கும் அறுவடை செய்வதற்கும் நேரத்தைச் சரிசெய்யவும்' : 
               language === 'te' ? 'మీ స్థానిక వాతావరణ పరిస్థితులను బట్టి నాటడం మరియు పంట కోసడానికి సమయాన్ని సర్దుబాటు చేయండి' : 
               language === 'bn' ? 'আপনার স্থানীয় আবহাওয়ার অবস্থার ভিত্তিতে রোপণ এবং ফসল কাটার সময় সামঞ্জস্য করুন' : 
               language === 'gu' ? 'તમારી સ્થાનિક હવામાનની સ્થિતિને આધારે રોપણ અને કાપવાનો સમય સમાયોજિત કરો' : 
               language === 'mr' ? 'तुमच्या स्थानिक हवामानाच्या परिस्थितींनुसार लावण्याची आणि कापण्याची वेळ समायोजित करा' : 
               language === 'pa' ? 'ਆਪਣੀ ਸਥਾਨਕ ਮੌਸਮ ਸਥਿਤੀਆਂ ਦੇ ਅਧਾਰ \'ਤੇ ਬੋਨੇ ਅਤੇ ਕੱਟਣ ਦੇ ਸਮੇਂ ਨੂੰ ਸਮਾਯੋਜਿਤ ਕਰੋ' : 
               'Adjust sowing and harvesting times based on your local weather conditions'}
            </li>
            <li>
              {language === 'hi' ? 'पानी, मिट्टी और उत्पादन की जानकारी का उपयोग अपनी फसल की योजना बनाने के लिए करें' : 
               language === 'ta' ? 'உங்கள் பயிர்களுக்கான திட்டமிடுவதற்கு நீர், மண் மற்றும் விளைச்சல் தகவல்களைப் பயன்படுத்தவும்' : 
               language === 'te' ? 'మీ పంటల ప్రణాళిక కోసం నీరు, నేల మరియు దిగుబడి సమాచారాన్ని ఉపయోగించండి' : 
               language === 'bn' ? 'আপনার ফসলের পরিকল্পনা করতে জল, মাটি এবং ফলনের তথ্য ব্যবহার করুন' : 
               language === 'gu' ? 'તમારા પાકની યોજના બનાવવા માટે પાણી, માટી અને ઉત્પાદન માહિતીનો ઉપયોગ કરો' : 
               language === 'mr' ? 'तुमच्या पिकांची योजना तयार करण्यासाठी पाणी, जमीन आणि उत्पादन माहितीचा वापर करा' : 
               language === 'pa' ? 'ਆਪਣੀਆਂ ਫਸਲਾਂ ਦੀ ਯੋਜਨਾ ਬਣਾਉਣ ਲਈ ਪਾਣੀ, ਮਿੱਟੀ ਅਤੇ ਪੈਦਾਵਾਰ ਦੀ ਜਾਣਕਾਰੀ ਦੀ ਵਰਤੋਂ ਕਰੋ' : 
               'Use water, soil, and yield information to plan your crops'}
            </li>
            <li>
              {language === 'hi' ? 'ऋतु, प्रकार और खोज फ़िल्टर का उपयोग करके अपने लिए सबसे उपयुक्त फसल ढूंढें' : 
               language === 'ta' ? 'உங்களுக்கு ஏற்ற பயிர்களைக் கண்டுபிடிக்க வருடம், வகை மற்றும் தேடல் வடிப்பான்களைப் பயன்படுத்தவும்' : 
               language === 'te' ? 'మీకు అనుకూలమైన పంటలను కనుగొనడానికి ఋతువు, రకం మరియు శోధన ఫిల్టర్లను ఉపయోగించండి' : 
               language === 'bn' ? 'আপনার জন্য উপযুক্ত ফসল খুঁজে পেতে মৌসুম, ধরণ এবং অনুসন্ধান ফিল্টার ব্যবহার করুন' : 
               language === 'gu' ? 'તમારા માટે યોગ્ય પાક શોધવા માટે ઋતુ, પ્રકાર અને શોધ ફિલ્ટરનો ઉપયોગ કરો' : 
               language === 'mr' ? 'तुमच्यासाठी योग्य पीक शोधण्यासाठी ऋतू, प्रकार आणि शोध फिल्टरचा वापर करा' : 
               language === 'pa' ? 'ਆਪਣੇ ਲਈ ਢੁਕਵੀਆਂ ਫਸਲਾਂ ਲੱਭਣ ਲਈ ਮੌਸਮ, ਕਿਸਮ ਅਤੇ ਖੋਜ ਫਿਲਟਰਾਂ ਦੀ ਵਰਤੋਂ ਕਰੋ' : 
               'Use season, type, and search filters to find the most suitable crops for you'}
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}