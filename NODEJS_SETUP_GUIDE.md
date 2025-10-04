# Node.js Setup Guide for Windows

## Overview
This guide will help you install Node.js on your Windows system to run the KrishiMitra project.

## Prerequisites
- Windows 7 or later (64-bit recommended)
- Administrator privileges for installation

## Installation Steps

### Step 1: Download Node.js
1. Visit the official Node.js download page: https://nodejs.org/en/download
2. For Windows, you'll see two options:
   - **LTS version** (Recommended for most users) - Most stable version
   - **Current version** - Latest features but may be less stable

3. Download the Windows Installer (.msi) for your system architecture:
   - For 64-bit systems: `node-v24.9.0-x64.msi`
   - For 32-bit systems: `node-v24.9.0-x86.msi`

### Step 2: Install Node.js
1. Locate the downloaded .msi file (usually in your Downloads folder)
2. Double-click the installer to start the installation
3. Follow the installation wizard:
   - Accept the license agreement
   - Choose the installation location (default is fine)
   - Select components (default selection is recommended)
   - Click "Install" and wait for the process to complete
   - Click "Finish" when installation is complete

### Step 3: Verify Installation
Open a new Command Prompt or PowerShell window and run:

```bash
node -v
npm -v
```

You should see version numbers for both Node.js and npm (Node Package Manager).

### Step 4: Run the KrishiMitra Project
Once Node.js is installed, navigate to your project directory and run:

```bash
cd "d:\sih project 1"
npm install
npm run dev
```

This will:
1. Install all project dependencies
2. Start the development server
3. Make the application available at http://localhost:3000

## Troubleshooting

### If you encounter permission errors:
- Run Command Prompt or PowerShell as Administrator
- Ensure your user account has write permissions to the project directory

### If the commands are not recognized:
- Restart your terminal/command prompt
- Ensure Node.js was added to your PATH during installation
- You may need to restart your computer

### If you have issues with npm install:
- Clear npm cache: `npm cache clean --force`
- Delete node_modules folder and package-lock.json file
- Run `npm install` again

## Alternative Installation Methods

### Using Node Version Manager (NVM) for Windows:
1. Download nvm-setup.zip from https://github.com/coreybutler/nvm-windows/releases
2. Extract and run the installer
3. Install Node.js using: `nvm install latest` or `nvm install lts`

### Using Chocolatey (if you have it installed):
```bash
choco install nodejs
```

## Next Steps
After successfully installing Node.js:
1. Open a new terminal in the project directory
2. Run `npm install` to install project dependencies
3. Run `npm run dev` to start the development server
4. Open your browser and navigate to http://localhost:3000 to view the application

## Useful Commands
- `npm run dev` - Start development server
- `npm run build` - Create a production build
- `npm run start` - Start production server
- `npm run lint` - Check for code issues
- `npm test` - Run tests (if configured)

## Additional Resources
- Node.js Documentation: https://nodejs.org/en/docs/
- npm Documentation: https://docs.npmjs.com/
- Next.js Documentation: https://nextjs.org/docs