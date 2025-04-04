import axios from 'axios';

export const getToken = async (username, password) => {
    console.log('getToken called'); // Add log
    try {
        const response = await axios.post(`${process.env.REACT_APP_API_URL}/login`, { username, password });
        if (response.status === 200 && response.data.token) {
            console.log('Token received:', response.data.token);
            return response.data.token;
        } else {
            console.error('Failed to retrieve token. Response:', response);
            return null;
        }
    } catch (error) {
        console.error('Error getting token:', error.response ? error.response.data : error.message);
        return null;
    }
};
