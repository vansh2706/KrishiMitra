const { GoogleGenerativeAI } = require('@google/generative-ai');

async function testGeminiAPI() {
    try {
        console.log('🧪 Testing Gemini API...');

        const genAI = new GoogleGenerativeAI('AIzaSyD48snX0yGyL3icgexbXrydf4cUw4zCGns');
        const model = genAI.getGenerativeModel({
            model: 'gemini-2.5-flash',
            generationConfig: {
                temperature: 0.7,
                maxOutputTokens: 200,
            }
        });

        const prompt = "What is the best time to plant wheat in India? Give a short answer.";
        console.log('📤 Sending prompt:', prompt);

        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('✅ Gemini API Response:');
        console.log(text);
        console.log('\n🎉 Gemini API is working correctly!');

    } catch (error) {
        console.error('❌ Gemini API Error:', error.message);
        if (error.message.includes('API_KEY_INVALID')) {
            console.log('🔑 API key appears to be invalid or expired');
        } else if (error.message.includes('QUOTA_EXCEEDED')) {
            console.log('📊 API quota exceeded');
        } else {
            console.log('🌐 Check internet connection and API status');
        }
    }
}

testGeminiAPI();