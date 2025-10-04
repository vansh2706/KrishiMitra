// Test the chatbot API directly
import { geminiChat } from './src/gemini-api.js';

async function testChatbot() {
    console.log('🧪 Testing Chatbot API Direct Call...\n');

    const testMessage = {
        model: 'gpt-4o-mini',
        messages: [
            {
                role: 'user',
                content: 'What is the best time to plant wheat in India?'
            }
        ],
        temperature: 0.7,
        max_tokens: 150
    };

    try {
        console.log('📝 Question: "What is the best time to plant wheat in India?"');
        console.log('⏳ Calling chatbot API...\n');

        const response = await geminiChat(testMessage, 'en');

        console.log('✅ Response received:');
        console.log('════════════════════════════════════════');
        console.log(response.choices[0]?.message?.content);
        console.log('════════════════════════════════════════');

        if (response.citations && response.citations.length > 0) {
            console.log('\n📚 Sources:');
            response.citations.forEach((citation, index) => {
                console.log(`${index + 1}. ${citation}`);
            });
        }

        // Test if this is a mock response or real AI response
        const content = response.choices[0]?.message?.content || '';
        if (content.includes('🌾') || content.includes('बुवाई का समय') || content.includes('Enhanced Mock Response')) {
            console.log('\n⚠️  Status: Using MOCK/FALLBACK responses');
            console.log('💡 Reason: API keys not configured or API calls failing');
            console.log('🔧 Solution: Add valid GEMINI_API_KEY or OPENAI_API_KEY to .env.local');
        } else {
            console.log('\n✅ Status: Using REAL AI responses');
            console.log('🎉 API integration working correctly!');
        }

    } catch (error) {
        console.log('❌ Error:', error.message);
        console.log('\n🔧 Troubleshooting:');
        console.log('1. Check .env.local file for API keys');
        console.log('2. Ensure Next.js development server is running');
        console.log('3. Verify API keys are valid');
    }

    console.log('\n' + '='.repeat(50));
}

// Run the test
testChatbot();