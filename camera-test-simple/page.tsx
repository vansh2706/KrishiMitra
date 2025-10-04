'use client'

import { useState, useRef } from 'react'

export default function SimpleCameraTest() {
    const videoRef = useRef<HTMLVideoElement>(null)
    const [cameraActive, setCameraActive] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const startCamera = async () => {
        try {
            setError(null)
            
            // Check if we're in a secure context (HTTPS or localhost)
            if (!window.isSecureContext) {
                throw new Error('Camera access requires a secure connection (HTTPS or localhost)')
            }

            // Check if mediaDevices is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera is not supported in your browser')
            }

            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: 'environment' }
            })
            
            if (videoRef.current) {
                videoRef.current.srcObject = stream
                setCameraActive(true)
            }
        } catch (error: any) {
            console.error('Camera access failed:', error)
            setError(error.message || 'Failed to access camera')
            setCameraActive(false)
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

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Simple Camera Test</h1>
            
            {!cameraActive ? (
                <div>
                    <button 
                        onClick={startCamera}
                        style={{
                            backgroundColor: '#4CAF50',
                            border: 'none',
                            color: 'white',
                            padding: '15px 32px',
                            textAlign: 'center',
                            textDecoration: 'none',
                            display: 'inline-block',
                            fontSize: '16px',
                            margin: '4px 2px',
                            cursor: 'pointer',
                            borderRadius: '4px'
                        }}
                    >
                        Start Camera
                    </button>
                    {error && (
                        <div style={{
                            backgroundColor: '#f8d7da',
                            color: '#721c24',
                            padding: '10px',
                            marginTop: '10px',
                            borderRadius: '4px',
                            border: '1px solid #f5c6cb'
                        }}>
                            Error: {error}
                        </div>
                    )}
                </div>
            ) : (
                <div>
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        style={{
                            width: '100%',
                            maxWidth: '500px',
                            border: '2px solid #ccc',
                            borderRadius: '4px'
                        }}
                    />
                    <div style={{ marginTop: '10px' }}>
                        <button 
                            onClick={stopCamera}
                            style={{
                                backgroundColor: '#f44336',
                                border: 'none',
                                color: 'white',
                                padding: '15px 32px',
                                textAlign: 'center',
                                textDecoration: 'none',
                                display: 'inline-block',
                                fontSize: '16px',
                                margin: '4px 2px',
                                cursor: 'pointer',
                                borderRadius: '4px'
                            }}
                        >
                            Stop Camera
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}