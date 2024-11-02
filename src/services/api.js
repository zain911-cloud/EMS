import axios from 'axios';

// Configure the base URL for the API
const api = axios.create({
    baseURL: 'http://localhost:5000/api', // Adjust this URL as needed
});

// Interceptor to attach token to request headers if it exists in localStorage
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// User Registration
export const registerUser = async (userData) => {
    try {
        const response = await api.post('/users/register', userData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// User Login
export const loginUser = async (userData) => {
    try {
        const response = await api.post('/users/login', userData);
        localStorage.setItem('token', response.data.token); // Store the token in localStorage
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Logout API function
export const logoutUser = async () => {
    try {
        // Optional backend logout endpoint, if needed
        // await api.post('/auth/logout');
        
        localStorage.removeItem('token'); // Clear token from local storage
        return { success: true, message: 'Logged out successfully' };
    } catch (error) {
        console.error('Logout failed:', error);
        return { success: false, message: 'Logout failed' };
    }
};

// Create an expense
export const createExpense = async (expenseData) => {
    try {
        const response = await api.post('/expenses', expenseData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Fetch all expenses
export const fetchExpenses = async () => {
    try {
        const response = await api.get('/expenses');
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Fetch an expense by ID
export const fetchExpenseById = async (id) => {
    try {
        const response = await api.get(`/expenses/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Update an expense
export const updateExpense = async (id, expenseData) => {
    try {
        const response = await api.put(`/expenses/${id}`, expenseData);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Soft delete an expense (using a PUT request)
export const deleteExpense = async (id) => {
    try {
        const response = await api.put(`/expenses/delete/${id}`);
        return response.data;
    } catch (error) {
        throw error.response ? error.response.data : error;
    }
};

// Default export of the axios instance
export default api;
