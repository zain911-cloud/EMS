// src/components/Logout.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token'); // Clear token from localStorage
        setIsAuthenticated(false); // Update authentication state
        navigate('/'); // Redirect to home page
    };

    return (
        <button onClick={handleLogout} style={{ marginLeft: '10px', padding: '5px 10px', cursor: 'pointer' }}>
            Logout
        </button>
    );
};

export default Logout;
