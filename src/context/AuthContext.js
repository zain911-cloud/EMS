// src/context/AuthContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token') || null);

    useEffect(() => {
        // Fetch user data if token exists
        const fetchUser = async () => {
            if (token) {
                try {
                    const response = await axios.get('/api/user/me', {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    setUser(response.data);
                } catch (error) {
                    console.error("Error fetching user data:", error);
                    logout(); // Log out if token is invalid
                }
            }
        };
        fetchUser();
    }, [token]);

    const login = async (credentials) => {
        const response = await axios.post('/api/login', credentials);
        const { token: newToken, user: loggedInUser } = response.data;
        setToken(newToken);
        setUser(loggedInUser);
        localStorage.setItem('token', newToken);
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
