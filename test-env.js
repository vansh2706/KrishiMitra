require('dotenv').config();

console.log('NVIDIA_API_KEY exists:', !!process.env.NVIDIA_API_KEY);
console.log('NVIDIA_API_KEY length:', process.env.NVIDIA_API_KEY ? process.env.NVIDIA_API_KEY.length : 0);
console.log('First 10 characters:', process.env.NVIDIA_API_KEY ? process.env.NVIDIA_API_KEY.substring(0, 10) : 'N/A');