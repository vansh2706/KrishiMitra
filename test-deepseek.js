// Simple test script to check DeepSeek API connectivity
// Run this from the terminal: node test-deepseek.js

const { deepseekChat } = require('./src/deepseek-api.ts')

async function testDeepSeek() {
    console.log('Testing DeepSeek functionality...')

    try {
        const response = await deepseekChat({
            model: 'deepseek-chat',
            messages: [
                {
                    role: 'system',
                    content: 'You are a helpful agricultural advisor.'
                },
                {
                    role: 'user',
                    content: 'What is the best fertilizer for wheat?'
                }
            ],
            temperature: 0.3,
            max_tokens: 200
        })

        console.log('✅ DeepSeek test successful!')
        console.log('Response:', response.choices[0]?.message?.content)

    } catch (error) {
        console.error('❌ DeepSeek test failed:', error.message)
        console.log('\n📝 To fix this issue:')
        console.log('1. Get a DeepSeek API key from: https://www.deepseek.com/')
        console.log('2. Add it to your .env.local file: NEXT_PUBLIC_DEEPSEEK_API_KEY=your_api_key_here')
        console.log('3. Restart the development server')
    }
}

// Only run if this file is executed directly
if (require.main === module) {
    testDeepSeek()
}

module.exports = { testDeepSeek }