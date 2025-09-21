export default {
    "name": "KrishiMitra - कृषिमित्र",
    "short_name": "KrishiMitra",
    "description": "AI-powered multilingual agricultural assistant for farmers",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#10b981",
    "theme_color": "#10b981",
    "orientation": "portrait-primary",
    "scope": "/",
    "lang": "en",
    "icons": [
        {
            "src": "/favicon.ico",
            "sizes": "16x16 32x32 48x48",
            "type": "image/x-icon"
        },
        {
            "src": "/icon-192.png",
            "sizes": "192x192",
            "type": "image/png",
            "purpose": "maskable any"
        },
        {
            "src": "/icon-512.png",
            "sizes": "512x512",
            "type": "image/png",
            "purpose": "maskable any"
        }
    ],
    "categories": ["agriculture", "productivity", "utilities"],
    "screenshots": [
        {
            "src": "/screenshot-wide.png",
            "sizes": "1280x720",
            "type": "image/png",
            "form_factor": "wide"
        },
        {
            "src": "/screenshot-narrow.png",
            "sizes": "750x1334",
            "type": "image/png",
            "form_factor": "narrow"
        }
    ],
    "related_applications": [],
    "prefer_related_applications": false,
    "shortcuts": [
        {
            "name": "AI Advisor",
            "short_name": "Advisor",
            "description": "Chat with KrishiMitra AI advisor",
            "url": "/?tab=chat",
            "icons": [
                {
                    "src": "/favicon.ico",
                    "sizes": "32x32"
                }
            ]
        },
        {
            "name": "Weather",
            "short_name": "Weather",
            "description": "Check weather and farming alerts",
            "url": "/?tab=weather",
            "icons": [
                {
                    "src": "/favicon.ico",
                    "sizes": "32x32"
                }
            ]
        },
        {
            "name": "Market Prices",
            "short_name": "Prices",
            "description": "View current crop market prices",
            "url": "/?tab=market",
            "icons": [
                {
                    "src": "/favicon.ico",
                    "sizes": "32x32"
                }
            ]
        }
    ]
};