# 🌾 KrishiMitra - AI-Powered Agricultural Assistant

KrishiMitra is a comprehensive agricultural assistance application that provides farmers with AI-powered tools for better crop management, pest detection, weather monitoring, and market analysis.

## ✨ Features

### 🔐 Enhanced Login System
- **Multi-Method Authentication**: Mobile number or email login
- **Google OAuth Integration**: One-click sign-in with Google accounts
- **Enhanced Security**: Advanced captcha system (math and text challenges)
- **Multi-Language Support**: Available in all 8 supported languages
- **User-Friendly Interface**: Intuitive design with clear feedback
- **Account Selection**: Google login prompts account selection for security

### 🤖 AI Advisor
- **8-Language Support**: English, Hindi, Tamil, Telugu, Bengali, Gujarati, Marathi, Punjabi
- **Voice Integration**: Speech-to-text and text-to-speech in multiple languages
- **Real-time Agricultural Advice**: Powered by DeepSeek (primary) and Google Gemini (fallback)
- **Farming Best Practices**: Crop-specific guidance and recommendations

### 🌤️ Weather Dashboard
- **Real-time Weather Data**: Current conditions and forecasts
- **Farming Alerts**: Weather-based agricultural warnings
- **Irrigation Planning**: Rainfall and humidity tracking
- **Seasonal Insights**: Long-term weather patterns
- **Soil Moisture Data**: Satellite-based soil moisture monitoring

### 🔍 Enhanced Pest Detection
- **AI-Powered Image Recognition**: Upload photos for pest identification
- **Camera Integration**: Real-time pest detection using device camera
- **Treatment Recommendations**: Organic and chemical treatment options
- **Prevention Strategies**: Proactive pest management advice
- **Crop-Specific Solutions**: Tailored recommendations for different crops
- **Predictive Alerts**: Weather-based pest outbreak predictions

### 📈 Enhanced Market Prices
- **15+ Indian Cities**: Real-time market data from major agricultural centers
- **22+ Crops Supported**: Comprehensive price tracking for major crops
- **Price Trends**: Historical data and market analysis
- **Profit Calculations**: Revenue optimization insights
- **Government API Integration**: Data from eNAM, AGMARKNET, and Data.gov.in

### 🌱 Soil Guide
- **16 Soil Types**: Comprehensive soil classification and management
- **Fertilizer Recommendations**: NPK and organic fertilizer guidance
- **pH Management**: Soil acidity and alkalinity optimization
- **Nutrient Analysis**: Soil health assessment tools

### 💰 Cost-Benefit Analysis
- **Profit Calculator**: ROI analysis for different crops
- **Input Cost Tracking**: Seed, fertilizer, and labor cost management
- **Revenue Projections**: Market-based income forecasting
- **Seasonal Planning**: Crop rotation and timing optimization

### 📝 Advisory Feedback
- **User Feedback Collection**: Continuous improvement through farmer input
- **Experience Rating**: Service quality assessment
- **Suggestion System**: Feature requests and improvements

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- API keys for external services (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd krishimitra
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` and add your API keys:
   ```env
   OPENWEATHER_API_KEY=your_openweather_api_key
   DEEPSEEK_API_KEY=your_deepseek_api_key
   GEMINI_API_KEY=your_google_gemini_api_key
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   NEXTAUTH_SECRET=your_nextauth_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Building for Production

```bash
npm run build
npm run start
```

### Static Export (for deployment)

```bash
npm run build
```

This will generate a static version in the `out` directory.

## 🏗️ Project Structure

```
krishimitra/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API routes
│   │   │   ├── agriculture-ai/ # Main AI service (DeepSeek primary)
│   │   │   ├── analyze-pest/   # Pest detection (DeepSeek primary)
│   │   │   ├── auth/           # Authentication routes (NextAuth)
│   │   │   ├── deepseek/       # DeepSeek chat proxy
│   │   │   ├── deepseek-vision/ # DeepSeek vision proxy
│   │   │   ├── gemini/         # Google Gemini chat proxy
│   │   │   ├── gemini-vision/  # Google Gemini vision proxy
│   │   │   ├── health/         # Health check endpoint
│   │   │   ├── logger/         # Logging endpoint
│   │   │   └── proxy/          # API proxy for external services
│   │   ├── fonts/              # Custom fonts
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   ├── login/              # Login page
│   │   └── page.tsx            # Main application page
│   ├── components/             # React components
│   │   ├── ui/                # Shadcn/ui components (35+ components)
│   │   ├── EnhancedChatBot.tsx
│   │   ├── EnhancedMarketPrices.tsx
│   │   ├── EnhancedPestDetection.tsx
│   │   ├── WeatherDashboard.tsx
│   │   ├── SoilGuide.tsx
│   │   ├── CostBenefitAnalysis.tsx
│   │   ├── AdvisoryFeedback.tsx
│   │   └── SimpleLoginPage.tsx # Simple login component
│   ├── hooks/                  # Custom React hooks
│   │   ├── useLanguage.tsx     # Multi-language support
│   │   └── use-mobile.tsx      # Mobile detection
│   ├── lib/                    # Utility libraries
│   │   ├── logger.ts           # Winston logging
│   │   ├── offlineStorage.ts   # PWA offline support
│   │   ├── utils.ts            # Utility functions
│   │   └── weatherApi.ts       # Weather API integration
│   ├── services/               # External data services
│   │   └── external/           # Government and third-party API integrations
│   │       ├── cropPriceService.ts  # Crop price data integration
│   │       ├── weatherService.ts    # Weather and soil data integration
│   │       ├── pestService.ts       # Pest and disease detection
│   │       ├── index.ts             # Service exports
│   │       ├── testServices.ts      # Service testing utilities
│   │       └── INTEGRATION_SUMMARY.md # Integration documentation
│   ├── middleware.ts           # Next.js middleware
│   └── deepseek-api.ts        # AI API integration (primary)
├── public/                     # Static assets
│   ├── manifest.js            # PWA manifest
│   └── sw.js                  # Service worker
├── package.json               # Dependencies and scripts
├── tsconfig.json              # TypeScript configuration
├── tailwind.config.ts         # Tailwind CSS configuration
└── next.config.js             # Next.js configuration
```

## 🛠️ Technology Stack

### Frontend
- **Next.js 15.3.4** - React framework with App Router
- **React 19.1.0** - UI library
- **TypeScript 5.8.3** - Type safety
- **Tailwind CSS** - Styling framework
- **Shadcn/ui** - UI component library
- **Radix UI** - Accessible UI primitives
- **Lucide React** - Icon library

### Backend & APIs
- **Next.js API Routes** - Server-side functionality
- **NextAuth.js** - Authentication framework
- **Winston** - Logging system
- **DeepSeek API** - Primary AI-powered responses
- **Google Gemini API** - Image analysis and fallback AI service
- **Google Speech APIs** - Speech-to-text and text-to-speech
- **OpenWeatherMap** - Weather data
- **Government APIs** - eNAM, AGMARKNET, Data.gov.in for crop prices
- **Satellite APIs** - ISRO/MOSDAC, EOSDA for soil data
- **Proxy API** - Secure external API integration

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **PostCSS** - CSS processing
- **Autoprefixer** - CSS vendor prefixes

## 🌍 Multi-Language Support

KrishiMitra supports 8 languages with complete translations:
- 🇺🇸 English
- 🇮🇳 हिंदी (Hindi)
- 🇮🇳 தமிழ் (Tamil)
- 🇮🇳 తెలుగు (Telugu)
- 🇧🇩 বাংলা (Bengali)
- 🇮🇳 ગુજરાતી (Gujarati)
- 🇮🇳 मराठी (Marathi)
- 🇮🇳 ਪੰਜਾਬੀ (Punjabi)

**Translation Coverage**: 1800+ phrases across all components

## 🎯 Performance Features

- **PWA Support**: Offline functionality with service workers
- **Mobile Optimized**: Touch-friendly interface for mobile devices
- **Dark Mode**: Automatic theme switching
- **Voice Support**: Speech recognition and synthesis

## 🔐 Authentication & Security

KrishiMitra implements a robust authentication system with multiple login options:

### Login Methods
1. **Mobile Number**: Indian mobile number verification
2. **Email Address**: Standard email login
3. **Google OAuth**: One-click sign-in with Google accounts

### Security Features
- **Enhanced Captcha**: Math and text-based challenges
- **Input Validation**: Strict validation for all form fields
- **Session Management**: JWT-based session handling
- **Account Protection**: Account selection for Google login

For detailed information about the login system improvements, see [LOGIN_PAGE_IMPROVEMENTS.md](LOGIN_PAGE_IMPROVEMENTS.md)

## 📡 External Data Integration

KrishiMitra now integrates with multiple government and third-party agricultural data sources:

### Crop Price Data
- **eNAM (National Agriculture Market)** - Daily trade & price data
- **AGMARKNET** - Commodity-wise, Market-wise Daily Report
- **Data.gov.in** - Government "Current Daily Price of Various Commodities"
- **Farmonaut** - Real-time crop price service

### Weather & Soil Data
- **Farmonaut** - Weather & Satellite API
- **WeatherBit** - Agriculture Weather Forecast API
- **ISRO/MOSDAC** - Soil Moisture data via satellite
- **EOSDA** - Agriculture API for soil data

### Pest & Disease Data
- **IIIT-Allahabad AI** - Real-time crop disease detection
- **BOLLWM Dataset** - Bollworm pest monitoring
- **Citizen Reports** - Extension services and agricultural departments

For detailed information about the integration, see [INTEGRATION_SUMMARY.md](src/services/external/INTEGRATION_SUMMARY.md)

For implementation details on integrating real data sources, see [INTEGRATION_GUIDE.md](INTEGRATION_GUIDE.md)