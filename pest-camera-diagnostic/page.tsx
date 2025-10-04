'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, X, CheckCircle, AlertTriangle, Wifi, WifiOff } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PestCameraDiagnostic() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [cameraActive, setCameraActive] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [diagnostics, setDiagnostics] = useState({
        secureContext: false,
        mediaDevicesSupported: false,
        cameraPermission: 'unknown' as 'granted' | 'denied' | 'prompt' | 'unknown',
        cameraAvailable: false,
        browserSupported: false
    })
    const [loading, setLoading] = useState(false)

    // Run diagnostics on component mount
    useEffect(() => {
        runDiagnostics()
    }, [])

    const runDiagnostics = () => {
        const newDiagnostics = {
            secureContext: window.isSecureContext,
            mediaDevicesSupported: !!(navigator.mediaDevices && navigator.mediaDevices.getUserMedia),
            cameraPermission: 'unknown' as 'granted' | 'denied' | 'prompt' | 'unknown',
            cameraAvailable: false,
            browserSupported: /Chrome|Firefox|Safari|Edge/i.test(navigator.userAgent)
        }

        // Check for existing permissions (if supported by browser)
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'camera' as PermissionName })
                .then(permissionStatus => {
                    newDiagnostics.cameraPermission = permissionStatus.state as 'granted' | 'denied' | 'prompt'
                    setDiagnostics({ ...newDiagnostics })
                })
                .catch(() => {
                    // Permission API not supported, continue without it
                    setDiagnostics({ ...newDiagnostics })
                })
        } else {
            setDiagnostics({ ...newDiagnostics })
        }

        setDiagnostics({ ...newDiagnostics })
    }

    const startCamera = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Check diagnostics first
            if (!window.isSecureContext) {
                throw new Error('Camera requires HTTPS or localhost. Current context is not secure.')
            }

            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera API not supported in your browser. Try Chrome, Firefox, or Edge.')
            }

            // Try to access camera with different constraints
            let stream: MediaStream
            
            try {
                // Try environment camera first (rear camera on mobile)
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: 'environment' }
                })
            } catch (primaryError) {
                console.warn('Environment camera failed, trying user camera:', primaryError)
                try {
                    // Fallback to user camera (front camera)
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { facingMode: 'user' }
                    })
                } catch (fallbackError) {
                    console.warn('User camera failed, trying any camera:', fallbackError)
                    // Last resort - try any camera
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true
                    })
                }
            }
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setCameraActive(true)
                
                // Update diagnostics
                setDiagnostics(prev => ({
                    ...prev,
                    cameraAvailable: true,
                    cameraPermission: 'granted'
                }))
            }
        } catch (error: any) {
            console.error('Camera access failed:', error)
            
            // Update diagnostics based on error
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                setDiagnostics(prev => ({
                    ...prev,
                    cameraPermission: 'denied'
                }))
            }
            
            setError(error.message || 'Failed to access camera. Please check permissions and try again.')
            setCameraActive(false)
        } finally {
            setLoading(false)
        }
    }

    const stopCamera = () => {
        if (videoRef.current?.srcObject) {
            const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
            tracks.forEach(track => track.stop())
            videoRef.current.srcObject = null
        }
        setCameraActive(false)
    }

    const capturePhoto = () => {
        if (!videoRef.current) {
            alert('Video is not ready yet.')
            return
        }

        const canvas = document.createElement('canvas')
        const context = canvas.getContext('2d')
        
        if (!context) {
            alert('Unable to create canvas context.')
            return
        }
        
        // Set canvas dimensions to match video
        canvas.width = videoRef.current.videoWidth || videoRef.current.offsetWidth || 640
        canvas.height = videoRef.current.videoHeight || videoRef.current.offsetHeight || 480
        
        // Draw the current video frame to the canvas
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
        
        // Convert to data URL and download
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92)
        
        // Create download link
        const link = document.createElement('a')
        link.download = 'pest-photo.jpg'
        link.href = dataUrl
        link.click()
        
        alert('Photo captured and downloaded!')
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-2 text-center">Pest Detection Camera Diagnostic</h1>
                <p className="text-gray-600 mb-8 text-center">
                    Diagnose and fix camera issues for pest detection functionality
                </p>
                
                {/* Diagnostics Card */}
                <Card className="mb-8">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <CheckCircle className="h-5 w-5" />
                            Camera Diagnostics
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${diagnostics.secureContext ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                {diagnostics.secureContext ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-red-600" />}
                                <div>
                                    <p className="font-medium">Secure Context</p>
                                    <p className="text-sm text-gray-600">
                                        {diagnostics.secureContext ? 'HTTPS/localhost available' : 'HTTPS/localhost required'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${diagnostics.mediaDevicesSupported ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                                {diagnostics.mediaDevicesSupported ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-red-600" />}
                                <div>
                                    <p className="font-medium">Media Devices API</p>
                                    <p className="text-sm text-gray-600">
                                        {diagnostics.mediaDevicesSupported ? 'Supported' : 'Not supported'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${diagnostics.cameraPermission === 'granted' ? 'bg-green-50 border border-green-200' : diagnostics.cameraPermission === 'denied' ? 'bg-red-50 border border-red-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                                {diagnostics.cameraPermission === 'granted' ? <CheckCircle className="h-5 w-5 text-green-600" /> : diagnostics.cameraPermission === 'denied' ? <AlertTriangle className="h-5 w-5 text-red-600" /> : <Wifi className="h-5 w-5 text-yellow-600" />}
                                <div>
                                    <p className="font-medium">Camera Permission</p>
                                    <p className="text-sm text-gray-600">
                                        {diagnostics.cameraPermission === 'granted' ? 'Granted' : 
                                         diagnostics.cameraPermission === 'denied' ? 'Denied' : 
                                         diagnostics.cameraPermission === 'prompt' ? 'Prompt needed' : 'Unknown'}
                                    </p>
                                </div>
                            </div>
                            
                            <div className={`p-4 rounded-lg flex items-center gap-3 ${diagnostics.browserSupported ? 'bg-green-50 border border-green-200' : 'bg-yellow-50 border border-yellow-200'}`}>
                                {diagnostics.browserSupported ? <CheckCircle className="h-5 w-5 text-green-600" /> : <AlertTriangle className="h-5 w-5 text-yellow-600" />}
                                <div>
                                    <p className="font-medium">Browser Support</p>
                                    <p className="text-sm text-gray-600">
                                        {diagnostics.browserSupported ? 'Supported' : 'May have limitations'}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <Button onClick={runDiagnostics} variant="outline" className="mt-4">
                            Re-run Diagnostics
                        </Button>
                    </CardContent>
                </Card>
                
                {/* Camera Test */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Camera className="h-5 w-5" />
                            Camera Test
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {!cameraActive ? (
                            <div className="text-center py-8">
                                <Button 
                                    onClick={startCamera} 
                                    disabled={loading}
                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3"
                                >
                                    {loading ? (
                                        <div className="flex items-center gap-2">
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            Accessing Camera...
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <Camera className="h-5 w-5" />
                                            Start Camera
                                        </div>
                                    )}
                                </Button>
                                
                                {error && (
                                    <div className="mt-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg max-w-md mx-auto">
                                        <div className="flex items-start gap-2">
                                            <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="font-medium">Camera Error</p>
                                                <p className="text-sm mt-1">{error}</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                
                                <div className="mt-6 text-left max-w-2xl mx-auto">
                                    <h3 className="font-medium mb-2">Troubleshooting Tips:</h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>{'• Ensure you' + "'" + 're accessing the site via HTTPS or localhost'}</li>
                                        <li>• Check that your browser supports camera access</li>
                                        <li>• Make sure no other applications are using the camera</li>
                                        <li>• Grant camera permissions when prompted by the browser</li>
                                        <li>• Try using Chrome, Firefox, or Edge for best compatibility</li>
                                    </ul>
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                <div className="relative">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full rounded-lg border-2 border-gray-300"
                                    />
                                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-full">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm">LIVE</span>
                                    </div>
                                </div>
                                
                                <div className="flex gap-3 justify-center">
                                    <Button 
                                        onClick={capturePhoto}
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        Capture Photo
                                    </Button>
                                    <Button 
                                        onClick={stopCamera}
                                        variant="outline"
                                        className="border-red-300 text-red-700 hover:bg-red-50"
                                    >
                                        <X className="h-4 w-4 mr-2" />
                                        Stop Camera
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
                
                <div className="mt-8 text-center text-sm text-gray-500">
                    <p>This diagnostic tool helps identify and fix camera issues in the pest detection feature.</p>
                    <p className="mt-1">If problems persist, try refreshing the page or restarting your browser.</p>
                </div>
            </div>
        </div>
    )
}