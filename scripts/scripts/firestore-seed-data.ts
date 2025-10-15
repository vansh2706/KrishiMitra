// Firestore Seed Data - Used by /api/seed endpoint
// This file contains the initial data to populate Firestore
// No firebase-admin needed - we use the client SDK via API routes

export const seedData = {
  crops: [
    {
      name: 'Rice',
      type: 'Cereal',
      season: 'Kharif',
      sowingMonths: '6,7,8',
      harvestMonths: '11,12',
      waterRequirement: 'High',
      soilTypes: ['Clay', 'Loamy'],
      yieldPerHectare: 3.5
    },
    {
      name: 'Wheat',
      type: 'Cereal',
      season: 'Rabi',
      sowingMonths: '11,12',
      harvestMonths: '4,5',
      waterRequirement: 'Medium',
      soilTypes: ['Loamy', 'Sandy'],
      yieldPerHectare: 4.2
    },
    {
      name: 'Maize',
      type: 'Cereal',
      season: 'Kharif',
      sowingMonths: '6,7',
      harvestMonths: '10,11',
      waterRequirement: 'Medium',
      soilTypes: ['Loamy', 'Sandy'],
      yieldPerHectare: 5.8
    },
    {
      name: 'Cotton',
      type: 'Cash Crop',
      season: 'Kharif',
      sowingMonths: '5,6',
      harvestMonths: '11,12,1',
      waterRequirement: 'Medium',
      soilTypes: ['Black', 'Loamy'],
      yieldPerHectare: 2.5
    },
    {
      name: 'Sugarcane',
      type: 'Cash Crop',
      season: 'Year-round',
      sowingMonths: '1,2,3',
      harvestMonths: '12,1,2',
      waterRequirement: 'High',
      soilTypes: ['Loamy', 'Clay'],
      yieldPerHectare: 70.0
    }
  ],
  
  pests: [
    {
      name: 'Brown Planthopper',
      scientificName: 'Nilaparvata lugens',
      symptoms: ['Yellowing of leaves', 'Stunted growth', 'Hopper burn'],
      affectedCrops: ['Rice'],
      severity: 'high' as const,
      treatment: 'Use neem oil spray or approved insecticides',
      prevention: ['Maintain water level', 'Remove weeds', 'Use resistant varieties']
    },
    {
      name: 'Aphids',
      scientificName: 'Aphidoidea',
      symptoms: ['Curled leaves', 'Sticky honeydew', 'Stunted growth'],
      affectedCrops: ['Wheat', 'Maize', 'Cotton'],
      severity: 'medium' as const,
      treatment: 'Spray with soap solution or neem oil',
      prevention: ['Encourage natural predators', 'Regular monitoring', 'Remove infected plants']
    },
    {
      name: 'Bollworm',
      scientificName: 'Helicoverpa armigera',
      symptoms: ['Holes in leaves', 'Damaged bolls', 'Frass on leaves'],
      affectedCrops: ['Cotton'],
      severity: 'high' as const,
      treatment: 'Use Bt cotton varieties and approved pesticides',
      prevention: ['Crop rotation', 'Pheromone traps', 'Early detection']
    }
  ]
};

console.log('Seed data prepared. Use the seed API endpoint to populate Firestore.');
