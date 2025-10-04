// Simple test script to verify environment variables configuration
console.log('Testing KrishiMitra Environment Variables...')

// Test 1: Check if required files exist
const fs = require('fs')
const path = require('path')

const requiredFiles = [
    '.env.local',
    'env.local.example'
]

console.log('\n1. Checking required files...')
let allFilesExist = true
for (const file of requiredFiles) {
    const fullPath = path.join(__dirname, file)
    if (fs.existsSync(fullPath)) {
        console.log(`   ✅ ${file} - Found`)
    } else {
        console.log(`   ❌ ${file} - Missing`)
        allFilesExist = false
    }
}

if (!allFilesExist) {
    console.log('\n❌ Some required files are missing!')
    process.exit(1)
}

// Test 2: Check environment variables in .env.local
console.log('\n2. Checking environment variables in .env.local...')
const envLocalPath = path.join(__dirname, '.env.local')
if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8')

    const requiredVars = [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'NEXTAUTH_SECRET',
        'NEXTAUTH_URL'
    ]

    console.log('   Checking for required environment variables:')
    for (const envVar of requiredVars) {
        if (envContent.includes(envVar)) {
            // Check if it has a real value (not placeholder)
            const regex = new RegExp(`${envVar}\\s*=\\s*(.+)$`, 'm')
            const match = envContent.match(regex)
            if (match && match[1] && !match[1].includes('your_') && !match[1].includes('YOUR_') && match[1] !== '') {
                console.log(`   ✅ ${envVar} - Configured with real value`)
            } else {
                console.log(`   ⚠️  ${envVar} - Present but using placeholder value`)
            }
        } else {
            console.log(`   ❌ ${envVar} - Missing`)
        }
    }
}

// Test 3: Check environment variables in env.local.example
console.log('\n3. Checking environment variables in env.local.example...')
const envExamplePath = path.join(__dirname, 'env.local.example')
if (fs.existsSync(envExamplePath)) {
    const envExampleContent = fs.readFileSync(envExamplePath, 'utf8')

    const requiredVars = [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'NEXTAUTH_SECRET',
        'NEXTAUTH_URL'
    ]

    console.log('   Checking for required environment variables:')
    for (const envVar of requiredVars) {
        if (envExampleContent.includes(envVar)) {
            console.log(`   ✅ ${envVar} - Present in example file`)
        } else {
            console.log(`   ❌ ${envVar} - Missing from example file`)
        }
    }
}

// Test 4: Check NextAuth configuration
console.log('\n4. Checking NextAuth configuration...')
const nextAuthPath = path.join(__dirname, 'src/app/api/auth/[...nextauth]/route.ts')
if (fs.existsSync(nextAuthPath)) {
    const nextAuthContent = fs.readFileSync(nextAuthPath, 'utf8')

    const requiredElements = [
        'GoogleProvider',
        'clientId: process.env.GOOGLE_CLIENT_ID',
        'clientSecret: process.env.GOOGLE_CLIENT_SECRET',
        'secret: process.env.NEXTAUTH_SECRET'
    ]

    console.log('   Checking for required NextAuth configuration elements:')
    for (const element of requiredElements) {
        if (nextAuthContent.includes(element)) {
            console.log(`   ✅ ${element} - Found`)
        } else {
            console.log(`   ❌ ${element} - Missing`)
        }
    }
}

console.log('\n✅ Environment variables tests completed!')
console.log('\n📝 To fully configure the application:')
console.log('   1. Replace placeholder values in .env.local with actual credentials')
console.log('   2. For Google OAuth, create credentials in Google Cloud Console')
console.log('   3. For production, use a strong NEXTAUTH_SECRET')
console.log('   4. Restart the development server after making changes')