const { GoogleGenerativeAI } = require('@google/generative-ai');

// Test the Gemini API integration
async function testGeminiIntegration() {
    try {
        // Use the API key from environment variables
        const apiKey = process.env.GEMINI_API_KEY || process.env.NEXT_PUBLIC_GEMINI_API_KEY;

        if (!apiKey) {
            console.log('❌ GEMINI_API_KEY not found in environment variables');
            return;
        }

        console.log('✅ GEMINI_API_KEY found in environment variables');

        // Initialize the Google Generative AI client
        const genAI = new GoogleGenerativeAI(apiKey);

        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

        // Test prompt
        const prompt = "Explain in one sentence what is the benefit of using AI in agriculture?";

        console.log('📤 Sending request to Gemini API...');

        // Generate content
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const text = response.text();

        console.log('📥 Response from Gemini API:');
        console.log(text);
        console.log('✅ Gemini API integration test passed!');

    } catch (error) {
        console.error('❌ Error testing Gemini API integration:', error.message);

        // Provide specific error messages
        if (error.message.includes('API_KEY_INVALID')) {
            console.error('🔑 Invalid API key. Please check your GEMINI_API_KEY in .env.local');
        } else if (error.message.includes('404')) {
            console.error('🔗 API endpoint not found. Check the model name.');
        } else if (error.message.includes('401')) {
            console.error('🔐 Unauthorized. Check your API key.');
        } else if (error.message.includes('429')) {
            console.error('⏳ Rate limit exceeded. Please wait before making more requests.');
        }
    }
}

// Run the test
testGeminiIntegration();