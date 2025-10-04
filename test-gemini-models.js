const { GoogleGenerativeAI } = require('@google/generative-ai');
const fs = require('fs');

// Read the API key from .env.local
const envContent = fs.readFileSync('.env.local', 'utf8');
const geminiKey = envContent.match(/GEMINI_API_KEY=(.*)/)[1];

console.log('Testing Gemini API key and available models...');
console.log('API Key (last 5 chars):', geminiKey.slice(-5));

const genAI = new GoogleGenerativeAI(geminiKey);

// List of models to try
const modelsToTry = [
    'gemini-1.5-flash',
    'gemini-1.5-pro',
    'gemini-pro',
    'gemini-1.0-pro',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro'
];

async function testModels() {
    for (const modelName of modelsToTry) {
        try {
            console.log(`\nTrying model: ${modelName}`);
            const model = genAI.getGenerativeModel({ model: modelName });

            // Simple test
            const result = await model.generateContent('Hello, just a quick test');
            const response = await result.response;
            const text = response.text();

            console.log(`✅ Model ${modelName} is working`);
            console.log(`Response: ${text.substring(0, 50)}...`);
            return; // If one works, we're good
        } catch (error) {
            console.log(`❌ Model ${modelName} failed: ${error.message.split('.')[0]}`);
        }
    }

    console.log('\n⚠️  No models worked. This might indicate:');
    console.log('  1. API key issues');
    console.log('  2. Quota exceeded');
    console.log('  3. Regional restrictions');
    console.log('  4. Model availability changes');
}

testModels();