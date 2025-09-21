// Weather API integration for KrishiMitra
'use client'

export interface WeatherData {
  name: string
  current: {
    temp_c: number
    feels_like_c: number
    humidity: number
    wind_kph: number
    uv: number
    pressure_mb: number
  }
  main: {
    temp: number
    feels_like: number
    temp_min: number
    temp_max: number
    pressure: number
    humidity: number
  }
  weather: Array<{
    main: string
    description: string
    icon: string
  }>
  wind: {
    speed: number
    deg: number
  }
  rain?: {
    '1h': number
  }
  clouds: {
    all: number
  }
  visibility: number
  sys: {
    sunrise: number
    sunset: number
    country: string
  }
  coord: {
    lat: number
    lon: number
  }
}

export interface WeatherError {
  message: string
}

// Mock weather data for development
const mockWeatherData: WeatherData = {
  name: 'Delhi',
  current: {
    temp_c: 28,
    feels_like_c: 30,
    humidity: 65,
    wind_kph: 12,
    uv: 6,
    pressure_mb: 1013
  },
  main: {
    temp: 28,
    feels_like: 30,
    temp_min: 24,
    temp_max: 32,
    pressure: 1013,
    humidity: 65
  },
  weather: [
    {
      main: 'Clouds',
      description: 'partly cloudy',
      icon: '02d'
    }
  ],
  wind: {
    speed: 12,
    deg: 45
  },
  rain: {
    '1h': 0
  },
  clouds: {
    all: 40
  },
  visibility: 10000,
  sys: {
    sunrise: 1702008000, // Unix timestamp
    sunset: 1702047600,  // Unix timestamp
    country: 'IN'
  },
  coord: {
    lat: 28.6139,
    lon: 77.2090
  }
}

// Get weather by coordinates (latitude, longitude)
export async function getWeatherByCoordinates(lat: number, lon: number): Promise<WeatherData | WeatherError> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      console.warn('OpenWeatherMap API key not found, using mock data')
      // Create more realistic mock data based on coordinates
      const mockData = {
        ...mockWeatherData,
        name: 'Your Location',
        coord: { lat, lon }
      }
      return mockData
    }

    // Use the proxy API to fetch weather data by coordinates
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        protocol: 'https',
        origin: 'api.openweathermap.org',
        path: `/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric`,
        method: 'GET'
      })
    })

    if (!response.ok) {
      throw new Error(`Weather API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      return { message: data.error }
    }

    if (data.cod && data.cod !== 200) {
      return { message: data.message || 'Weather data not available' }
    }

    // Transform OpenWeatherMap response to our WeatherData interface
    const weatherData: WeatherData = {
      name: data.name,
      current: {
        temp_c: data.main.temp,
        feels_like_c: data.main.feels_like,
        humidity: data.main.humidity,
        wind_kph: (data.wind?.speed || 0) * 3.6, // Convert m/s to km/h
        uv: 0, // OpenWeatherMap doesn't provide UV in basic plan
        pressure_mb: data.main.pressure
      },
      main: {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        pressure: data.main.pressure,
        humidity: data.main.humidity
      },
      weather: data.weather || [{
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }],
      wind: {
        speed: (data.wind?.speed || 0) * 3.6, // Convert m/s to km/h
        deg: data.wind?.deg || 0
      },
      rain: data.rain,
      clouds: data.clouds || { all: 0 },
      visibility: data.visibility || 10000,
      sys: data.sys || {
        sunrise: Date.now() / 1000,
        sunset: Date.now() / 1000 + 12 * 3600,
        country: 'Unknown'
      },
      coord: data.coord || { lat, lon }
    }

    return weatherData
  } catch (error) {
    console.error('Weather API error:', error)
    return {
      message: `Failed to fetch weather data for your location. Please check your internet connection and try again.`
    }
  }
}

// Real implementation using OpenWeatherMap API
export async function getWeatherByCity(city: string): Promise<WeatherData | WeatherError> {
  try {
    const apiKey = process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY || process.env.OPENWEATHER_API_KEY
    if (!apiKey) {
      console.warn('OpenWeatherMap API key not found, using mock data')
      return {
        ...mockWeatherData,
        name: city
      }
    }

    // Use the proxy API to fetch weather data
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        protocol: 'https',
        origin: 'api.openweathermap.org',
        path: `/data/2.5/weather?q=${encodeURIComponent(city)}&units=metric`,
        method: 'GET'
      })
    })

    if (!response.ok) {
      if (response.status === 404) {
        return { message: `City "${city}" not found. Please check the spelling and try again.` }
      }
      throw new Error(`Weather API request failed with status ${response.status}`)
    }

    const data = await response.json()

    if (data.error) {
      return { message: data.error }
    }

    if (data.cod && data.cod !== 200) {
      return { message: data.message || 'Weather data not available' }
    }

    // Transform OpenWeatherMap response to our WeatherData interface
    const weatherData: WeatherData = {
      name: data.name,
      current: {
        temp_c: data.main.temp,
        feels_like_c: data.main.feels_like,
        humidity: data.main.humidity,
        wind_kph: (data.wind?.speed || 0) * 3.6, // Convert m/s to km/h
        uv: 0, // OpenWeatherMap doesn't provide UV in basic plan
        pressure_mb: data.main.pressure
      },
      main: {
        temp: data.main.temp,
        feels_like: data.main.feels_like,
        temp_min: data.main.temp_min,
        temp_max: data.main.temp_max,
        pressure: data.main.pressure,
        humidity: data.main.humidity
      },
      weather: data.weather || [{
        main: 'Clear',
        description: 'clear sky',
        icon: '01d'
      }],
      wind: {
        speed: (data.wind?.speed || 0) * 3.6, // Convert m/s to km/h
        deg: data.wind?.deg || 0
      },
      rain: data.rain,
      clouds: data.clouds || { all: 0 },
      visibility: data.visibility || 10000,
      sys: data.sys || {
        sunrise: Date.now() / 1000,
        sunset: Date.now() / 1000 + 12 * 3600,
        country: 'Unknown'
      },
      coord: data.coord || { lat: 0, lon: 0 }
    }

    return weatherData
  } catch (error) {
    console.error('Weather API error:', error)
    // Return error message instead of always falling back to mock
    return {
      message: `Failed to fetch weather data for ${city}. Please check your internet connection and try again.`
    }
  }
}

// Get user's current location using browser geolocation API
export function getCurrentLocation(): Promise<{ lat: number; lon: number } | { error: string }> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) {
      resolve({ error: 'Geolocation is not supported by this browser' })
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          lat: position.coords.latitude,
          lon: position.coords.longitude
        })
      },
      (error) => {
        let errorMessage = 'Unable to retrieve location'
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user'
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable'
            break
          case error.TIMEOUT:
            errorMessage = 'Location request timed out'
            break
        }
        resolve({ error: errorMessage })
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    )
  })
}

export function isWeatherError(data: any): data is WeatherError {
  return data && typeof data === 'object' && 'message' in data
}

export function getWeatherIconUrl(iconCode: string): string {
  return `https://openweathermap.org/img/wn/${iconCode}@2x.png`
}

export function formatTemperature(temp: number, unit: 'c' | 'f' = 'c'): string {
  return `${Math.round(temp)}°${unit.toUpperCase()}`
}

// Weather condition descriptions for agricultural context
export function getWeatherDescription(condition: string, language: string = 'en'): string {
  const descriptions: Record<string, Record<string, string>> = {
    'Sunny': {
      en: 'Clear skies - Good for outdoor farming activities',
      hi: 'साफ आसमान - बाहरी कृषि गतिविधियों के लिए अच्छा'
    },
    'Partly Cloudy': {
      en: 'Mixed conditions - Suitable for most farming tasks',
      hi: 'मिश्रित स्थिति - अधिकांश कृषि कार्यों के लिए उपयुक्त'
    },
    'Cloudy': {
      en: 'Overcast skies - Good for soil work and planting',
      hi: 'बादलों से घिरा आसमान - मिट्टी के काम और रोपण के लिए अच्छा'
    },
    'Light Rain': {
      en: 'Gentle rainfall - Perfect for irrigation and crop growth',
      hi: 'हल्की बारिश - सिंचाई और फसल वृद्धि के लिए आदर्श'
    },
    'Heavy Rain': {
      en: 'Heavy rainfall - Avoid field work, check drainage',
      hi: 'भारी बारिश - खेत का काम न करें, जल निकासी जांचें'
    },
    'Thunderstorm': {
      en: 'Storm conditions - Stay indoors, protect crops',
      hi: 'तूफान की स्थिति - घर के अंदर रहें, फसलों की सुरक्षा करें'
    }
  }

  return descriptions[condition]?.[language] || condition
}

// Agricultural weather alerts
export function getWeatherAlerts(weather: WeatherData, language: string = 'en'): string[] {
  const alerts: string[] = []

  if (weather.current.temp_c > 35) {
    alerts.push(language === 'hi'
      ? 'उच्च तापमान चेतावनी - फसलों को अधिक पानी दें'
      : 'High temperature alert - Increase watering for crops'
    )
  }

  if (weather.current.humidity < 30) {
    alerts.push(language === 'hi'
      ? 'कम आर्द्रता - मिट्टी की नमी की जांच करें'
      : 'Low humidity - Check soil moisture levels'
    )
  }

  if (weather.current.wind_kph > 25) {
    alerts.push(language === 'hi'
      ? 'तेज हवा - नाजुक पौधों की सुरक्षा करें'
      : 'Strong winds - Protect delicate plants'
    )
  }

  if (weather.current.uv > 8) {
    alerts.push(language === 'hi'
      ? 'उच्च UV सूचकांक - सुबह या शाम के समय काम करें'
      : 'High UV index - Work during morning or evening hours'
    )
  }

  return alerts
}
