#!/usr/bin/env node

// Quick Deploy Script for KrishiMitra
const { execSync } = require('child_process');
const fs = require('fs');
const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

console.log('🌾 KrishiMitra Quick Deploy Script');
console.log('==================================\n');

async function askQuestion(question) {
    return new Promise((resolve) => {
        rl.question(question, resolve);
    });
}

async function main() {
    try {
        // Check if OpenAI API key is set
        console.log('📋 Checking environment setup...');

        if (!fs.existsSync('.env.local')) {
            console.log('❌ .env.local file not found!');
            console.log('Please create .env.local with your API keys first.');
            process.exit(1);
        }

        const envContent = fs.readFileSync('.env.local', 'utf8');
        const hasRealOpenAIKey = envContent.includes('sk-') && !envContent.includes('sk-abcdef');

        if (!hasRealOpenAIKey) {
            console.log('⚠️  Warning: Using placeholder OpenAI API key');
            const addKey = await askQuestion('Do you want to add your real OpenAI API key now? (y/n): ');

            if (addKey.toLowerCase() === 'y') {
                const apiKey = await askQuestion('Enter your OpenAI API key (starts with sk-): ');

                if (apiKey.startsWith('sk-')) {
                    const updatedEnv = envContent
                        .replace(/OPENAI_API_KEY=.*/g, `OPENAI_API_KEY=${apiKey}`)
                        .replace(/NEXT_PUBLIC_OPENAI_API_KEY=.*/g, `NEXT_PUBLIC_OPENAI_API_KEY=${apiKey}`);

                    fs.writeFileSync('.env.local', updatedEnv);
                    console.log('✅ OpenAI API key updated!');
                } else {
                    console.log('❌ Invalid API key format');
                }
            }
        } else {
            console.log('✅ OpenAI API key configured');
        }

        // Check build
        console.log('\n🏗️  Testing build...');
        execSync('npm run build', { stdio: 'inherit' });
        console.log('✅ Build successful!');

        // Choose deployment platform
        console.log('\n🚀 Choose deployment platform:');
        console.log('1. Vercel (Recommended - Easiest)');
        console.log('2. Netlify (Static hosting)');
        console.log('3. Railway (Container deployment)');
        console.log('4. Manual (Show instructions)');

        const choice = await askQuestion('\nEnter your choice (1-4): ');

        switch (choice) {
            case '1':
                await deployToVercel();
                break;
            case '2':
                await deployToNetlify();
                break;
            case '3':
                await deployToRailway();
                break;
            case '4':
                showManualInstructions();
                break;
            default:
                console.log('❌ Invalid choice');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    } finally {
        rl.close();
    }
}

async function deployToVercel() {
    console.log('\n🔷 Deploying to Vercel...');

    try {
        // Check if vercel is installed
        execSync('vercel --version', { stdio: 'pipe' });
        console.log('✅ Vercel CLI found');
    } catch {
        console.log('📦 Installing Vercel CLI...');
        execSync('npm install -g vercel', { stdio: 'inherit' });
    }

    console.log('\n🚀 Starting deployment...');
    console.log('Follow the prompts:');
    console.log('- Set up and deploy? Y');
    console.log('- Which scope? [Choose your account]');
    console.log('- Link to existing project? N');
    console.log('- Project name? krishimitra');
    console.log('- Directory? ./');

    execSync('vercel', { stdio: 'inherit' });

    console.log('\n⚠️  Important: Don\'t forget to set environment variables in Vercel dashboard!');
    console.log('Go to: https://vercel.com/dashboard → Your Project → Settings → Environment Variables');
    console.log('Add:');
    console.log('- OPENWEATHER_API_KEY=bd5e378503939ddaee76f12ad7a97608');
    console.log('- OPENAI_API_KEY=your_openai_key');
    console.log('- NEXT_PUBLIC_OPENAI_API_KEY=your_openai_key');
    console.log('- NODE_ENV=production');
}

async function deployToNetlify() {
    console.log('\n🔶 Deploying to Netlify...');

    try {
        execSync('netlify --version', { stdio: 'pipe' });
        console.log('✅ Netlify CLI found');
    } catch {
        console.log('📦 Installing Netlify CLI...');
        execSync('npm install -g netlify-cli', { stdio: 'inherit' });
    }

    console.log('🏗️  Building for Netlify...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log('🚀 Deploying...');
    execSync('netlify deploy --prod --dir=.next', { stdio: 'inherit' });

    console.log('\n⚠️  Set environment variables in Netlify dashboard!');
}

async function deployToRailway() {
    console.log('\n🚂 Deploying to Railway...');

    try {
        execSync('railway --version', { stdio: 'pipe' });
        console.log('✅ Railway CLI found');
    } catch {
        console.log('📦 Installing Railway CLI...');
        execSync('npm install -g @railway/cli', { stdio: 'inherit' });
    }

    execSync('railway login', { stdio: 'inherit' });
    execSync('railway init', { stdio: 'inherit' });

    console.log('🔧 Setting environment variables...');
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');

    for (const line of lines) {
        if (line.includes('=') && !line.startsWith('#')) {
            const [key, value] = line.split('=');
            if (key && value) {
                try {
                    execSync(`railway variables set ${key}=${value}`, { stdio: 'pipe' });
                    console.log(`✅ Set ${key}`);
                } catch (e) {
                    console.log(`⚠️  Failed to set ${key}`);
                }
            }
        }
    }

    console.log('🚀 Deploying...');
    execSync('railway up', { stdio: 'inherit' });
}

function showManualInstructions() {
    console.log('\n📖 Manual Deployment Instructions:');
    console.log('\n1. For Vercel:');
    console.log('   npx vercel');
    console.log('\n2. For Netlify:');
    console.log('   npm run build && netlify deploy --prod --dir=.next');
    console.log('\n3. For Railway:');
    console.log('   railway login && railway init && railway up');
    console.log('\n4. For Docker:');
    console.log('   docker build -t krishimitra .');
    console.log('   docker run -p 3000:3000 krishimitra');
    console.log('\n📋 See DEPLOYMENT_GUIDE.md for detailed instructions');
}

if (require.main === module) {
    main();
}

module.exports = { main };