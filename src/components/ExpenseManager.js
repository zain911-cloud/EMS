// src/components/ExpenseManager.js
import React, { useState, useEffect } from 'react';
import ExpenseForm from './ExpenseForm';
import ExpenseList from './ExpenseList';
import api from '../services/api'; // Ensure the correct path

const ExpenseManager = () => {
    const [expenses, setExpenses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch initial expenses on component mount
    useEffect(() => {
        const fetchExpenses = async () => {
            setLoading(true); // Reset loading state before fetch
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Authorization token not found.'); // Handle missing token
                }
                const response = await api.get('/expenses', {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setExpenses(response.data);
            } catch (err) {
                console.error('Failed to load expenses:', err);
                setError(err.response?.data?.message || 'Error loading expenses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchExpenses();
    }, []);

    // Add new expense to the list
    const handleAddExpense = (newExpense) => {
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);
    };

    // Render loading, error, or the expense list
    if (loading) return <div>Loading expenses...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div>
            <h2>Manage Expenses</h2>
            <ExpenseForm onAddExpense={handleAddExpense} />
            <ExpenseList expenses={expenses} />
        </div>
    );
};

export default ExpenseManager;
