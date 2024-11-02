import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../services/api';

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(formData);
            localStorage.setItem('token', response.token); // Save token
            setIsAuthenticated(true);
            setMessage('Login successful!');
            navigate('/expenses'); // Redirect to expenses page
        } catch (error) {
            setMessage('Login failed: ' + (error.message || 'Please try again.'));
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    name="email" 
                    placeholder="Email" 
                    onChange={handleChange} 
                    value={formData.email} 
                    required 
                />
                <input 
                    name="password" 
                    type="password" 
                    placeholder="Password" 
                    onChange={handleChange} 
                    value={formData.password} 
                    required 
                />
                <button type="submit">Login</button>
            </form>
            {message && <div>{message}</div>}
        </div>
    );
};

export default Login;
