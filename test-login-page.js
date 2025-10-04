// Simple test script to verify login page functionality
console.log('Testing KrishiMitra Login Page...')

// Test 1: Check if required files exist
const fs = require('fs')
const path = require('path')

const requiredFiles = [
    'src/app/login/page.tsx',
    'src/components/SimpleLoginPage.tsx',
    'src/app/api/auth/[...nextauth]/route.ts'
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

// Test 2: Check environment variables
console.log('\n2. Checking environment variables...')
const envExamplePath = path.join(__dirname, 'env.local.example')
if (fs.existsSync(envExamplePath)) {
    const envContent = fs.readFileSync(envExamplePath, 'utf8')
    const requiredVars = [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'NEXTAUTH_SECRET'
    ]

    console.log('   Checking for required environment variables in env.local.example:')
    for (const envVar of requiredVars) {
        if (envContent.includes(envVar)) {
            console.log(`   ✅ ${envVar} - Present`)
        } else {
            console.log(`   ⚠️  ${envVar} - Missing (add to .env.local)`)
        }
    }
} else {
    console.log(`   ❌ env.local.example - Missing`)
}

// Test 3: Check for key components in login page
console.log('\n3. Checking login page components...')
const loginPagePath = path.join(__dirname, 'src/app/login/page.tsx')
if (fs.existsSync(loginPagePath)) {
    const loginPageContent = fs.readFileSync(loginPagePath, 'utf8')

    const requiredComponents = [
        'handleGoogleLogin',
        'GoogleIcon',
        'LoginPageContent',
        'useSession'
    ]

    console.log('   Checking for required components:')
    for (const component of requiredComponents) {
        if (loginPageContent.includes(component)) {
            console.log(`   ✅ ${component} - Found`)
        } else {
            console.log(`   ❌ ${component} - Missing`)
        }
    }
}

console.log('\n✅ Login page tests completed!')
console.log('\n📝 To test the login page in browser:')
console.log('   1. Ensure the development server is running (npm run dev)')
console.log('   2. Visit http://localhost:3000/login')
console.log('   3. Test both mobile and email login methods')
console.log('   4. Test Google login functionality')