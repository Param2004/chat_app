// client/src/utils/api.js
import axios from 'axios';

export const fetchPendingRequests = async (username) => {
    try {
        const response = await axios.get(`https://sloth-mint-gnu.ngrok-free.app/api/users/rishabh/nearby`, { headers: {'ngrok-skip-browser-warning': 'true'} });
        console.log(response.data);
        
        // Assuming the API returns an array of usernames with pending requests
        return response;
    } catch (error) {
        console.error('Error fetching pending requests:', error);
        return [];
    }
};
