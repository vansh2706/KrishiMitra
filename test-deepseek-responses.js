// Test script to verify DeepSeek is giving proper responses and not default responses
const { deepseekChat } = require('./src/deepseek-api.ts');

async function testDeepSeekResponses() {
    console.log('🧪 Testing DeepSeek API responses...');

    try {
        // Test 1: Simple agricultural question
        console.log('\n📝 Test 1: Simple agricultural question');
        const response1 = await deepseekChat({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: 'You are an agricultural expert. Provide concise, practical advice.'
                },
                {
                    role: 'user',
                    content: 'What is the best time to plant wheat in India?'
                }
            ],
            temperature: 0.3,
            max_tokens: 200
        }, 'en');

        const answer1 = response1.choices[0]?.message?.content;
        console.log('✅ Response received:');
        console.log(answer1);

        // Check if it's a real response (not a mock/default one)
        const isRealResponse1 = answer1 &&
            !answer1.includes('mock') &&
            !answer1.includes('fallback') &&
            answer1.length > 50 &&
            (answer1.includes('October') || answer1.includes('November') || answer1.includes('season'));

        console.log('🔍 Is real response?', isRealResponse1 ? '✅ YES' : '❌ NO');

        // Test 2: Hindi language question
        console.log('\n📝 Test 2: Hindi language question');
        const response2 = await deepseekChat({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'user',
                    content: 'गेहूं की खेती कैसे करें?'
                }
            ],
            temperature: 0.3,
            max_tokens: 300
        }, 'hi');

        const answer2 = response2.choices[0]?.message?.content;
        console.log('✅ Response received:');
        console.log(answer2);

        // Check if it's a real response in Hindi
        const isRealResponse2 = answer2 &&
            !answer2.includes('mock') &&
            !answer2.includes('fallback') &&
            answer2.length > 50 &&
            (answer2.includes('गेहूं') || answer2.includes('बुवाई') || answer2.includes('खेती'));

        console.log('🔍 Is real response in Hindi?', isRealResponse2 ? '✅ YES' : '❌ NO');

        // Test 3: Complex question with specific details
        console.log('\n📝 Test 3: Complex question with specific details');
        const response3 = await deepseekChat({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'user',
                    content: 'I am a farmer in Maharashtra. What are the best organic fertilizers for tomato cultivation? Please include specific application rates.'
                }
            ],
            temperature: 0.4,
            max_tokens: 400
        }, 'en');

        const answer3 = response3.choices[0]?.message?.content;
        console.log('✅ Response received:');
        console.log(answer3);

        // Check if it's a detailed real response
        const isRealResponse3 = answer3 &&
            !answer3.includes('mock') &&
            !answer3.includes('fallback') &&
            answer3.length > 100 &&
            (answer3.includes('organic') || answer3.includes('fertilizer') || answer3.includes('compost'));

        console.log('🔍 Is detailed real response?', isRealResponse3 ? '✅ YES' : '❌ NO');

        // Overall result
        console.log('\n📊 OVERALL RESULTS:');
        if (isRealResponse1 && isRealResponse2 && isRealResponse3) {
            console.log('🎉 SUCCESS: DeepSeek is providing proper, non-default responses!');
            console.log('✅ Chatbot/advisor should now work correctly with real AI responses.');
        } else {
            console.log('❌ ISSUE: DeepSeek may be providing default/mock responses.');
            console.log('📝 Please check your DeepSeek API key configuration.');
        }

    } catch (error) {
        console.error('❌ Error testing DeepSeek:', error.message);
        console.log('\n📝 Troubleshooting steps:');
        console.log('1. Verify your DeepSeek API key in .env.local');
        console.log('2. Check if the key has proper permissions');
        console.log('3. Ensure you have internet connectivity');
        console.log('4. Restart the development server');
    }
}

// Run the test
testDeepSeekResponses();