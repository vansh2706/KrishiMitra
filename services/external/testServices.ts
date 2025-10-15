// Test file for external services
// This file demonstrates how to use the external services

import {
    getBestAvailablePrices,
    getPriceTrends,
    getBestAvailableWeather,
    fetchSoilMoisture,
    detectPestDisease,
    getPestDiseaseInfo
} from './index';

// Test crop price services
async function testCropPrices() {
    console.log('Testing crop price services...');

    try {
        // Get current prices
        const prices = await getBestAvailablePrices('wheat', 'Delhi');
        console.log('Current prices:', prices);

        // Get price trends
        const trends = await getPriceTrends('wheat', 30);
        console.log('Price trends:', trends);
    } catch (error) {
        console.error('Error testing crop prices:', error);
    }
}

// Test weather services
async function testWeather() {
    console.log('Testing weather services...');

    try {
        // Get weather for Delhi
        const weather = await getBestAvailableWeather(28.6139, 77.2090);
        console.log('Weather data:', weather);

        // Get soil moisture
        const soil = await fetchSoilMoisture(28.6139, 77.2090);
        console.log('Soil moisture:', soil);
    } catch (error) {
        console.error('Error testing weather:', error);
    }
}

// Test pest detection services
async function testPestDetection() {
    console.log('Testing pest detection services...');

    try {
        // Test pest info retrieval
        const pestInfo = await getPestDiseaseInfo('pd001');
        console.log('Pest info:', pestInfo);

        // Test pest detection (with mock image data)
        const mockImageData = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/...';
        const detection = await detectPestDisease(mockImageData, 'wheat');
        console.log('Pest detection:', detection);
    } catch (error) {
        console.error('Error testing pest detection:', error);
    }
}

// Run all tests
export async function runAllTests() {
    console.log('Running all external service tests...');

    await testCropPrices();
    await testWeather();
    await testPestDetection();

    console.log('All tests completed!');
}

// Export individual test functions for selective testing
export { testCropPrices, testWeather, testPestDetection };