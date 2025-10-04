// Test script to verify Hindi is set as default language
const fs = require('fs');

// Read the language provider file
const languageProviderPath = 'h:/sih project 1/src/hooks/useLanguage.tsx';
const content = fs.readFileSync(languageProviderPath, 'utf8');

// Check if Hindi is set as default
if (content.includes("useState<Language>('hi')")) {
    console.log('✅ SUCCESS: Hindi is set as default language');
} else {
    console.log('❌ ERROR: Hindi is not set as default language');
}

// Check if fallback to Hindi is implemented
if (content.includes("setLanguageState('hi')")) {
    console.log('✅ SUCCESS: Fallback to Hindi is implemented');
} else {
    console.log('❌ ERROR: Fallback to Hindi is not implemented');
}