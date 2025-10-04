// Test script to verify API keys are working properly
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

console.log('🔍 Testing API Key Configuration...\n');

// Test DeepSeek API Key
console.log('1. Testing DeepSeek API Key...');
const deepseekKey = process.env.DEEPSEEK_API_KEY;
if (deepseekKey) {
    console.log('   ✅ DEEPSEEK_API_KEY found');
    console.log('   📏 Key length:', deepseekKey.length);
    if (deepseekKey.startsWith('sk-or-v1-')) {
        console.log('   ✅ Key format looks correct');
    } else {
        console.log('   ⚠️  Key format might be incorrect');
    }
} else {
    console.log('   ❌ DEEPSEEK_API_KEY not found');
}

// Test Gemini API Key
console.log('\n2. Testing Gemini API Key...');
const geminiKey = process.env.GEMINI_API_KEY;
if (geminiKey) {
    console.log('   ✅ GEMINI_API_KEY found');
    console.log('   📏 Key length:', geminiKey.length);
    if (geminiKey.startsWith('AIza')) {
        console.log('   ✅ Key format looks correct');
    } else {
        console.log('   ⚠️  Key format might be incorrect');
    }
} else {
    console.log('   ❌ GEMINI_API_KEY not found');
}

// Test Google OAuth Credentials
console.log('\n3. Testing Google OAuth Credentials...');
const googleClientId = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;

if (googleClientId) {
    console.log('   ✅ GOOGLE_CLIENT_ID found');
} else {
    console.log('   ❌ GOOGLE_CLIENT_ID not found');
}

if (googleClientSecret) {
    console.log('   ✅ GOOGLE_CLIENT_SECRET found');
} else {
    console.log('   ❌ GOOGLE_CLIENT_SECRET not found');
}

console.log('\n4. Testing Environment Variables File...');
const envPath = path.resolve(__dirname, '.env.local');
if (fs.existsSync(envPath)) {
    console.log('   ✅ .env.local file exists');
    const envContent = fs.readFileSync(envPath, 'utf8');
    if (envContent.includes('DEEPSEEK_API_KEY') && envContent.includes('GEMINI_API_KEY')) {
        console.log('   ✅ Required API keys present in file');
    } else {
        console.log('   ❌ Required API keys missing in file');
    }
} else {
    console.log('   ❌ .env.local file not found');
}

console.log('\n📋 Summary:');
if (deepseekKey && geminiKey && googleClientId && googleClientSecret) {
    console.log('   ✅ All required environment variables are configured');
    console.log('   🚀 Ready for testing AI functionality');
} else {
    console.log('   ❌ Some environment variables are missing');
    console.log('   📝 Please check your .env.local file');
}