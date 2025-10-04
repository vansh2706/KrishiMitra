# KrishiMitra Replit Deployment Guide

## Deployment Instructions

1. Import this repository to Replit
2. The application will automatically start using the configuration files

## Configuration

The application uses the following environment variables:
- `NEXTAUTH_URL`: The URL of your Replit app
- `NEXTAUTH_SECRET`: A secret key for NextAuth
- `NEXT_PUBLIC_APP_URL`: The public URL of your app

These are automatically configured in the `.env` file.

## Required API Keys

To enable full functionality, you need to add the following API keys to your `.env` file:

1. **Google Gemini API Key** - For AI-powered responses
   - Get from: https://makersuite.google.com/app/apikey

2. **DeepSeek API Key** - For fallback AI responses
   - Get from: https://www.deepseek.com/

3. **OpenWeatherMap API Key** - For weather data
   - Get from: https://openweathermap.org/api

4. **Google OAuth Credentials** - For Google login
   - Get from: Google Cloud Console

## Running the Application

The application will automatically:
1. Install dependencies
2. Build the Next.js application
3. Start the development server on port 3000

## Accessing the Application

After deployment, your application will be accessible at:
`https://your-replit-app.repl.co`

## Troubleshooting

If you encounter issues:
1. Check the Replit console for error messages
2. Verify all required environment variables are set
3. Ensure API keys are valid and have sufficient quota