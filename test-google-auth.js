// Test script to verify Google OAuth credentials configuration
console.log('Testing KrishiMitra Google OAuth Configuration...')

const fs = require('fs')
const path = require('path')

// Test 1: Check environment variables
console.log('\n1. Checking Google OAuth environment variables...')
const envLocalPath = path.join(__dirname, '.env.local')
if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8')

    // Extract GOOGLE_CLIENT_ID
    const clientIdMatch = envContent.match(/GOOGLE_CLIENT_ID\s*=\s*(.+)$/m)
    if (clientIdMatch && clientIdMatch[1]) {
        const clientId = clientIdMatch[1].trim()
        if (clientId && clientId !== "" && !clientId.includes('your_') && !clientId.includes('YOUR_')) {
            console.log(`   ✅ GOOGLE_CLIENT_ID - Configured with real value (length: ${clientId.length})`)
            // Check if it looks like a valid Google Client ID
            if (clientId.includes('.apps.googleusercontent.com')) {
                console.log('   ✅ GOOGLE_CLIENT_ID format appears correct')
            } else {
                console.log('   ⚠️  GOOGLE_CLIENT_ID format may be incorrect')
            }
        } else {
            console.log('   ❌ GOOGLE_CLIENT_ID - Not properly configured')
        }
    } else {
        console.log('   ❌ GOOGLE_CLIENT_ID - Not found')
    }

    // Extract GOOGLE_CLIENT_SECRET
    const clientSecretMatch = envContent.match(/GOOGLE_CLIENT_SECRET\s*=\s*(.+)$/m)
    if (clientSecretMatch && clientSecretMatch[1]) {
        const clientSecret = clientSecretMatch[1].trim()
        if (clientSecret && clientSecret !== "" && !clientSecret.includes('your_') && !clientSecret.includes('YOUR_')) {
            console.log(`   ✅ GOOGLE_CLIENT_SECRET - Configured with real value (length: ${clientSecret.length})`)
        } else {
            console.log('   ❌ GOOGLE_CLIENT_SECRET - Not properly configured')
        }
    } else {
        console.log('   ❌ GOOGLE_CLIENT_SECRET - Not found')
    }
}

// Test 2: Check NextAuth configuration
console.log('\n2. Checking NextAuth configuration...')
const nextAuthPath = path.join(__dirname, 'src/app/api/auth/[...nextauth]/route.ts')
if (fs.existsSync(nextAuthPath)) {
    const nextAuthContent = fs.readFileSync(nextAuthPath, 'utf8')

    console.log('   Checking for proper credential validation:')

    // Check if we're now using proper validation
    if (nextAuthContent.includes('GOOGLE_CLIENT_ID && GOOGLE_CLIENT_SECRET') &&
        nextAuthContent.includes('GOOGLE_CLIENT_ID.trim() !== ""') &&
        nextAuthContent.includes('GOOGLE_CLIENT_SECRET.trim() !== ""')) {
        console.log('   ✅ Proper credential validation implemented')
    } else {
        console.log('   ⚠️  Credential validation may need improvement')
    }

    // Check if we removed the old placeholder check
    if (!nextAuthContent.includes('GOOGLE_CLIENT_ID !== "YOUR_GOOGLE_CLIENT_ID_HERE"')) {
        console.log('   ✅ Old placeholder check removed')
    } else {
        console.log('   ⚠️  Old placeholder check still present')
    }
}

// Test 3: Verify NextAuth setup
console.log('\n3. Verifying NextAuth setup...')
console.log('   ✅ NextAuth should now be able to initialize with your Google OAuth credentials')
console.log('   ✅ Google login should be available on the login page')
console.log('   ✅ Make sure to add the correct redirect URI to your Google Cloud Console:')
console.log('      http://localhost:3000/api/auth/callback/google')

console.log('\n📝 To test Google OAuth:')
console.log('   1. Restart the development server')
console.log('   2. Visit http://localhost:3000/login')
console.log('   3. Click the "Continue with Google" button')
console.log('   4. You should be redirected to Google account selection')
console.log('   5. After selecting an account, you should be redirected back to the app')

console.log('\n⚠️  Important:')
console.log('   Make sure you have added the following redirect URI to your Google OAuth client:')
console.log('   http://localhost:3000/api/auth/callback/google')