'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Camera, X, AlertTriangle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PestCameraTestPage() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [cameraActive, setCameraActive] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [loading, setLoading] = useState(false)

    // Cleanup function to stop camera when component unmounts
    useEffect(() => {
        return () => {
            stopCamera()
        }
    }, [])

    const startCamera = async () => {
        try {
            setLoading(true)
            setError(null)
            
            // Check if we're in a secure context (HTTPS or localhost)
            if (!window.isSecureContext) {
                throw new Error('Camera access requires a secure connection (HTTPS or localhost)')
            }

            // Check if mediaDevices is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera is not supported in your browser. Please try a modern browser like Chrome, Firefox, or Edge.')
            }

            // Try to get camera access with preferred constraints
            let stream: MediaStream;
            
            try {
                stream = await navigator.mediaDevices.getUserMedia({
                    video: { 
                        facingMode: 'environment',
                        width: { ideal: 1280 },
                        height: { ideal: 720 }
                    }
                })
            } catch (primaryError) {
                console.warn('Primary camera constraints failed, trying fallback:', primaryError)
                // Fallback to simpler constraints
                try {
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: { 
                            facingMode: 'user'  // Try user-facing camera as fallback
                        }
                    })
                } catch (fallbackError) {
                    console.warn('User-facing camera also failed, trying any camera:', fallbackError)
                    // Last resort - try any camera
                    stream = await navigator.mediaDevices.getUserMedia({
                        video: true
                    })
                }
            }
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                // Add event listeners for better error handling
                videoRef.current.onloadedmetadata = () => {
                    console.log('Camera stream loaded successfully')
                }
                
                videoRef.current.onerror = (e) => {
                    console.error('Video element error:', e)
                    setError('Failed to display camera feed. Please try again.')
                }
            }
            
            setCameraActive(true)
        } catch (error: any) {
            console.error('Camera access failed:', error)
            let errorMessage = 'Camera access denied. Please allow camera permissions to use this feature.'
            
            // Provide more specific error messages
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                errorMessage = 'Camera permission was denied. Please allow camera access in your browser settings.'
            } else if (error.name === 'NotFoundError' || error.name === 'OverconstrainedError') {
                errorMessage = 'No camera found on this device. Please ensure a camera is connected and try again.'
            } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
                errorMessage = 'Camera is already in use by another application. Please close other applications using the camera.'
            } else if (error.name === 'AbortError') {
                errorMessage = 'Camera access was aborted. Please try again.'
            } else if (error.message) {
                errorMessage = error.message
            }
            
            setError(errorMessage)
            // Show error in an alert only if it's a user interaction error
            if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
                alert(errorMessage)
            }
        } finally {
            setLoading(false)
        }
    }

    const stopCamera = () => {
        try {
            if (videoRef.current?.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
                tracks.forEach(track => {
                    try {
                        track.stop()
                    } catch (error) {
                        console.warn('Error stopping track:', error)
                    }
                })
                videoRef.current.srcObject = null
            }
        } catch (error) {
            console.error('Error stopping camera:', error)
        } finally {
            setCameraActive(false)
            setError(null)
        }
    }

    const capturePhoto = () => {
        if (!videoRef.current) {
            const errorMsg = 'Video is not ready yet. Please wait a moment and try again.'
            console.error('Video element not found')
            alert(errorMsg)
            return
        }

        // Check if video is actually playing
        if (!videoRef.current.srcObject) {
            const errorMsg = 'Video stream not available. Please start the camera first.'
            console.error('Video stream not available')
            alert(errorMsg)
            return
        }

        if (videoRef.current.readyState !== videoRef.current.HAVE_ENOUGH_DATA) {
            const errorMsg = 'Video is not ready yet. Please wait a moment and try again.'
            console.error('Video not ready, current state:', videoRef.current.readyState)
            alert(errorMsg)
            return
        }

        try {
            const canvas = document.createElement('canvas')
            const context = canvas.getContext('2d')
            
            if (!context) {
                throw new Error('Unable to create canvas context')
            }
            
            // Set canvas dimensions to match video
            canvas.width = videoRef.current.videoWidth || videoRef.current.offsetWidth || 640
            canvas.height = videoRef.current.videoHeight || videoRef.current.offsetHeight || 480

            // Draw the current video frame to the canvas
            context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
            
            // Convert to data URL with good quality
            const imageUrl = canvas.toDataURL('image/jpeg', 0.92)
            
            if (!imageUrl || imageUrl === 'data:,') {
                throw new Error('Failed to capture image from video stream')
            }
            
            // Create a download link for the captured image
            const link = document.createElement('a')
            link.href = imageUrl
            link.download = 'pest-image.jpg'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            
            alert('Photo captured and downloaded successfully!')
        } catch (error: any) {
            console.error('Photo capture failed:', error)
            const errorMsg = `Failed to capture photo: ${error.message || 'Please try again'}`
            alert(errorMsg)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto p-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Camera className="h-5 w-5" />
                            Pest Detection Camera Test
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <p className="text-gray-600">
                            This page tests the camera functionality used in the pest detection feature. 
                            Click &quot;Start Camera&quot; to begin, then &quot;Capture Photo&quot; to take a picture.
                        </p>
                        
                        {!cameraActive ? (
                            <div className="text-center py-8">
                                <Button 
                                    onClick={startCamera} 
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Loading Camera...
                                        </>
                                    ) : (
                                        <>
                                            <Camera className="mr-2 h-4 w-4" /> Start Camera
                                        </>
                                    )}
                                </Button>
                                {error && (
                                    <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg flex items-start gap-2">
                                        <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                        <div>
                                            <h4 className="font-medium">Camera Error</h4>
                                            <p className="text-sm mt-1">{error}</p>
                                        </div>
                                    </div>
                                )}
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
                                    {/* Camera indicator */}
                                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-full">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm">LIVE</span>
                                    </div>
                                </div>
                                
                                <div className="flex justify-center gap-4">
                                    <Button 
                                        onClick={capturePhoto} 
                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                    >
                                        <Camera className="mr-2 h-4 w-4" /> Capture Photo
                                    </Button>
                                    <Button 
                                        onClick={stopCamera} 
                                        variant="outline"
                                    >
                                        <X className="mr-2 h-4 w-4" /> Stop Camera
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}