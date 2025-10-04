// Test script to verify KrishiMitra API is working
const API_BASE_URL = 'http://localhost:3001/api'

async function testAPI() {
    console.log('🧪 Testing KrishiMitra API...\n')

    // Test 1: Health Check
    console.log('1️⃣ Testing Health Check...')
    try {
        const response = await fetch(`${API_BASE_URL}/health`)
        const data = await response.json()
        
        if (data.success) {
            console.log('✅ Health Check: PASSED')
            console.log(`   Message: ${data.message}`)
        } else {
            console.log('❌ Health Check: FAILED')
        }
    } catch (error) {
        console.log('❌ Health Check: ERROR')
        console.log(`   Error: ${error.message}`)
        console.log('   Make sure the API server is running on port 3001')
        return
    }

    console.log('')

    // Test 2: Login API (Phone)
    console.log('2️⃣ Testing Login API (Phone)...')
    try {
        const loginData = {
            name: 'Test Farmer',
            contact: '9876543210',
            contactType: 'phone',
            captcha: '123'
        }

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })

        const data = await response.json()
        
        if (data.success) {
            console.log('✅ Phone Login: PASSED')
            console.log(`   User ID: ${data.data.user.id}`)
            console.log(`   Requires OTP: ${data.data.requiresOtp}`)
            console.log(`   OTP Sent: ${data.data.otpSent}`)
        } else {
            console.log('❌ Phone Login: FAILED')
            console.log(`   Error: ${data.message}`)
        }
    } catch (error) {
        console.log('❌ Phone Login: ERROR')
        console.log(`   Error: ${error.message}`)
    }

    console.log('')

    // Test 3: Login API (Email)
    console.log('3️⃣ Testing Login API (Email)...')
    try {
        const loginData = {
            name: 'Test Farmer',
            contact: 'test@example.com',
            contactType: 'email',
            captcha: '123'
        }

        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(loginData)
        })

        const data = await response.json()
        
        if (data.success) {
            console.log('✅ Email Login: PASSED')
            console.log(`   User ID: ${data.data.user.id}`)
            console.log(`   Requires OTP: ${data.data.requiresOtp}`)
            console.log(`   Token: ${data.data.token ? 'Generated' : 'Not generated'}`)
        } else {
            console.log('❌ Email Login: FAILED')
            console.log(`   Error: ${data.message}`)
        }
    } catch (error) {
        console.log('❌ Email Login: ERROR')
        console.log(`   Error: ${error.message}`)
    }

    console.log('')

    // Test 4: Weather API
    console.log('4️⃣ Testing Weather API...')
    try {
        const response = await fetch(`${API_BASE_URL}/weather/current?lat=28.6139&lon=77.2090`)
        const data = await response.json()
        
        if (data.success) {
            console.log('✅ Weather API: PASSED')
            console.log(`   Temperature: ${data.data.temperature}°C`)
            console.log(`   Description: ${data.data.description}`)
        } else {
            console.log('❌ Weather API: FAILED')
        }
    } catch (error) {
        console.log('❌ Weather API: ERROR')
        console.log(`   Error: ${error.message}`)
    }

    console.log('')

    // Test 5: Chat API
    console.log('5️⃣ Testing Chat API...')
    try {
        const chatData = {
            message: 'Hello, I need help with my crops'
        }

        const response = await fetch(`${API_BASE_URL}/chat/message`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(chatData)
        })

        const data = await response.json()
        
        if (data.success) {
            console.log('✅ Chat API: PASSED')
            console.log(`   Response: ${data.data.response.substring(0, 50)}...`)
        } else {
            console.log('❌ Chat API: FAILED')
        }
    } catch (error) {
        console.log('❌ Chat API: ERROR')
        console.log(`   Error: ${error.message}`)
    }

    console.log('')
    console.log('🎉 API Testing Complete!')
    console.log('')
    console.log('📋 Next Steps:')
    console.log('   1. If all tests passed, your API is working correctly')
    console.log('   2. Copy env.local.example to .env.local in your project root')
    console.log('   3. Start your Next.js frontend with: npm run dev')
    console.log('   4. Test the login functionality in your browser')
}

// Run the tests
testAPI().catch(console.error)
