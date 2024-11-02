import React, { useState } from 'react';
import { registerUser } from '../services/api';

const Register = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [message, setMessage] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // eslint-disable-next-line no-unused-vars
            const response = await registerUser(formData);
            setMessage('Registration successful!');
        } catch (error) {
            setMessage('Registration failed: ' + (error.message || 'Please try again.'));
        }
    };

    return (
        <div>
            <h2>Register</h2>
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
                <button type="submit">Register</button>
            </form>
            {message && <div>{message}</div>}
        </div>
    );
};

export default Register;
