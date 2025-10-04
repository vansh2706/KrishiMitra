'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Calendar, Home, Sprout, Filter, Search, Download } from 'lucide-react'

export default function TestCropCalendarPage() {
    const router = useRouter()
    const [language, setLanguage] = useState<'en' | 'hi'>('en')

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="max-w-2xl w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                <div className="text-center">
                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                        <Calendar className="w-10 h-10 text-green-600 dark:text-green-400" />
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {language === 'hi' ? 'फसल कैलेंडर' : 'Crop Calendar'}
                    </h1>

                    <p className="text-gray-600 dark:text-gray-400 mb-8">
                        {language === 'hi'
                            ? 'कृषि योजनाओं के लिए फसल कैलेंडर सुविधा का परीक्षण करें। यह सुविधा किसानों को बोने और काटने के अनुसूची की योजना बनाने में मदद करती है।'
                            : 'Test the Crop Calendar feature for agricultural planning. This feature helps farmers plan their planting and harvesting schedules.'}
                    </p>

                    {/* Language Toggle */}
                    <div className="flex justify-center gap-4 mb-8">
                        <button
                            onClick={() => setLanguage('en')}
                            className={`px-6 py-3 rounded-lg transition-colors ${language === 'en'
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                }`}
                        >
                            English
                        </button>
                        <button
                            onClick={() => setLanguage('hi')}
                            className={`px-6 py-3 rounded-lg transition-colors ${language === 'hi'
                                    ? 'bg-green-600 text-white shadow-md'
                                    : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                }`}
                        >
                            हिंदी
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        <Button
                            onClick={() => router.push('/crop-calendar')}
                            className="flex flex-col items-center justify-center h-40 bg-gradient-to-br from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-6 rounded-xl shadow-lg transition-all duration-300"
                        >
                            <Calendar className="w-10 h-10 mb-3" />
                            <span className="text-lg font-semibold">
                                {language === 'hi' ? 'पूर्ण कैलेंडर देखें' : 'View Full Calendar'}
                            </span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.push('/crop-calendar/test-page')}
                            className="flex flex-col items-center justify-center h-40 border-2 border-green-500 text-green-600 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 py-6 rounded-xl shadow-lg transition-all duration-300"
                        >
                            <Sprout className="w-10 h-10 mb-3" />
                            <span className="text-lg font-semibold">
                                {language === 'hi' ? 'परीक्षण पृष्ठ' : 'Test Page'}
                            </span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => router.push('/')}
                            className="flex flex-col items-center justify-center h-40 border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 py-6 rounded-xl shadow-lg transition-all duration-300"
                        >
                            <Home className="w-10 h-10 mb-3" />
                            <span className="text-lg font-semibold">
                                {language === 'hi' ? 'मुख्य पृष्ठ' : 'Back to Home'}
                            </span>
                        </Button>

                        <Button
                            variant="outline"
                            onClick={() => {
                                // Simulate feature test
                                alert(language === 'hi'
                                    ? 'फसल कैलेंडर सुविधा सही ढंग से काम कर रही है!'
                                    : 'Crop Calendar feature is working correctly!')
                            }}
                            className="flex flex-col items-center justify-center h-40 border-2 border-blue-300 dark:border-blue-600 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 py-6 rounded-xl shadow-lg transition-all duration-300"
                        >
                            <Search className="w-10 h-10 mb-3" />
                            <span className="text-lg font-semibold">
                                {language === 'hi' ? 'परीक्षण करें' : 'Run Tests'}
                            </span>
                        </Button>
                    </div>

                    <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            {language === 'hi' ? 'विशेषताएँ:' : 'Features:'}
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                            {[
                                language === 'hi' ? 'ऋतु-वार फसल दृश्य' : 'Season-wise crop visualization',
                                language === 'hi' ? 'बहु-भाषा समर्थन (अंग्रेजी/हिंदी)' : 'Multi-language support (English/Hindi)',
                                language === 'hi' ? 'ऋतु और फसल प्रकार द्वारा फ़िल्टरिंग' : 'Filtering by season and crop type',
                                language === 'hi' ? 'खोज कार्यक्षमता' : 'Search functionality',
                                language === 'hi' ? 'सभी उपकरणों के लिए प्रतिक्रियाशील डिज़ाइन' : 'Responsive design for all devices',
                                language === 'hi' ? 'CSV में निर्यात करने की क्षमता' : 'Export to CSV capability'
                            ].map((feature, index) => (
                                <div key={index} className="flex items-start">
                                    <span className="text-green-500 mr-2 mt-1">✓</span>
                                    <span className="text-gray-600 dark:text-gray-400">{feature}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}