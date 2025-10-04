// Replit startup script for KrishiMitra
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Starting KrishiMitra on Replit...');

// Function to execute commands synchronously
function executeCommand(command, directory = '.') {
    return new Promise((resolve, reject) => {
        const child = exec(command, { cwd: directory }, (error, stdout, stderr) => {
            if (error) {
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });

        child.stdout.on('data', (data) => {
            process.stdout.write(data);
        });

        child.stderr.on('data', (data) => {
            process.stderr.write(data);
        });
    });
}

// Check if .env file exists, if not create it from .env.example
async function setupEnvironment() {
    if (!fs.existsSync('.env')) {
        console.log('📝 Creating .env file from .env.example...');
        if (fs.existsSync('.env.example')) {
            fs.copyFileSync('.env.example', '.env');
            console.log('✅ .env file created');
        } else {
            console.log('⚠️  .env.example not found, creating minimal .env file');
            fs.writeFileSync('.env', `
# Environment variables for Replit deployment
NEXTAUTH_URL=https://your-replit-app.repl.co
NEXTAUTH_SECRET=krishimitra_replit_secret_key_2025
NEXT_PUBLIC_APP_URL=https://your-replit-app.repl.co
NODE_ENV=production
      `.trim());
        }
    }
}

// Main startup function
async function startApp() {
    try {
        // Setup environment
        await setupEnvironment();

        // Install dependencies
        console.log('📦 Installing dependencies...');
        await executeCommand('npm install');
        console.log('✅ Dependencies installed successfully');

        // Build the application
        console.log('🔨 Building the application...');
        await executeCommand('npm run build');
        console.log('✅ Application built successfully');

        // Start the server
        console.log('🚀 Starting production server...');
        console.log('📝 Server will be available at https://your-replit-app.repl.co');
        console.log('⚠️  Note: You need to replace "your-replit-app" with your actual Replit app name');

        // Start the application
        await executeCommand('npm run start');

    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Run the application
startApp();