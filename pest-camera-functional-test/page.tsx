'use client'

import { useState, useRef, useEffect } from 'react'
import { Camera, X } from 'lucide-react'

export default function PestCameraFunctionalTest() {
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
                    setLoading(false)
                }
                
                videoRef.current.onerror = (e) => {
                    console.error('Video element error:', e)
                    setError('Failed to display camera feed. Please try again.')
                    setLoading(false)
                }
            }
            
            setCameraActive(true)
        } catch (error: any) {
            // Reset camera state on error
            setCameraActive(false)
            setLoading(false)
            
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

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-center">Pest Detection Camera Test</h1>
                <p className="text-gray-600 mb-8 text-center">
                    This page tests the camera functionality used in the pest detection feature. 
                    Click &quot;Use Camera&quot; to start the camera.
                </p>
                
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="space-y-4">
                        {/* Upload Section */}
                        <div className="space-y-4">
                            <div className="border-2 border-dashed rounded-lg p-8 text-center transition-colors bg-gray-50">
                                <Camera className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                                <h3 className="text-lg font-semibold mb-2">Pest Detection Camera</h3>
                                <p className="text-gray-600 mb-4">
                                    Use your camera to capture images of pest-affected plants
                                </p>
                                <div className="flex gap-2 justify-center">
                                    <button
                                        onClick={cameraActive ? stopCamera : startCamera}
                                        className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300 flex items-center"
                                        disabled={loading}
                                    >
                                        <Camera className="h-4 w-4 mr-2" />
                                        {cameraActive ? 'Stop Camera' : 'Use Camera'}
                                    </button>
                                </div>
                            </div>

                            {/* Camera View */}
                            {cameraActive && (
                                <div className="relative">
                                    <video
                                        ref={videoRef}
                                        autoPlay
                                        playsInline
                                        muted
                                        className="w-full rounded-lg border-2 border-gray-300"
                                    />
                                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-3">
                                        <button 
                                            onClick={stopCamera} 
                                            className="bg-white/80 hover:bg-white/90 text-gray-800 font-bold py-2 px-4 rounded-lg shadow-lg flex items-center backdrop-blur-sm"
                                        >
                                            <X className="h-5 w-5 mr-2" />
                                            Cancel
                                        </button>
                                    </div>
                                    
                                    {/* Camera indicator */}
                                    <div className="absolute top-4 right-4 flex items-center gap-2 bg-black/50 text-white px-3 py-1 rounded-full">
                                        <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                                        <span className="text-sm">LIVE</span>
                                    </div>
                                </div>
                            )}
                            
                            {/* Camera loading state */}
                            {cameraActive && !videoRef.current?.srcObject && (
                                <div className="flex items-center justify-center p-4">
                                    <div className="flex items-center gap-2 text-gray-600">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-gray-600"></div>
                                        <span>Loading camera...</span>
                                    </div>
                                </div>
                            )}
                            
                            {/* Camera Error */}
                            {error && (
                                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <div className="flex items-start gap-2">
                                        <div>
                                            <h4 className="font-medium text-red-800">Camera Error</h4>
                                            <p className="text-red-700 text-sm mt-1">{error}</p>
                                            <button 
                                                className="mt-2 text-red-700 hover:text-red-900 text-sm font-medium"
                                                onClick={() => setError(null)}
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}