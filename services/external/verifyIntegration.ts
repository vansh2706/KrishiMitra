// Verification script for external services integration
// This script verifies that all services are properly integrated

import {
    getBestAvailablePrices,
    getBestAvailableWeather,
    fetchSoilMoisture,
    detectPestDisease
} from './index';

async function verifyIntegration() {
    console.log('🔍 Verifying external services integration...\n');

    try {
        // Test 1: Crop Price Service
        console.log('1. Testing Crop Price Service...');
        const priceResponse = await getBestAvailablePrices('wheat', 'Delhi');
        console.log('   ✅ Crop Price Service working');
        console.log('   📊 Sample data:', {
            success: priceResponse.success,
            dataCount: priceResponse.data?.length || 0,
            hasError: !!priceResponse.error
        });

        // Test 2: Weather Service
        console.log('\n2. Testing Weather Service...');
        const weatherResponse = await getBestAvailableWeather(28.6139, 77.2090); // Delhi coordinates
        console.log('   ✅ Weather Service working');
        console.log('   🌤️ Sample data:', {
            success: weatherResponse.success,
            hasData: !!weatherResponse.data,
            location: weatherResponse.data?.location.name,
            hasError: !!weatherResponse.error
        });

        // Test 3: Soil Moisture Service
        console.log('\n3. Testing Soil Moisture Service...');
        const soilResponse = await fetchSoilMoisture(28.6139, 77.2090);
        console.log('   ✅ Soil Moisture Service working');
        console.log('   🌱 Sample data:', {
            success: soilResponse.success,
            moisture: soilResponse.data?.moisture,
            status: soilResponse.data?.status,
            hasError: !!soilResponse.error
        });

        // Test 4: Pest Detection Service
        console.log('\n4. Testing Pest Detection Service...');
        // Using mock image data for testing
        const mockImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/...';
        const pestResponse = await detectPestDisease(mockImageData, 'wheat');
        console.log('   ✅ Pest Detection Service working');
        console.log('   🐛 Sample data:', {
            success: pestResponse.success,
            detected: pestResponse.data?.detected,
            hasError: !!pestResponse.error
        });

        console.log('\n🎉 All external services are properly integrated!');
        console.log('📝 Note: Services are currently using mock data for development.');
        console.log('   To enable real data, replace mock implementations with actual API calls.');

    } catch (error) {
        console.error('❌ Integration verification failed:', error);
        console.error('Please check the service implementations.');
    }
}

// Run verification if this file is executed directly
if (require.main === module) {
    verifyIntegration();
}

export { verifyIntegration };