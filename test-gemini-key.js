const { GoogleGenerativeAI } = require('@google/generative-ai');

// Get API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyD48snX0yGyL3icgexbXrydf4cUw4zCGns';

console.log('Testing Gemini API key...');
console.log('API Key length:', apiKey ? apiKey.length : 'NOT SET');

// Initialize Gemini client
try {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Gemini client initialized successfully');

    // Try to get the model
    try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
        console.log('✅ Model "gemini-2.5-flash" loaded successfully');

        // Try a simple test
        model.generateContent("Hello, this is a test.")
            .then(result => {
                console.log('✅ API call successful');
                console.log('Response:', result.response.text().substring(0, 100) + '...');
            })
            .catch(error => {
                console.error('❌ API call failed:', error.message);
            });
    } catch (modelError) {
        console.error('❌ Model loading failed:', modelError.message);
    }
} catch (initError) {
    console.error('❌ Gemini client initialization failed:', initError.message);
}