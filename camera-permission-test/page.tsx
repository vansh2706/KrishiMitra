'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertCircle, CheckCircle, Camera } from 'lucide-react'

export default function CameraPermissionTest() {
    const [permissionStatus, setPermissionStatus] = useState<string | null>(null)
    const [error, setError] = useState<string | null>(null)

    const checkCameraPermission = async () => {
        try {
            setError(null)
            
            // Check if we're in a secure context
            if (!window.isSecureContext) {
                setPermissionStatus('insecure-context')
                return
            }

            // Check if mediaDevices is available
            if (!navigator.mediaDevices) {
                setPermissionStatus('not-supported')
                return
            }

            // Check permission status
            if ('permissions' in navigator) {
                try {
                    const permission = await navigator.permissions.query({ name: 'camera' as PermissionName })
                    setPermissionStatus(permission.state)
                    
                    // Listen for permission changes
                    permission.onchange = () => {
                        setPermissionStatus(permission.state)
                    }
                } catch (err) {
                    // Fallback if permissions API is not supported
                    setPermissionStatus('unknown')
                }
            } else {
                setPermissionStatus('unknown')
            }
        } catch (err) {
            console.error('Error checking camera permission:', err)
            setError('Failed to check camera permission status')
        }
    }

    const requestCameraAccess = async () => {
        try {
            setError(null)
            
            // Check if we're in a secure context
            if (!window.isSecureContext) {
                throw new Error('Camera access requires a secure connection (HTTPS or localhost)')
            }

            // Check if mediaDevices is available
            if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
                throw new Error('Camera is not supported in your browser')
            }

            // Request camera access
            const stream = await navigator.mediaDevices.getUserMedia({ video: true })
            
            // Stop all tracks immediately
            stream.getTracks().forEach(track => track.stop())
            
            // Update permission status
            setPermissionStatus('granted')
        } catch (err: any) {
            console.error('Camera access error:', err)
            
            if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
                setPermissionStatus('denied')
                setError('Camera permission was denied. Please allow camera access in your browser settings.')
            } else if (err.name === 'NotFoundError' || err.name === 'OverconstrainedError') {
                setPermissionStatus('not-found')
                setError('No camera found on this device.')
            } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
                setPermissionStatus('in-use')
                setError('Camera is already in use by another application.')
            } else {
                setPermissionStatus('denied')
                setError(err.message || 'Failed to access camera')
            }
        }
    }

    useEffect(() => {
        checkCameraPermission()
    }, [])

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="max-w-2xl mx-auto p-6">
                <h1 className="text-3xl font-bold mb-6 text-center">Camera Permission Test</h1>
                
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Camera Permission Status</h2>
                        
                        {permissionStatus === 'granted' && (
                            <Alert className="border-green-200 bg-green-50">
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <AlertTitle className="text-green-800">Permission Granted</AlertTitle>
                                <AlertDescription className="text-green-700">
                                    Camera access is granted. You can use the camera for pest detection.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {permissionStatus === 'denied' && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Permission Denied</AlertTitle>
                                <AlertDescription>
                                    Camera access has been denied. You need to grant permission to use the camera for pest detection.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {permissionStatus === 'prompt' && (
                            <Alert className="border-yellow-200 bg-yellow-50">
                                <AlertCircle className="h-4 w-4 text-yellow-600" />
                                <AlertTitle className="text-yellow-800">Permission Prompt</AlertTitle>
                                <AlertDescription className="text-yellow-700">
                                    The browser will prompt for camera access when needed.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {permissionStatus === 'insecure-context' && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Insecure Context</AlertTitle>
                                <AlertDescription>
                                    Camera access requires a secure connection (HTTPS or localhost). 
                                    Please access this application through a secure connection.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {permissionStatus === 'not-supported' && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Not Supported</AlertTitle>
                                <AlertDescription>
                                    Camera access is not supported in your browser. 
                                    Please try a modern browser like Chrome, Firefox, or Edge.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {permissionStatus === 'not-found' && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>No Camera Found</AlertTitle>
                                <AlertDescription>
                                    No camera was found on this device. Please ensure a camera is connected.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {permissionStatus === 'in-use' && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Camera In Use</AlertTitle>
                                <AlertDescription>
                                    Camera is already in use by another application. 
                                    Please close other applications using the camera.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {permissionStatus === 'unknown' && (
                            <Alert className="border-blue-200 bg-blue-50">
                                <AlertCircle className="h-4 w-4 text-blue-600" />
                                <AlertTitle className="text-blue-800">Unknown Status</AlertTitle>
                                <AlertDescription className="text-blue-700">
                                    Unable to determine camera permission status. 
                                    Try requesting access to check permission.
                                </AlertDescription>
                            </Alert>
                        )}
                        
                        {error && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertCircle className="h-4 w-4" />
                                <AlertTitle>Error</AlertTitle>
                                <AlertDescription>
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Test Camera Access</h2>
                        <p className="text-gray-600 mb-4">
                            Click the button below to request camera access. 
                            Your browser will prompt you to allow camera access if needed.
                        </p>
                        <Button 
                            onClick={requestCameraAccess}
                            className="bg-green-600 hover:bg-green-700 text-white"
                        >
                            <Camera className="mr-2 h-4 w-4" /> Request Camera Access
                        </Button>
                    </div>
                    
                    <div className="bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">How to Grant Camera Permission</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-600">
                            <li>Click the camera icon in your browser&apos;s address bar</li>
                            <li>Select &quot;Always allow&quot; or &quot;Allow&quot; for camera access</li>
                            <li>Refresh the page after granting permission</li>
                            <li>If using Chrome, you can also go to Settings &gt; Privacy and security &gt; Site Settings &gt; Camera</li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}