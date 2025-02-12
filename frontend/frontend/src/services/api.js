import axios from 'axios';

const API_URL = 'http://localhost:5000/api'; // Replace with your backend URL if needed

// Add medicine
export const addMedicine = async (medicineData) => {
    try {
        const response = await axios.post(`${API_URL}/medicine`, medicineData);
        return response.data;
    } catch (error) {
        console.error('Error adding medicine:', error);
        throw error;
    }
};

// Update medicine status
export const updateMedicineStatus = async (batchId, status) => {
    try {
        const response = await axios.put(`${API_URL}/medicine/status`, { batchId, status });
        return response.data;
    } catch (error) {
        console.error('Error updating medicine status:', error);
        throw error;
    }
};

// Sell medicine
export const sellMedicine = async (batchId, enduser) => {
    try {
        const response = await axios.put(`${API_URL}/medicine/sell`, { batchId, enduser });
        return response.data;
    } catch (error) {
        console.error('Error selling medicine:', error);
        throw error;
    }
};

// Get medicine details
export const getMedicineDetails = async (batchId) => {
    try {
        const response = await axios.get(`${API_URL}/medicine/${batchId}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching medicine details:', error);
        throw error;
    }
};


