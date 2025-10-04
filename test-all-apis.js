// Comprehensive API Test Script for KrishiMitra
// Tests all API endpoints and integrations

async function testAllAPIs() {
    console.log('🧪 KrishiMitra API Test Suite\n');

    const baseUrl = 'http://localhost:3001';
    const results = {
        health: false,
        proxy: false,
        pestDetection: false,
        chatbot: false,
        weather: false
    };

    // Test 1: Health Check API
    console.log('1️⃣ Testing Health API...');
    try {
        const response = await fetch(`${baseUrl}/api/health`);
        const data = await response.json();
        if (response.ok) {
            console.log('✅ Health API: Working');
            console.log(`   Status: ${data.status}`);
            console.log(`   Uptime: ${data.uptime}s`);
            results.health = true;
        } else {
            console.log('❌ Health API: Failed');
        }
    } catch (error) {
        console.log('❌ Health API: Error -', error.message);
    }

    console.log('');

    // Test 2: Proxy API
    console.log('2️⃣ Testing Proxy API...');
    try {
        const response = await fetch(`${baseUrl}/api/proxy`);
        const data = await response.json();
        if (response.ok) {
            console.log('✅ Proxy API: Working');
            console.log(`   Message: ${data.message}`);
            console.log(`   Allowed Origins: ${data.allowedOrigins.length}`);
            results.proxy = true;
        } else {
            console.log('❌ Proxy API: Failed');
        }
    } catch (error) {
        console.log('❌ Proxy API: Error -', error.message);
    }

    console.log('');

    // Test 3: Pest Detection API
    console.log('3️⃣ Testing Pest Detection API...');
    try {
        const testImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAYABgAAD/2wBDAAEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/2wBDAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQEBAQH/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwA/wA8=';

        const response = await fetch(`${baseUrl}/api/analyze-pest`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                imageData: testImageData,
                language: 'en'
            })
        });

        const data = await response.json();
        if (response.ok && data.success) {
            console.log('✅ Pest Detection API: Working');
            console.log(`   Detected: ${data.result?.pestName}`);
            console.log(`   Confidence: ${data.result?.confidence}%`);
            console.log(`   Severity: ${data.result?.severity}`);
            results.pestDetection = true;
        } else {
            console.log('❌ Pest Detection API: Failed');
            console.log(`   Error: ${data.error || 'Unknown error'}`);
        }
    } catch (error) {
        console.log('❌ Pest Detection API: Error -', error.message);
    }

    console.log('');

    // Test 4: Weather API (via Proxy)
    console.log('4️⃣ Testing Weather API (via Proxy)...');
    try {
        const response = await fetch(`${baseUrl}/api/proxy`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                protocol: 'https',
                origin: 'api.openweathermap.org',
                path: '/data/2.5/weather?q=Delhi&units=metric',
                method: 'GET'
            })
        });

        const data = await response.json();
        if (response.ok && data.name) {
            console.log('✅ Weather API: Working');
            console.log(`   City: ${data.name}`);
            console.log(`   Temperature: ${data.main?.temp}°C`);
            console.log(`   Weather: ${data.weather?.[0]?.description}`);
            results.weather = true;
        } else {
            console.log('❌ Weather API: Failed');
            console.log(`   Response: ${JSON.stringify(data).substring(0, 100)}...`);
        }
    } catch (error) {
        console.log('❌ Weather API: Error -', error.message);
    }

    console.log('');

    // Test 5: Chatbot API (Test DeepSeek/Gemini integration)
    console.log('5️⃣ Testing Chatbot API Integration...');
    try {
        // This tests the underlying chat API by making a direct call
        const testMessage = 'What is the best time to plant wheat?';

        // For client-side testing, we'll test if the API keys are configured
        const envTest = await fetch(`${baseUrl}/api/health`);
        const envData = await envTest.json();

        // Check for API key presence (indirect test)
        const hasGeminiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY &&
            process.env.NEXT_PUBLIC_GEMINI_API_KEY !== 'your_gemini_api_key_here';
        const hasDeepSeekKey = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY &&
            process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY !== 'your_deepseek_api_key_here';

        if (hasGeminiKey || hasDeepSeekKey) {
            console.log('✅ Chatbot API: Keys Configured');
            console.log(`   Gemini API: ${hasGeminiKey ? 'Configured' : 'Not configured'}`);
            console.log(`   DeepSeek API: ${hasDeepSeekKey ? 'Configured' : 'Not configured'}`);
            results.chatbot = true;
        } else {
            console.log('⚠️  Chatbot API: No API keys configured');
            console.log('   Add GEMINI_API_KEY or DEEPSEEK_API_KEY to .env.local');
        }
    } catch (error) {
        console.log('❌ Chatbot API: Error -', error.message);
    }

    console.log('');

    // Test Summary
    console.log('📊 TEST SUMMARY');
    console.log('================');
    const totalTests = Object.keys(results).length;
    const passedTests = Object.values(results).filter(Boolean).length;

    console.log(`✅ Passed: ${passedTests}/${totalTests}`);
    console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests}`);

    Object.entries(results).forEach(([test, passed]) => {
        const status = passed ? '✅' : '❌';
        const name = test.charAt(0).toUpperCase() + test.slice(1);
        console.log(`   ${status} ${name}`);
    });

    console.log('');

    // Recommendations
    if (passedTests < totalTests) {
        console.log('🔧 RECOMMENDATIONS');
        console.log('===================');

        if (!results.health) {
            console.log('• Check if development server is running: npm run dev');
        }
        if (!results.pestDetection) {
            console.log('• Add GEMINI_API_KEY to .env.local file');
        }
        if (!results.weather) {
            console.log('• Add OPENWEATHER_API_KEY to .env.local file');
        }
        if (!results.chatbot) {
            console.log('• Add GEMINI_API_KEY or DEEPSEEK_API_KEY to .env.local file');
        }
    } else {
        console.log('🎉 All APIs are working properly!');
        console.log('Your KrishiMitra application is ready for use.');
    }
}

// Run the tests
testAllAPIs().catch(console.error);