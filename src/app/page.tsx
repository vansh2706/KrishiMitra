'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
    Sprout,
    CloudSun,
    Bug,
    TrendingUp,
    MessageSquare,
    Globe,
    Leaf,
    Droplets,
    Sun,
    AlertTriangle,
    Moon,
    Wifi,
    WifiOff,
    Calculator,
    MessageCircle,
    ChevronDown,
    Volume2,
    VolumeX,
    LogOut,
    User
} from 'lucide-react'

import { EnhancedChatBot } from '../components/EnhancedChatBot'
import { WeatherDashboard } from '../components/WeatherDashboard'
import { SoilGuide } from '../components/SoilGuide'
import { EnhancedPestDetection } from '../components/EnhancedPestDetection'
import { EnhancedMarketPrices } from '../components/EnhancedMarketPrices'
import { CostBenefitAnalysis } from '../components/CostBenefitAnalysis'
import { AdvisoryFeedback } from '../components/AdvisoryFeedback'

import { LanguageProvider, useLanguage } from '@/hooks/useLanguage'
import { cleanupOldData } from '@/lib/offlineStorage'
import { getWeatherByCity, getCurrentLocation, getWeatherByCoordinates, formatTemperature, getWeatherAlerts, type WeatherData, isWeatherError } from '@/lib/weatherApi'
import ClientOnly from '@/components/ClientOnly'

// Removed Farcaster SDK import - not needed for core functionality
function App() {
    const router = useRouter()
    const { language, setLanguage, t, isOnline, isDarkMode, toggleDarkMode } = useLanguage()
    const [voiceEnabled, setVoiceEnabled] = useState(false)
    const [languageMenuOpen, setLanguageMenuOpen] = useState(false)
    const [activeTab, setActiveTab] = useState('dashboard')
    const [isTabLoading, setIsTabLoading] = useState(false)
    const [currentWeather, setCurrentWeather] = useState<WeatherData | null>(null)
    const [weatherLoading, setWeatherLoading] = useState(true)
    const [isAuthenticated, setIsAuthenticated] = useState(false)
    const [userData, setUserData] = useState<any>(null)
    const [authLoading, setAuthLoading] = useState(true)
    const [isHydrated, setIsHydrated] = useState(false)

    // Handle hydration
    useEffect(() => {
        setIsHydrated(true)
    }, [])

    // Check for authentication and cleanup old data
    useEffect(() => {
        // Only run after hydration
        if (!isHydrated) return

        // Check authentication
        const checkAuth = () => {
            if (typeof window !== 'undefined') {
                const storedAuth = localStorage.getItem('userAuth')
                if (storedAuth) {
                    try {
                        const parsed = JSON.parse(storedAuth)
                        setUserData(parsed)
                        setIsAuthenticated(true)
                    } catch (error) {
                        console.error('Invalid auth data:', error)
                        localStorage.removeItem('userAuth')
                    }
                }
            }
            setAuthLoading(false)
        }

        checkAuth()

        if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
            setVoiceEnabled(true)
        }
        // Clean up old offline data on app start
        cleanupOldData()

        // Fetch current weather data for dashboard
        fetchCurrentWeather()
    }, [isHydrated])

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/login')
        }
    }, [authLoading, isAuthenticated, router])

    // Logout function
    const handleLogout = () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem('userAuth')
        }
        setIsAuthenticated(false)
        setUserData(null)
        router.push('/login')
    }

    // Refresh weather when coming back online
    useEffect(() => {
        if (isOnline && !currentWeather) {
            fetchCurrentWeather()
        }
    }, [isOnline])

    // Fetch weather data for dashboard tile
    const fetchCurrentWeather = async () => {
        if (!isOnline) {
            setWeatherLoading(false)
            return
        }

        try {
            setWeatherLoading(true)

            // Try to get user's location first
            const locationResult = await getCurrentLocation()

            if ('error' in locationResult) {
                // Fallback to Delhi if location access fails
                const weatherData = await getWeatherByCity('Delhi')
                if (!isWeatherError(weatherData)) {
                    setCurrentWeather(weatherData)
                }
            } else {
                // Use current location
                const weatherData = await getWeatherByCoordinates(locationResult.lat, locationResult.lon)
                if (!isWeatherError(weatherData)) {
                    setCurrentWeather(weatherData)
                }
            }
        } catch (error) {
            console.error('Failed to fetch weather for dashboard:', error)
        } finally {
            setWeatherLoading(false)
        }
    }

    // Close language menu when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (languageMenuOpen) {
                setLanguageMenuOpen(false)
            }
        }

        if (languageMenuOpen) {
            document.addEventListener('click', handleClickOutside)
        }

        return () => {
            document.removeEventListener('click', handleClickOutside)
        }
    }, [languageMenuOpen])

    const toggleVoice = () => {
        if (voiceEnabled) {
            window.speechSynthesis.cancel()
        }
        setVoiceEnabled(!voiceEnabled)
    }

    const speak = (text: string) => {
        if (voiceEnabled && window.speechSynthesis) {
            window.speechSynthesis.cancel()
            const utterance = new SpeechSynthesisUtterance(text)

            // Set language based on current selection
            const langMap: { [key: string]: string } = {
                'en': 'en-US',
                'hi': 'hi-IN',
                'ta': 'ta-IN',
                'te': 'te-IN',
                'bn': 'bn-BD',
                'gu': 'gu-IN',
                'mr': 'mr-IN',
                'pa': 'pa-IN'
            }

            utterance.lang = langMap[language] || 'en-US'
            utterance.rate = 0.8
            utterance.pitch = 1
            utterance.volume = 0.8

            // Set voice if available
            const voices = window.speechSynthesis.getVoices()
            const preferredVoice = voices.find(voice =>
                voice.lang.startsWith(langMap[language] || 'en')
            )
            if (preferredVoice) {
                utterance.voice = preferredVoice
            }

            window.speechSynthesis.speak(utterance)
        }
    }

    // Show loading while checking auth or hydrating
    if (!isHydrated || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-800">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-2xl">🌾</span>
                    </div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <p className="text-gray-600 dark:text-gray-400">
                        {!isHydrated ? 'Initializing...' : 'Loading KrishiMitra...'}
                    </p>
                </div>
            </div>
        )
    }

    return (
        <main className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50 dark:from-gray-900 dark:via-slate-800 dark:to-gray-800 p-4 sm:p-6 transition-all duration-300">
            {/* Header */}
            <div className="max-w-6xl mx-auto mb-6">
                {/* App Header with Logo */}
                <div className="flex justify-between items-center mb-6">
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-xl">🌾</span>
                        </div>
                        <div>
                            <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">KrishiMitra</h1>
                            <p className="text-sm text-gray-600 dark:text-gray-400">AI-powered farming guidance for better yields</p>
                        </div>
                    </div>

                    {/* Header Controls */}

                    {/* Header Controls */}
                    <div className="flex items-center gap-2">
                        {/* Language Selector */}
                        <div className="relative">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setLanguageMenuOpen(!languageMenuOpen)}
                                className="flex items-center gap-2 px-3"
                            >
                                <Globe className="w-4 h-4" />
                                <span className="text-sm">
                                    {language === 'hi' ? 'हिंदी' :
                                        language === 'ta' ? 'தமிழ்' :
                                            language === 'te' ? 'తెలుగు' :
                                                language === 'bn' ? 'বাংলা' :
                                                    language === 'gu' ? 'ગુજરાતી' :
                                                        language === 'mr' ? 'मराठी' :
                                                            language === 'pa' ? 'ਪੰਜਾਬੀ' : 'English'}
                                </span>
                                <ChevronDown className="w-3 h-3" />
                            </Button>
                            {languageMenuOpen && (
                                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg py-1 z-50 min-w-[160px]">
                                    <button onClick={() => { setLanguage('en'); setLanguageMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                        🇺🇸 English
                                    </button>
                                    <button onClick={() => { setLanguage('hi'); setLanguageMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                        🇮🇳 हिंदी
                                    </button>
                                    <button onClick={() => { setLanguage('ta'); setLanguageMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                        🇮🇳 தமிழ்
                                    </button>
                                    <button onClick={() => { setLanguage('te'); setLanguageMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                        🇮🇳 తెలుగు
                                    </button>
                                    <button onClick={() => { setLanguage('bn'); setLanguageMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                        🇧🇩 বাংলা
                                    </button>
                                    <button onClick={() => { setLanguage('gu'); setLanguageMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                        🇮🇳 ગુજરાતી
                                    </button>
                                    <button onClick={() => { setLanguage('mr'); setLanguageMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                        🇮🇳 मराठी
                                    </button>
                                    <button onClick={() => { setLanguage('pa'); setLanguageMenuOpen(false); }} className="w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
                                        🇮🇳 ਪੰਜਾਬੀ
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* User Info and Logout */}
                        {userData && (
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-1 text-sm text-gray-600 dark:text-gray-400">
                                    <User className="w-4 h-4" />
                                    <span>{userData.name}</span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="p-2"
                                    title="Logout"
                                >
                                    <LogOut className="w-4 h-4 text-red-600" />
                                </Button>
                            </div>
                        )}

                        {/* Voice Control Toggle */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleVoice}
                            className="p-2"
                            title={voiceEnabled ? 'Disable Voice Output' : 'Enable Voice Output'}
                        >
                            {voiceEnabled ? <Volume2 className="w-4 h-4 text-green-600" /> : <VolumeX className="w-4 h-4" />}
                        </Button>

                        {/* Dark Mode Toggle */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={toggleDarkMode}
                            className="p-2"
                            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                        >
                            {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                        </Button>

                        {/* Online Status */}
                        <div className="flex items-center gap-1">
                            {isOnline ? (
                                <div className="flex items-center gap-1 text-green-600">
                                    <Wifi className="w-4 h-4" />
                                    <span className="text-xs font-medium">Online</span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1 text-red-600">
                                    <WifiOff className="w-4 h-4" />
                                    <span className="text-xs font-medium">{t('offlineMode')}</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Welcome Section */}
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-2">
                        {t('welcomeFarmer')}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                        {t('appSubtitle')}
                    </p>
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
                    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('weather')}>
                        <div className="flex items-center gap-2">
                            <Sun className="w-5 h-5 text-yellow-600" />
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{t('todayWeather')}</div>
                                <div className="font-semibold">
                                    {weatherLoading ? (
                                        <span className="text-gray-500">Loading...</span>
                                    ) : currentWeather ? (
                                        <div className="flex items-center gap-1">
                                            <span>{formatTemperature(currentWeather.main.temp)}</span>
                                            <span className="text-xs text-gray-500 capitalize">
                                                {currentWeather.weather[0]?.description || ''}
                                            </span>
                                        </div>
                                    ) : (
                                        <span className="text-gray-500">--°C</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>



                    <Card className="p-4">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-600" />
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{t('wheatPrice')}</div>
                                <div className="font-semibold">₹2,150</div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => setActiveTab('weather')}>
                        <div className="flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            <div>
                                <div className="text-sm text-gray-600 dark:text-gray-400">{t('alerts')}</div>
                                <div className="font-semibold">
                                    {weatherLoading ? (
                                        <span className="text-gray-500">Loading...</span>
                                    ) : currentWeather ? (
                                        <>
                                            {getWeatherAlerts(currentWeather, language).length > 0 ? (
                                                <div className="flex flex-col">
                                                    {getWeatherAlerts(currentWeather, language).slice(0, 2).map((alert: string, index: number) => (
                                                        <span key={index} className="text-orange-600">{alert}</span>
                                                    ))}
                                                    {getWeatherAlerts(currentWeather, language).length > 2 && (
                                                        <span className="text-orange-600">+{getWeatherAlerts(currentWeather, language).length - 2} more</span>
                                                    )}
                                                </div>
                                            ) : (
                                                <span className="text-green-600">{t('noAlertsForLocation')}</span>
                                            )}
                                        </>
                                    ) : (
                                        <span className="text-gray-500">{t('noAlertsForLocation')}</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-6xl mx-auto">
                <Tabs value={activeTab} onValueChange={(value: string) => {
                    setIsTabLoading(true);
                    setActiveTab(value);
                    // Simulate tab loading
                    setTimeout(() => setIsTabLoading(false), 500);
                }} className="w-full">
                    <TabsList className="grid w-full grid-cols-4 sm:grid-cols-8 mb-6">
                        <TabsTrigger value="dashboard" className="flex items-center gap-2 text-xs sm:text-sm">
                            <Sprout className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('dashboard')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="chat" className="flex items-center gap-2 text-xs sm:text-sm">
                            <MessageSquare className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('advisor')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="weather" className="flex items-center gap-2 text-xs sm:text-sm">
                            <CloudSun className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('weather')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="soil" className="flex items-center gap-2 text-xs sm:text-sm">
                            <Leaf className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('soil')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="pest" className="flex items-center gap-2 text-xs sm:text-sm">
                            <Bug className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('pest')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="market" className="flex items-center gap-2 text-xs sm:text-sm">
                            <TrendingUp className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('market')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="cost" className="flex items-center gap-2 text-xs sm:text-sm">
                            <Calculator className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('costBenefit')}</span>
                        </TabsTrigger>
                        <TabsTrigger value="feedback" className="flex items-center gap-2 text-xs sm:text-sm">
                            <MessageCircle className="w-4 h-4" />
                            <span className="hidden sm:inline">{t('feedback')}</span>
                        </TabsTrigger>

                    </TabsList>

                    <TabsContent value="dashboard">
                        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-blue-500" onClick={() => setActiveTab('chat')}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <MessageSquare className="w-5 h-5 text-blue-600" />
                                        {t('aiAdvisor')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('aiAdvisorDesc')}</p>
                                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                                        {t('askAnything')}
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-yellow-500" onClick={() => setActiveTab('weather')}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <CloudSun className="w-5 h-5 text-yellow-600" />
                                        {t('weatherAlerts')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('weatherAlertsDesc')}</p>
                                    <Button size="sm" variant="outline" className="border-yellow-500 text-yellow-600">
                                        {t('realTimeData')}
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-green-500" onClick={() => setActiveTab('soil')}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Leaf className="w-5 h-5 text-green-600" />
                                        {t('soilFertilizer')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('soilFertilizerDesc')}</p>
                                    <Button size="sm" variant="outline" className="border-green-500 text-green-600">
                                        {t('getRecommendations')}
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-red-500" onClick={() => setActiveTab('pest')}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Bug className="w-5 h-5 text-red-600" />
                                        {t('pestDetection')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('pestDetectionDesc')}</p>
                                    <Button size="sm" className="bg-red-600 hover:bg-red-700 text-white">
                                        {t('uploadPhoto')}
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-purple-500" onClick={() => setActiveTab('market')}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <TrendingUp className="w-5 h-5 text-purple-600" />
                                        {t('marketPrices')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('marketPricesDesc')}</p>
                                    <Button size="sm" variant="outline" className="border-purple-500 text-purple-600">
                                        {t('liveRates')}
                                    </Button>
                                </CardContent>
                            </Card>

                            <Card className="cursor-pointer hover:shadow-lg transition-shadow border-l-4 border-indigo-500" onClick={() => setActiveTab('cost')}>
                                <CardHeader className="pb-3">
                                    <CardTitle className="flex items-center gap-2 text-lg">
                                        <Calculator className="w-5 h-5 text-indigo-600" />
                                        {t('costBenefit')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{t('profitCalculator')}</p>
                                    <Button size="sm" variant="outline" className="border-indigo-500 text-indigo-600">
                                        {t('profitCalculator')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </TabsContent>

                    <TabsContent value="chat">
                        {isTabLoading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                            </div>
                        ) : (
                            <EnhancedChatBot voiceEnabled={voiceEnabled} onSpeak={speak} />
                        )}
                    </TabsContent>

                    <TabsContent value="weather">
                        <WeatherDashboard voiceEnabled={voiceEnabled} onSpeak={speak} />
                    </TabsContent>

                    <TabsContent value="soil">
                        <SoilGuide voiceEnabled={voiceEnabled} onSpeak={speak} />
                    </TabsContent>

                    <TabsContent value="pest">
                        <EnhancedPestDetection voiceEnabled={voiceEnabled} onSpeak={speak} />
                    </TabsContent>

                    <TabsContent value="market">
                        <EnhancedMarketPrices voiceEnabled={voiceEnabled} onSpeak={speak} />
                    </TabsContent>

                    <TabsContent value="cost">
                        <CostBenefitAnalysis voiceEnabled={voiceEnabled} onSpeak={speak} />
                    </TabsContent>

                    <TabsContent value="feedback">
                        <AdvisoryFeedback voiceEnabled={voiceEnabled} onSpeak={speak} />
                    </TabsContent>


                </Tabs>
            </div>

            {/* Footer */}
            <div className="max-w-6xl mx-auto mt-12 pt-6 border-t border-gray-200 dark:border-gray-700 transition-colors-smooth">
                <div className="text-center text-sm text-gray-500 dark:text-gray-400">
                    <p className="mb-2">{t('footerText')}</p>
                    <div className="flex justify-center items-center gap-4 text-xs">
                        <span>{t('supportedLanguages')}: English, हिंदी, தமிழ், తెలుగు, বাংলা, ગુજરાતી, मराठी, ਪੰਜਾਬੀ</span>
                        <Separator orientation="vertical" className="h-4" />
                        <span>Status: {isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                </div>
            </div>
        </main>
    )
}

export default function Page() {
    return (
        <ClientOnly fallback={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-blue-50 to-yellow-50">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-700 rounded-xl flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-2xl">🌾</span>
                    </div>
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    <p className="text-gray-600">Initializing KrishiMitra...</p>
                </div>
            </div>
        }>
            <LanguageProvider>
                <App />
            </LanguageProvider>
        </ClientOnly>
    )
}