#!/usr/bin/env node

// Script to verify Vercel deployment configuration for KrishiMitra
const fs = require('fs');
const path = require('path');

console.log('🔍 Verifying Vercel Deployment Configuration for KrishiMitra...\n');

// Check 1: vercel.json file
console.log('1. Checking vercel.json configuration...');
const vercelJsonPath = path.join(__dirname, '../vercel.json');
if (fs.existsSync(vercelJsonPath)) {
    try {
        const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
        console.log('   ✅ vercel.json found');

        // Check if env section exists
        if (vercelJson.env) {
            console.log('   ✅ Environment variables section found');

            // Check for NEXTAUTH_URL
            if (vercelJson.env.NEXTAUTH_URL) {
                console.log(`   ✅ NEXTAUTH_URL configured: ${vercelJson.env.NEXTAUTH_URL}`);
            } else {
                console.log('   ⚠️  NEXTAUTH_URL not found in vercel.json env section');
            }
        } else {
            console.log('   ⚠️  No environment variables section found in vercel.json');
        }
    } catch (error) {
        console.log('   ❌ Error parsing vercel.json:', error.message);
    }
} else {
    console.log('   ❌ vercel.json not found');
}

// Check 2: Environment variables in .env.local
console.log('\n2. Checking .env.local for required variables...');
const envLocalPath = path.join(__dirname, '../.env.local');
if (fs.existsSync(envLocalPath)) {
    const envContent = fs.readFileSync(envLocalPath, 'utf8');
    console.log('   ✅ .env.local found');

    const requiredVars = [
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'NEXTAUTH_SECRET',
        'NEXTAUTH_URL'
    ];

    for (const varName of requiredVars) {
        const regex = new RegExp(`${varName}\\s*=\\s*(.+)$`, 'm');
        const match = envContent.match(regex);
        if (match && match[1]) {
            const value = match[1].trim();
            if (value && value !== "" && !value.includes('your_') && !value.includes('YOUR_')) {
                console.log(`   ✅ ${varName} - Configured`);
            } else {
                console.log(`   ⚠️  ${varName} - Using placeholder or empty value`);
            }
        } else {
            console.log(`   ❌ ${varName} - Not found`);
        }
    }
} else {
    console.log('   ❌ .env.local not found');
}

// Check 3: NextAuth configuration
console.log('\n3. Checking NextAuth configuration...');
const nextAuthPath = path.join(__dirname, '../src/app/api/auth/[...nextauth]/route.ts');
if (fs.existsSync(nextAuthPath)) {
    const nextAuthContent = fs.readFileSync(nextAuthPath, 'utf8');
    console.log('   ✅ NextAuth configuration file found');

    // Check for important configurations
    const checks = [
        { name: 'GoogleProvider import', check: nextAuthContent.includes('GoogleProvider') },
        { name: 'NEXTAUTH_URL handling', check: nextAuthContent.includes('NEXTAUTH_URL') },
        { name: 'VERCEL_URL handling', check: nextAuthContent.includes('VERCEL_URL') },
        { name: 'Redirect callback', check: nextAuthContent.includes('async redirect') },
        { name: 'Session callback', check: nextAuthContent.includes('async session') }
    ];

    for (const check of checks) {
        if (check.check) {
            console.log(`   ✅ ${check.name} - Found`);
        } else {
            console.log(`   ❌ ${check.name} - Missing`);
        }
    }
} else {
    console.log('   ❌ NextAuth configuration file not found');
}

// Check 4: Vercel deployment guide
console.log('\n4. Checking Vercel deployment documentation...');
const vercelDocPath = path.join(__dirname, '../VERCEL_DEPLOYMENT.md');
if (fs.existsSync(vercelDocPath)) {
    const vercelDocContent = fs.readFileSync(vercelDocPath, 'utf8');
    console.log('   ✅ Vercel deployment documentation found');

    // Check for important sections
    const checks = [
        { name: 'Environment variables section', check: vercelDocContent.includes('Environment Variables') },
        { name: 'Google OAuth variables', check: vercelDocContent.includes('GOOGLE_CLIENT_ID') && vercelDocContent.includes('GOOGLE_CLIENT_SECRET') },
        { name: 'NEXTAUTH_SECRET variable', check: vercelDocContent.includes('NEXTAUTH_SECRET') },
        { name: 'NEXTAUTH_URL variable', check: vercelDocContent.includes('NEXTAUTH_URL') },
        { name: 'Google login troubleshooting', check: vercelDocContent.includes('Google Login Issues') }
    ];

    for (const check of checks) {
        if (check.check) {
            console.log(`   ✅ ${check.name} - Found`);
        } else {
            console.log(`   ❌ ${check.name} - Missing`);
        }
    }
} else {
    console.log('   ❌ Vercel deployment documentation not found');
}

console.log('\n📋 Summary:');
console.log('   To ensure Google login works correctly on Vercel:');
console.log('   1. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in Vercel environment variables');
console.log('   2. Set NEXTAUTH_SECRET to a strong random string in Vercel environment variables');
console.log('   3. Set NEXTAUTH_URL to your deployed app URL in Vercel environment variables');
console.log('   4. Ensure redirect URIs are configured in Google Cloud Console:');
console.log('      https://your-app.vercel.app/api/auth/callback/google');
console.log('   5. Test the deployment after setting the environment variables');

console.log('\n✅ Verification complete!');