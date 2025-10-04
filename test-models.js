const { GoogleGenerativeAI } = require('@google/generative-ai');

// Get API key from environment variables
const apiKey = process.env.GEMINI_API_KEY || 'AIzaSyD48snX0yGyL3icgexbXrydf4cUw4zCGns';

console.log('Testing different Gemini models...');
console.log('API Key length:', apiKey ? apiKey.length : 'NOT SET');

// Initialize Gemini client
try {
    const genAI = new GoogleGenerativeAI(apiKey);
    console.log('✅ Gemini client initialized successfully');

    // Try with the working model from the previous test
    // Based on the error messages, let's try gemini-2.5-flash-001 or other variants
    const modelsToTry = [
        'gemini-2.5-flash-001',
        'gemini-2.5-flash-002', // This one seems to be causing issues
        'models/gemini-2.5-flash-001',
        'models/gemini-2.5-flash',
        'gemini-2.5-flash'
    ];

    // Test the first model that works for a simple request
    async function testModel(modelName) {
        try {
            console.log(`\nTesting model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });
            console.log(`✅ Model "${modelName}" loaded successfully`);

            // Try a very simple test
            const result = await model.generateContent("Say hello in one word.");
            console.log(`✅ API call with "${modelName}" successful`);
            console.log(`Response: ${result.response.text()}`);
            return true;
        } catch (error) {
            console.log(`❌ Model "${modelName}" failed: ${error.message}`);
            return false;
        }
    }

    // Try each model until one works
    (async () => {
        for (const model of modelsToTry) {
            const success = await testModel(model);
            if (success) {
                console.log(`\n🎉 First working model found: ${model}`);
                break;
            }
        }

        console.log('\n✅ Testing complete');
    })();

} catch (initError) {
    console.error('❌ Gemini client initialization failed:', initError.message);
}