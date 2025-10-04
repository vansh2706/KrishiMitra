'use client'

import { useState, useRef, useEffect } from 'react'

export default function CameraFunctionalTest() {
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
                <h1 className="text-3xl font-bold mb-6 text-center">Camera Functionality Test</h1>
                
                {!cameraActive ? (
                    <div className="text-center py-8">
                        <button 
                            onClick={startCamera} 
                            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-lg transition duration-300"
                            disabled={loading}
                        >
                            {loading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Loading Camera...
                                </div>
                            ) : (
                                'Start Camera'
                            )}
                        </button>
                        {error && (
                            <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
                                <strong>Error:</strong> {error}
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
                            <button 
                                onClick={stopCamera} 
                                className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg shadow transition duration-300"
                            >
                                Stop Camera
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}