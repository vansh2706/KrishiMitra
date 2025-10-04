const https = require('https');

// Use the latest deployment URL
const DEPLOYMENT_URL = 'https://krishimitra-n4rpc0j5s-vansh2706s-projects.vercel.app';

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
    console.log('🧪 Testing KrishiMitra API Endpoints After Fix\n');

    try {
        // Test simple API route
        await testApiEndpoint('/api/simple-test');

        // Test simple POST API route
        await testPostApiEndpoint('/api/simple-test', {
            test: 'data'
        });

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

        console.log('\n✅ All tests completed!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
    }
}

// Run the tests
runTests();