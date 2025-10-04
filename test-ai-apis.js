// Test script to verify AI APIs are working properly
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

async function testDeepSeekAPI() {
    console.log('🔬 Testing DeepSeek API...');

    const deepseekKey = process.env.DEEPSEEK_API_KEY;
    if (!deepseekKey) {
        console.log('   ❌ DEEPSEEK_API_KEY not found');
        return false;
    }

    try {
        const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${deepseekKey}`,
            },
            body: JSON.stringify({
                model: 'deepseek-chat',
                messages: [
                    {
                        role: 'user',
                        content: 'Hello, this is a test message. Please respond with "Test successful" and nothing else.'
                    }
                ],
                max_tokens: 50,
                temperature: 0.7
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const content = data.choices[0]?.message?.content || '';
            console.log('   ✅ DeepSeek API is working');
            console.log('   📝 Response:', content.substring(0, 50) + (content.length > 50 ? '...' : ''));
            return true;
        } else {
            const errorText = await response.text();
            console.log('   ❌ DeepSeek API error:', response.status, errorText);
            return false;
        }
    } catch (error) {
        console.log('   ❌ DeepSeek API connection error:', error.message);
        return false;
    }
}

async function testGeminiAPI() {
    console.log('\n🔬 Testing Gemini API...');

    const geminiKey = process.env.GEMINI_API_KEY;
    if (!geminiKey) {
        console.log('   ❌ GEMINI_API_KEY not found');
        return false;
    }

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${geminiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: 'Hello, this is a test message. Please respond with "Test successful" and nothing else.'
                    }]
                }]
            }),
        });

        if (response.ok) {
            const data = await response.json();
            const content = data.candidates[0]?.content?.parts[0]?.text || '';
            console.log('   ✅ Gemini API is working');
            console.log('   📝 Response:', content.substring(0, 50) + (content.length > 50 ? '...' : ''));
            return true;
        } else {
            const errorText = await response.text();
            console.log('   ❌ Gemini API error:', response.status, errorText);
            return false;
        }
    } catch (error) {
        console.log('   ❌ Gemini API connection error:', error.message);
        return false;
    }
}

async function main() {
    console.log('🔍 Testing AI API Functionality...\n');

    const deepseekWorking = await testDeepSeekAPI();
    const geminiWorking = await testGeminiAPI();

    console.log('\n📋 Summary:');
    if (deepseekWorking && geminiWorking) {
        console.log('   ✅ Both AI APIs are working correctly');
        console.log('   🚀 AI functionality should work properly');
    } else if (deepseekWorking) {
        console.log('   ⚠️  Only DeepSeek API is working');
        console.log('   🔄 Fallback to DeepSeek will be used');
    } else if (geminiWorking) {
        console.log('   ⚠️  Only Gemini API is working');
        console.log('   🔄 Primary Gemini provider will be used');
    } else {
        console.log('   ❌ Neither AI API is working');
        console.log('   🛠️  Please check your API keys and network connection');
    }
}

main().catch(console.error);