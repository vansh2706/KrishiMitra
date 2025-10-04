'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'
import { Button } from './ui/button'
import { Textarea } from './ui/textarea'
import { Label } from './ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select'
import { Badge } from './ui/badge'
import { Alert, AlertDescription } from './ui/alert'
import {
    MessageCircle,
    Star,
    ThumbsUp,
    ThumbsDown,
    CheckCircle,
    TrendingUp,
    Users,
    MessageSquare,
    BarChart3,
    AlertTriangle,
    Copy,
    Share2,
    Send
} from 'lucide-react'
import { useLanguage } from '../hooks/useLanguage'
import { addOfflineFeedback, getOfflineData } from '../lib/offlineStorage'
import { copyToClipboard } from '../utils/copyUtils'

interface AdvisoryFeedbackProps {
    voiceEnabled: boolean
    onSpeak: (text: string) => void
}

interface FeedbackSummary {
    averageRating: number
    totalFeedbacks: number
    categoryBreakdown: Record<string, number>
    recentFeedbacks: Array<{
        id: string
        rating: number
        message: string
        category: string
        timestamp: Date
    }>
}

export function AdvisoryFeedback({ voiceEnabled, onSpeak }: AdvisoryFeedbackProps) {
    const { t, language, isOnline } = useLanguage()
    const [rating, setRating] = useState(0)
    const [message, setMessage] = useState('')
    const [category, setCategory] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [submitted, setSubmitted] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [feedbackSummary, setFeedbackSummary] = useState<FeedbackSummary | null>(null)

    const categories = [
        {
            id: 'crop_advice',
            label: language === 'hi' ? 'फसल सलाह' : 'Crop Advice',
            icon: '🌾'
        },
        {
            id: 'pest_detection',
            label: language === 'hi' ? 'कीट पहचान' : 'Pest Detection',
            icon: '🐛'
        },
        {
            id: 'weather_alerts',
            label: language === 'hi' ? 'मौसम चेतावनी' : 'Weather Alerts',
            icon: '🌦️'
        },
        {
            id: 'market_prices',
            label: language === 'hi' ? 'बाजार भाव' : 'Market Prices',
            icon: '💰'
        },
        {
            id: 'cost_analysis',
            label: language === 'hi' ? 'लागत विश्लेषण' : 'Cost Analysis',
            icon: '📊'
        },
        {
            id: 'app_usage',
            label: language === 'hi' ? 'ऐप उपयोग' : 'App Usage',
            icon: '📱'
        },
        {
            id: 'other',
            label: language === 'hi' ? 'अन्य' : 'Other',
            icon: '💭'
        }
    ]

    // Load feedback summary on component mount
    useEffect(() => {
        loadFeedbackSummary()
    }, [])

    const loadFeedbackSummary = () => {
        const offlineData = getOfflineData()
        const feedbacks = offlineData.feedbacks

        if (feedbacks.length === 0) {
            setFeedbackSummary({
                averageRating: 0,
                totalFeedbacks: 0,
                categoryBreakdown: {},
                recentFeedbacks: []
            })
            return
        }

        const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0)
        const averageRating = totalRating / feedbacks.length

        const categoryBreakdown = feedbacks.reduce((acc, feedback) => {
            acc[feedback.category] = (acc[feedback.category] || 0) + 1
            return acc
        }, {} as Record<string, number>)

        const recentFeedbacks = feedbacks
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
            .slice(0, 5)

        setFeedbackSummary({
            averageRating,
            totalFeedbacks: feedbacks.length,
            categoryBreakdown,
            recentFeedbacks
        })
    }

    const validateFeedback = () => {
        if (!rating) {
            return language === 'hi' ? 'कृपया रेटिंग दें' : 'Please provide a rating'
        }
        if (!category) {
            return language === 'hi' ? 'कृपया श्रेणी चुनें' : 'Please select a category'
        }
        if (!message.trim()) {
            return language === 'hi' ? 'कृपया फीडबैक संदेश लिखें' : 'Please write a feedback message'
        }
        if (message.trim().length < 10) {
            return language === 'hi' ? 'फीडबैक कम से कम 10 अक्षर का होना चाहिए' : 'Feedback should be at least 10 characters'
        }
        return null
    }

    const submitFeedback = async () => {
        const validationError = validateFeedback()
        if (validationError) {
            setError(validationError)
            return
        }

        setError(null)
        setIsSubmitting(true)

        try {
            // Generate feedback ID
            const feedbackId = `feedback_${Date.now()}_${Math.random().toString(36).substring(2)}`

            // Save feedback offline
            const feedbackData = {
                id: feedbackId,
                rating,
                message: message.trim(),
                category,
                timestamp: new Date()
            }

            addOfflineFeedback(feedbackData)

            // If online, could potentially sync to server here
            if (isOnline) {
                // Simulated API call
                await new Promise(resolve => setTimeout(resolve, 1000))
            }

            setSubmitted(true)
            setRating(0)
            setMessage('')
            setCategory('')

            // Reload summary
            loadFeedbackSummary()

            // Voice feedback
            if (voiceEnabled) {
                const thankYouMessage = language === 'hi'
                    ? 'आपके फीडबैक के लिए धन्यवाद। यह हमारे लिए बहुत महत्वपूर्ण है।'
                    : 'Thank you for your feedback. This is very valuable to us.'
                onSpeak(thankYouMessage)
            }

            // Reset submitted state after 3 seconds
            setTimeout(() => setSubmitted(false), 3000)

        } catch (error) {
            console.error('Error submitting feedback:', error)
            setError(language === 'hi'
                ? 'फीडबैक सबमिट करने में त्रुटि हुई। कृपया दोबारा कोशिश करें।'
                : 'Error submitting feedback. Please try again.'
            )
        }

        setIsSubmitting(false)
    }

    const StarRating = ({ rating, onRatingChange, readonly = false }: { rating: number, onRatingChange?: (rating: number) => void, readonly?: boolean }) => {
        return (
            <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-6 h-6 transition-colors ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'
                            } ${star <= rating ? 'text-yellow-500 fill-current' : 'text-gray-300 hover:text-yellow-400'
                            }`}
                        onClick={() => !readonly && onRatingChange && onRatingChange(star)}
                    />
                ))}
            </div>
        )
    }

    const getCategoryIcon = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId)
        return category?.icon || '💭'
    }

    const getCategoryLabel = (categoryId: string) => {
        const category = categories.find(cat => cat.id === categoryId)
        return category?.label || categoryId
    }

    return (
        <div className="max-w-6xl mx-auto space-y-6 p-4">
            {/* Feedback Form */}
            <Card className="shadow-sm border-gray-200">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-green-50">
                    <CardTitle className="flex items-center gap-2 text-gray-800">
                        <MessageCircle className="w-6 h-6 text-blue-600" />
                        {t('advisoryFeedback')}
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                    {submitted && (
                        <Alert className="border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800 transition-all duration-300">
                            <CheckCircle className="w-4 h-4 text-green-600 dark:text-green-400" />
                            <AlertDescription className="text-green-800 dark:text-green-300">
                                {language === 'hi'
                                    ? 'आपका फीडबैक सफलतापूर्वक सबमिट हो गया। धन्यवाद!'
                                    : 'Your feedback has been successfully submitted. Thank you!'}
                            </AlertDescription>
                        </Alert>
                    )}

                    {!isOnline && (
                        <Alert className="border-orange-200 bg-orange-50 dark:bg-orange-900/20 dark:border-orange-800 transition-all duration-300">
                            <MessageSquare className="w-4 h-4 text-orange-600 dark:text-orange-400" />
                            <AlertDescription className="text-orange-800 dark:text-orange-300">
                                {language === 'hi'
                                    ? 'आप ऑफलाइन हैं। आपका फीडबैक स्थानीय रूप से सहेजा जाएगा और इंटरनेट वापस आने पर भेजा जाएगा।'
                                    : 'You are offline. Your feedback will be saved locally and synced when internet returns.'}
                            </AlertDescription>
                        </Alert>
                    )}

                    {/* Rating */}
                    <div className="space-y-3">
                        <Label className="text-sm font-medium text-gray-700">
                            {language === 'hi' ? 'कृषिमित्र को रेटिंग दें' : 'Rate KrishiMitra'}
                        </Label>
                        <div className="flex items-center gap-4">
                            <StarRating rating={rating} onRatingChange={setRating} />
                            <span className="text-sm text-gray-600">
                                {rating > 0 && (
                                    language === 'hi'
                                        ? `${rating}/5 सितारे`
                                        : `${rating}/5 stars`
                                )}
                            </span>
                        </div>
                    </div>

                    {/* Category Selection */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            {language === 'hi' ? 'फीडबैक श्रेणी' : 'Feedback Category'}
                        </Label>
                        <Select value={category} onValueChange={setCategory}>
                            <SelectTrigger className="w-full">
                                <SelectValue placeholder={language === 'hi' ? 'श्रेणी चुनें' : 'Select Category'} />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id}>
                                        <div className="flex items-center gap-2">
                                            <span>{cat.icon}</span>
                                            <span>{cat.label}</span>
                                        </div>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Feedback Message */}
                    <div className="space-y-2">
                        <Label className="text-sm font-medium text-gray-700">
                            {language === 'hi' ? 'आपका फीडबैक' : 'Your Feedback'}
                        </Label>
                        <Textarea
                            placeholder={language === 'hi'
                                ? 'कृपया अपना अनुभव साझा करें। आपके सुझाव हमारे लिए महत्वपूर्ण हैं।'
                                : 'Please share your experience. Your suggestions are valuable to us.'
                            }
                            value={message}
                            onChange={(e) => {
                                setMessage(e.target.value)
                                if (error) setError(null) // Clear error when user starts typing
                            }}
                            rows={4}
                            className="resize-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                        />
                        <div className="text-xs text-gray-500">
                            {message.length}/500 {language === 'hi' ? 'अक्षर' : 'characters'}
                        </div>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <Alert className="border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 transition-all duration-300">
                            <AlertTriangle className="w-4 h-4 text-red-600 dark:text-red-400" />
                            <AlertDescription className="text-red-800 dark:text-red-300">{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Submit Button */}
                    <Button
                        onClick={submitFeedback}
                        disabled={!rating || !message.trim() || !category || isSubmitting}
                        className="w-full md:w-auto transition-all duration-200 hover:opacity-90 disabled:opacity-50"
                    >
                        {isSubmitting ? (
                            <>
                                <MessageSquare className="w-4 h-4 mr-2 animate-pulse" />
                                {language === 'hi' ? 'सबमिट कर रहे हैं...' : 'Submitting...'}
                            </>
                        ) : (
                            <>
                                <Send className="w-4 h-4 mr-2" />
                                {t('submitFeedback')}
                            </>
                        )}
                    </Button>
                </CardContent>
            </Card>

            {/* Feedback Summary */}
            {feedbackSummary && feedbackSummary.totalFeedbacks > 0 && (
                <>
                    {/* Summary Stats */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-yellow-100 rounded-full">
                                        <Star className="w-5 h-5 text-yellow-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">
                                            {language === 'hi' ? 'औसत रेटिंग' : 'Average Rating'}
                                        </div>
                                        <div className="text-2xl font-bold text-gray-800">
                                            {feedbackSummary.averageRating.toFixed(1)}/5
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-blue-100 rounded-full">
                                        <Users className="w-5 h-5 text-blue-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">
                                            {language === 'hi' ? 'कुल फीडबैक' : 'Total Feedbacks'}
                                        </div>
                                        <div className="text-2xl font-bold text-gray-800">
                                            {feedbackSummary.totalFeedbacks}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-green-100 rounded-full">
                                        <ThumbsUp className="w-5 h-5 text-green-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">
                                            {language === 'hi' ? 'सकारात्मक' : 'Positive'}
                                        </div>
                                        <div className="text-2xl font-bold text-gray-800">
                                            {Math.round((feedbackSummary.averageRating / 5) * 100)}%
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="hover:shadow-md transition-shadow duration-200">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="p-2 bg-purple-100 rounded-full">
                                        <BarChart3 className="w-5 h-5 text-purple-600" />
                                    </div>
                                    <div>
                                        <div className="text-sm text-gray-600">
                                            {language === 'hi' ? 'श्रेणियां' : 'Categories'}
                                        </div>
                                        <div className="text-2xl font-bold text-gray-800">
                                            {Object.keys(feedbackSummary.categoryBreakdown).length}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Category Breakdown */}
                    <Card className="shadow-sm">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-gray-800">
                                <BarChart3 className="w-5 h-5 text-blue-600" />
                                {language === 'hi' ? 'श्रेणी वार फीडबैक' : 'Category-wise Feedback'}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
                                {Object.entries(feedbackSummary.categoryBreakdown).map(([categoryId, count]) => (
                                    <div key={categoryId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{getCategoryIcon(categoryId)}</span>
                                            <span className="text-sm font-medium text-gray-700">{getCategoryLabel(categoryId)}</span>
                                        </div>
                                        <Badge variant="outline" className="bg-white">{count}</Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Feedbacks */}
                    {feedbackSummary.recentFeedbacks.length > 0 && (
                        <Card className="shadow-sm">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2 text-gray-800">
                                    <MessageSquare className="w-5 h-5 text-green-600" />
                                    {language === 'hi' ? 'हाल का फीडबैक' : 'Recent Feedback'}
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {feedbackSummary.recentFeedbacks.map((feedback) => (
                                        <div key={feedback.id} className="border-l-4 border-blue-200 pl-4 py-3 bg-gray-50 rounded-r-lg hover:bg-gray-100 transition-colors duration-200">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-3">
                                                    <StarRating rating={feedback.rating} readonly />
                                                    <Badge variant="outline" className="text-xs bg-white">
                                                        <span className="mr-1">{getCategoryIcon(feedback.category)}</span>
                                                        {getCategoryLabel(feedback.category)}
                                                    </Badge>
                                                </div>
                                                <span className="text-xs text-gray-500">
                                                    {new Date(feedback.timestamp).toLocaleDateString(
                                                        language === 'hi' ? 'hi-IN' : 'en-IN',
                                                        {
                                                            year: 'numeric',
                                                            month: 'short',
                                                            day: 'numeric'
                                                        }
                                                    )}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {feedback.message}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </>
            )}

            {/* How Feedback Helps */}
            <Card className="bg-gradient-to-r from-blue-50 to-green-50 border-blue-200 shadow-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-blue-800">
                        <TrendingUp className="w-5 h-5" />
                        {language === 'hi' ? 'आपका फीडबैक कैसे मदद करता है' : 'How Your Feedback Helps'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid gap-6 md:grid-cols-2">
                        <div className="space-y-3">
                            <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                                <span>📱</span>
                                {language === 'hi' ? 'ऐप सुधार:' : 'App Improvement:'}
                            </h4>
                            <ul className="text-sm space-y-2 text-blue-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    {language === 'hi' ? 'बेहतर फीचर्स जोड़ना' : 'Adding better features'}
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    {language === 'hi' ? 'तकनीकी समस्याओं को ठीक करना' : 'Fixing technical issues'}
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    {language === 'hi' ? 'उपयोगकर्ता अनुभव बेहतर बनाना' : 'Improving user experience'}
                                </li>
                            </ul>
                        </div>
                        <div className="space-y-3">
                            <h4 className="font-semibold text-blue-800 flex items-center gap-2">
                                <span>🌾</span>
                                {language === 'hi' ? 'कृषि सेवाएं:' : 'Agricultural Services:'}
                            </h4>
                            <ul className="text-sm space-y-2 text-blue-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    {language === 'hi' ? 'अधिक सटीक सलाह' : 'More accurate advice'}
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    {language === 'hi' ? 'नई फसलों की जानकारी' : 'Information about new crops'}
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-green-600 mt-1">•</span>
                                    {language === 'hi' ? 'स्थानीय समस्याओं का समाधान' : 'Solutions for local problems'}
                                </li>
                            </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}