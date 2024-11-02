import React, { useEffect, useState } from 'react';
import { fetchExpenses } from '../services/api';

const ExpenseList = () => {
    const [expenses, setExpenses] = useState([]);
    const [message, setMessage] = useState('');

    useEffect(() => {
        const loadExpenses = async () => {
            try {
                const data = await fetchExpenses();
                setExpenses(data);
            } catch (error) {
                setMessage('Failed to load expenses.');
            }
        };
        loadExpenses();
    }, []);

    return (
        <div>
            <h2>My Expenses</h2>
            {message && <div>{message}</div>}
            <ul>
                {expenses.map((expense) => (
                    <li key={expense._id}>
                        {expense.description}: ${expense.amount}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ExpenseList;
