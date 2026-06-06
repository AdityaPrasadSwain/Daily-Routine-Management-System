import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ai';

// Create axios instance with auth interceptor if not already global
// Assuming global axios configuration handled in App.jsx or main.jsx
// If not, we should import the configured axios instance. 
// For now using pure axios but assuming interceptors are set up globally or we need to import api client.
// Better to use the existing api setup if available.

// Let's assume there is a standard way. Checking if imports exist in other files would be good, 
// but sticking to standard axios with headers is safe if we use the token.

const getAuthHeader = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
        return { Authorization: `Bearer ${user.token}` };
    }
    return {};
};

export const fetchDailySuggestions = async () => {
    const response = await axios.get(`${API_URL}/suggestions?type=DAILY`, { headers: getAuthHeader() });
    return response.data;
};

export const fetchWeeklySuggestions = async () => {
    const response = await axios.get(`${API_URL}/suggestions?type=WEEKLY`, { headers: getAuthHeader() });
    return response.data;
};

export const fetchAllSuggestions = async () => {
    const response = await axios.get(`${API_URL}/suggestions`, { headers: getAuthHeader() });
    return response.data;
};
