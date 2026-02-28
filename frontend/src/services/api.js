import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Add token to requests if available
api.interceptors.request.use((config) => {
    const admin = localStorage.getItem('admin');
    if (admin) {
        const { token } = JSON.parse(admin);
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export const authService = {
    login: async (credentials) => {
        const response = await api.post('/admin/login', credentials);
        return response.data;
    },
};

export const meditationService = {
    getMeditations: async (month, year) => {
        const response = await api.get(`/meditations?month=${month}&year=${year}`);
        return response.data;
    },
    createMeditation: async (dataSpec) => {
        const response = await api.post('/meditations', dataSpec);
        return response.data;
    },
    updateMeditation: async (id, dataSpec) => {
        const response = await api.put(`/meditations/${id}`, dataSpec);
        return response.data;
    },
    deleteMeditation: async (id) => {
        const response = await api.delete(`/meditations/${id}`);
        return response.data;
    },
};

export default api;
