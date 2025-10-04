const fetch = require('node-fetch');

async function testNemoAPI() {
    try {
        console.log('Testing NVIDIA NeMo API...');

        const response = await fetch('http://localhost:3001/api/nemo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                messages: [
                    { role: 'user', content: 'Hello, how are you?' }
                ]
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

testNemoAPI();