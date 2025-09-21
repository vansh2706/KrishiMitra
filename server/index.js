// Simple Express server for KrishiMitra API
const express = require('express')
const cors = require('cors')
const jwt = require('jsonwebtoken')
const app = express()
const PORT = process.env.PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'krishimitra-secret-key'

// In-memory storage (use database in production)
const users = new Map()
const otpStorage = new Map()

// Helper function to generate OTP
function generateOTP() {
    return Math.floor(100000 + Math.random() * 900000).toString()
}

// Helper function to send OTP (mock implementation)
async function sendOTP(contact, contactType, otp) {
    console.log(`Sending OTP ${otp} to ${contactType}: ${contact}`)
    // In production, integrate with SMS/Email service
    return true
}

// Auth Routes
app.post('/api/auth/login', async (req, res) => {
    try {
        const { name, contact, contactType, captcha } = req.body

        // Validate input
        if (!name || !contact || !contactType || !captcha) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        // Simple captcha validation (you can make this more sophisticated)
        // For now, we'll accept any non-empty captcha
        if (!captcha.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Invalid captcha'
            })
        }

        // Generate user ID
        const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
        
        // Create user object
        const user = {
            id: userId,
            name: name.trim(),
            contact,
            contactType,
            createdAt: new Date().toISOString()
        }

        // Store user
        users.set(userId, user)

        // For phone numbers, require OTP verification
        if (contactType === 'phone') {
            const otp = generateOTP()
            otpStorage.set(contact, {
                otp,
                userId,
                expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes
                attempts: 0
            })

            // Send OTP (mock)
            await sendOTP(contact, contactType, otp)

            return res.json({
                success: true,
                data: {
                    user,
                    requiresOtp: true,
                    otpSent: true
                }
            })
        } else {
            // For email, direct login (you can add email verification later)
            const token = jwt.sign({ userId, contact }, JWT_SECRET, { expiresIn: '7d' })
            
            return res.json({
                success: true,
                data: {
                    user,
                    token,
                    requiresOtp: false
                }
            })
        }

    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

app.post('/api/auth/verify-otp', async (req, res) => {
    try {
        const { contact, contactType, otp } = req.body

        if (!contact || !contactType || !otp) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            })
        }

        const otpData = otpStorage.get(contact)
        
        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: 'OTP not found or expired'
            })
        }

        if (Date.now() > otpData.expiresAt) {
            otpStorage.delete(contact)
            return res.status(400).json({
                success: false,
                message: 'OTP expired'
            })
        }

        if (otpData.attempts >= 3) {
            otpStorage.delete(contact)
            return res.status(400).json({
                success: false,
                message: 'Maximum attempts reached'
            })
        }

        if (otpData.otp !== otp) {
            otpData.attempts++
            return res.status(400).json({
                success: false,
                message: 'Invalid OTP'
            })
        }

        // OTP verified successfully
        const user = users.get(otpData.userId)
        const token = jwt.sign({ userId: otpData.userId, contact }, JWT_SECRET, { expiresIn: '7d' })
        
        // Clean up OTP
        otpStorage.delete(contact)

        res.json({
            success: true,
            data: {
                verified: true,
                token,
                user
            }
        })

    } catch (error) {
        console.error('OTP verification error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

app.post('/api/auth/resend-otp', async (req, res) => {
    try {
        const { contact, contactType } = req.body

        const otpData = otpStorage.get(contact)
        if (!otpData) {
            return res.status(400).json({
                success: false,
                message: 'No OTP request found'
            })
        }

        // Generate new OTP
        const newOtp = generateOTP()
        otpData.otp = newOtp
        otpData.expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes
        otpData.attempts = 0

        // Send OTP
        await sendOTP(contact, contactType, newOtp)

        res.json({
            success: true,
            data: {
                otpSent: true
            }
        })

    } catch (error) {
        console.error('Resend OTP error:', error)
        res.status(500).json({
            success: false,
            message: 'Internal server error'
        })
    }
})

// Weather API (mock)
app.get('/api/weather/current', (req, res) => {
    const { lat, lon } = req.query
    
    // Mock weather data
    res.json({
        success: true,
        data: {
            temperature: 25,
            humidity: 65,
            description: 'Partly cloudy',
            windSpeed: 10,
            location: { lat: parseFloat(lat), lon: parseFloat(lon) }
        }
    })
})

// Chat API (mock)
app.post('/api/chat/message', (req, res) => {
    const { message } = req.body
    
    // Mock AI response
    res.json({
        success: true,
        data: {
            response: `Thank you for your message: "${message}". This is a mock response from KrishiMitra AI assistant.`,
            timestamp: new Date().toISOString()
        }
    })
})

// Health check
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        message: 'KrishiMitra API is running',
        timestamp: new Date().toISOString()
    })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        success: false,
        message: 'Something went wrong!'
    })
})

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: 'API endpoint not found'
    })
})

app.listen(PORT, () => {
    console.log(`🚀 KrishiMitra API server running on port ${PORT}`)
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
    console.log(`🔐 Login endpoint: http://localhost:${PORT}/api/auth/login`)
})

module.exports = app
