import { NextRequest } from 'next/server';

async function testNemoAPI() {
    try {
        console.log('Testing NVIDIA NeMo API...');

        // Check if API key exists
        const apiKey = process.env.NVIDIA_API_KEY;
        console.log('API Key exists:', !!apiKey);
        if (apiKey) {
            console.log('API Key length:', apiKey.length);
        }

        // Test the API endpoint directly
        const testMessages = [
            { role: 'user', content: 'Hello, how are you?' }
        ];

        const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: 'nvidia/nemotron-4-340b-instruct',
                messages: testMessages,
                temperature: 0.7,
                max_tokens: 100,
            }),
        });

        console.log('Response status:', response.status);
        console.log('Response ok:', response.ok);

        const responseText = await response.text();
        console.log('Response text:', responseText);

        if (response.ok) {
            const data = JSON.parse(responseText);
            console.log('Parsed response:', data);
        }
    } catch (error) {
        console.error('Error testing NVIDIA NeMo API:', error);
    }
}

// Run the test
testNemoAPI();