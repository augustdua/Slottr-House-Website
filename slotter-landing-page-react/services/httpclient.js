// Import necessary modules
import axios from 'axios';

const API_URL = import.meta.env.VITE_BASE_URL;


export const WebClient = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor
WebClient.interceptors.request.use(async (config) => {
    return config;
}, (error) => {
    console.error('WebClient Request Error:', error);
    return Promise.reject(error);
});

// Add response interceptor
WebClient.interceptors.response.use(
    (response) => {
        return response.data; // Simplify response to only return data
    },
    (error) => {
        console.error('WebClient Response Error:', error);
        return Promise.reject(error); // Forward error for handling
    }
);

