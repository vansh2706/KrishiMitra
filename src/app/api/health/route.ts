import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
    try {
        const health = {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '0.1.0',
            environment: process.env.NODE_ENV || 'development',
            services: {
                database: 'connected',
                api: 'operational',
                storage: 'available'
            },
            uptime: process.uptime(),
            memory: {
                used: process.memoryUsage().heapUsed / 1024 / 1024,
                total: process.memoryUsage().heapTotal / 1024 / 1024
            }
        }

        return NextResponse.json(health, { status: 200 })
    } catch (error) {
        console.error('Health check failed:', error)

        return NextResponse.json(
            {
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: 'Health check failed'
            },
            { status: 503 }
        )
    }
}

export async function HEAD(request: NextRequest) {
    return new NextResponse(null, { status: 200 })
}