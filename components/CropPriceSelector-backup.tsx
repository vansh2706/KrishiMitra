'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TrendingUp, RefreshCw, Copy, Share2 } from 'lucide-react'
import { useLanguage } from '@/hooks/useLanguage'
import { copyToClipboard } from '@/utils/copyUtils'

interface CropPriceSelectorProps {
    voiceEnabled: boolean
    onSpeak: (text: string) => void
}

interface CropPrice {
    crop: string
    price: number
    change: number
    changePercent: number
    lastUpdated: string
}

const availableCrops = [
    { id: 'wheat', name: 'गेहूं', emoji: '🌾', color: 'bg-yellow-100 text-yellow-800' },
    { id: 'rice', name: 'चावल', emoji: '🌾', color: 'bg-green-100 text-green-800' },
    { id: 'cotton', name: 'कपास', emoji: '🌿', color: 'bg-blue-100 text-blue-800' },
    { id: 'sugarcane', name: 'गन्ना', emoji: '🌱', color: 'bg-purple-100 text-purple-800' },
    { id: 'maize', name: 'मक्का', emoji: '🌽', color: 'bg-orange-100 text-orange-800' },
    { id: 'soybean', name: 'सोयाबीन', emoji: '🫘', color: 'bg-indigo-100 text-indigo-800' },
    { id: 'tomato', name: 'टमाटर', emoji: '🍅', color: 'bg-red-100 text-red-800' },
    { id: 'onion', name: 'प्याज', emoji: '🧅', color: 'bg-pink-100 text-pink-800' }
]

export function CropPriceSelector({ voiceEnabled, onSpeak }: CropPriceSelectorProps) {
    const { t, language } = useLanguage()
    const [selectedCrop, setSelectedCrop] = useState('wheat')
    const [isLoading, setIsLoading] = useState(false)
    const [cropPrices, setCropPrices] = useState<Record<string, CropPrice>>({
        wheat: {
            crop: 'गेहूं',
            price: 2150,
            change: 25,
            changePercent: 1.2,
            lastUpdated: new Date().toLocaleTimeString()
        },
        rice: {
            crop: 'चावल',
            price: 3200,
            change: -15,
            changePercent: -0.5,
            lastUpdated: new Date().toLocaleTimeString()
        },
        cotton: {
            crop: 'कपास',
            price: 5800,
            change: 120,
            changePercent: 2.1,
            lastUpdated: new Date().toLocaleTimeString()
        },
        sugarcane: {
            crop: 'गन्ना',
            price: 280,
            change: 5,
            changePercent: 1.8,
            lastUpdated: new Date().toLocaleTimeString()
        },
        maize: {
            crop: 'मक्का',
            price: 1800,
            change: -30,
            changePercent: -1.6,
            lastUpdated: new Date().toLocaleTimeString()
        },
        soybean: {
            crop: 'सोयाबीन',
            price: 4200,
            change: 80,
            changePercent: 1.9,
            lastUpdated: new Date().toLocaleTimeString()
        },
        tomato: {
            crop: 'टमाटर',
            price: 1200,
            change: -50,
            changePercent: -4.0,
            lastUpdated: new Date().toLocaleTimeString()
        },
        onion: {
            crop: 'प्याज',
            price: 1800,
            change: 100,
            changePercent: 5.9,
            lastUpdated: new Date().toLocaleTimeString()
        }
    })

    const currentPrice = cropPrices[selectedCrop]

    const handleRefreshPrices = async () => {
        setIsLoading(true)
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))

        // Update prices with some random changes
        const updatedPrices = { ...cropPrices }
        Object.keys(updatedPrices).forEach(cropId => {
            const price = updatedPrices[cropId]
            const change = (Math.random() - 0.5) * 100
            price.change = change
            price.changePercent = (change / price.price) * 100
            price.lastUpdated = new Date().toLocaleTimeString()
        })

        setCropPrices(updatedPrices)
        setIsLoading(false)

        if (voiceEnabled) {
            const message = language === 'hi'
                ? `मूल्य अपडेट हो गए हैं। ${currentPrice.crop} का वर्तमान मूल्य ₹${currentPrice.price} प्रति क्विंटल है।`
                : `Prices have been updated. Current ${currentPrice.crop} price is ₹${currentPrice.price} per quintal.`
            onSpeak(message)
        }
    }

    const handleCopyPrice = async () => {
        const priceText = `${currentPrice.crop} - ₹${currentPrice.price}/क्विंटल\n${currentPrice.change >= 0 ? '↗️' : '↘️'} ₹${Math.abs(currentPrice.change)} (${currentPrice.changePercent.toFixed(1)}%)\nअंतिम अपडेट: ${currentPrice.lastUpdated}`
        await copyToClipboard(priceText)
    }

    const handleSharePrice = async () => {
        const shareText = `${currentPrice.crop} का वर्तमान बाजार मूल्य:\n\n₹${currentPrice.price} प्रति क्विंटल\n${currentPrice.change >= 0 ? '↗️' : '↘️'} ₹${Math.abs(currentPrice.change)} (${currentPrice.changePercent.toFixed(1)}%)\n\nकृषिमित्र से प्राप्त`
        await copyToClipboard(shareText)
    }

    return (
        <Card className="p-4">
            <div className="space-y-4">
                {/* Crop Selection Circle */}
                <div className="flex flex-wrap justify-center gap-2">
                    {availableCrops.map((crop) => (
                        <Button
                            key={crop.id}
                            variant={selectedCrop === crop.id ? "default" : "outline"}
                            size="sm"
                            onClick={() => setSelectedCrop(crop.id)}
                            className={`rounded-full px-3 py-1 ${selectedCrop === crop.id ? 'bg-green-600 text-white' : crop.color}`}
                        >
                            <span className="mr-1">{crop.emoji}</span>
                            {crop.name}
                        </Button>
                    ))}
                </div>

                {/* Price Display */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-2">
                        <TrendingUp className="w-5 h-5 text-green-600" />
                        <div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {language === 'hi' ? 'वर्तमान मूल्य' : 'Current Price'}
                            </div>
                            <div className="text-2xl font-bold text-green-600">
                                ₹{currentPrice.price.toLocaleString()}
                            </div>
                        </div>
                    </div>

                    {/* Price Change */}
                    <div className="flex items-center justify-center gap-2">
                        <Badge variant={currentPrice.change >= 0 ? "default" : "destructive"} className="text-xs">
                            {currentPrice.change >= 0 ? '↗️' : '↘️'} ₹{Math.abs(currentPrice.change)} ({currentPrice.changePercent.toFixed(1)}%)
                        </Badge>
                        <span className="text-xs text-gray-500">
                            {language === 'hi' ? 'प्रति क्विंटल' : 'per quintal'}
                        </span>
                    </div>

                    {/* Last Updated */}
                    <div className="text-xs text-gray-500">
                        {language === 'hi' ? 'अंतिम अपडेट' : 'Last updated'}: {currentPrice.lastUpdated}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-center gap-2">
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleRefreshPrices}
                        disabled={isLoading}
                        className="flex items-center gap-1"
                    >
                        <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                        {language === 'hi' ? 'रिफ्रेश' : 'Refresh'}
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopyPrice}
                        className="flex items-center gap-1"
                    >
                        <Copy className="w-3 h-3" />
                        {language === 'hi' ? 'कॉपी' : 'Copy'}
                    </Button>

                    <Button
                        size="sm"
                        variant="outline"
                        onClick={handleSharePrice}
                        className="flex items-center gap-1"
                    >
                        <Share2 className="w-3 h-3" />
                        {language === 'hi' ? 'शेयर' : 'Share'}
                    </Button>
                </div>
            </div>
        </Card>
    )
}
