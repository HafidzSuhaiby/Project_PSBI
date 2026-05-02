import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const loginUser = async (credentials) => {
    try {
        const response = await axios.post(`${API_URL}/auth/login`, credentials);
        // Kita hanya mengembalikan data, penyimpanan dilakukan di Login.jsx agar lebih pasti
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Login Gagal");
    }
};

export const registerUser = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/auth/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : new Error("Registrasi Gagal");
    }
};