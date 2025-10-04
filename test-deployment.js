const https = require('https');

// Replace with your actual deployment URL
const DEPLOYMENT_URL = 'https://krishimitra-fektjoeij-vansh2706s-projects.vercel.app';

async function testApiEndpoint(endpoint) {
    return new Promise((resolve, reject) => {
        const url = `${DEPLOYMENT_URL}${endpoint}`;
        console.log(`Testing: ${url}`);

        https.get(url, (res) => {
            let data = '';

            res.on('data', (chunk) => {
                data += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(data);
                    console.log(`✅ ${endpoint}: Status ${res.statusCode}`);
                    console.log(`   Response: ${JSON.stringify(jsonData, null, 2).substring(0, 200)}...`);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (e) {
                    console.log(`✅ ${endpoint}: Status ${res.statusCode}`);
                    console.log(`   Response: ${data.substring(0, 200)}...`);
                    resolve({ status: res.statusCode, data: data });
                }
            });
        }).on('error', (err) => {
            console.log(`❌ ${endpoint}: Error - ${err.message}`);
            reject(err);
        });
    });
}

async function testPostApiEndpoint(endpoint, postData) {
    return new Promise((resolve, reject) => {
        const url = `${DEPLOYMENT_URL}${endpoint}`;
        console.log(`Testing POST: ${url}`);

        const data = JSON.stringify(postData);

        const options = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': data.length
            }
        };

        const req = https.request(url, options, (res) => {
            let responseData = '';

            res.on('data', (chunk) => {
                responseData += chunk;
            });

            res.on('end', () => {
                try {
                    const jsonData = JSON.parse(responseData);
                    console.log(`✅ ${endpoint}: Status ${res.statusCode}`);
                    console.log(`   Response: ${JSON.stringify(jsonData, null, 2).substring(0, 200)}...`);
                    resolve({ status: res.statusCode, data: jsonData });
                } catch (e) {
                    console.log(`✅ ${endpoint}: Status ${res.statusCode}`);
                    console.log(`   Response: ${responseData.substring(0, 200)}...`);
                    resolve({ status: res.statusCode, data: responseData });
                }
            });
        });

        req.on('error', (err) => {
            console.log(`❌ ${endpoint}: Error - ${err.message}`);
            reject(err);
        });

        req.write(data);
        req.end();
    });
}

async function runTests() {
    console.log('🧪 Testing KrishiMitra API Endpoints\n');

    try {
        // Test health check
        await testApiEndpoint('/api/health-check');

        // Test Gemini API route with a simple request
        await testPostApiEndpoint('/api/gemini', {
            messages: [
                {
                    role: 'user',
                    content: 'Hello, this is a test message'
                }
            ],
            model: 'gemini-2.5-flash',
            temperature: 0.7,
            maxTokens: 100
        });

        // Test test-config route
        await testApiEndpoint('/api/test-config');

        console.log('\n✅ All tests completed!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the tests
runTests();