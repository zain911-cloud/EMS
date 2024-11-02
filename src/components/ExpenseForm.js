import React, { useState } from 'react';
import { createExpense } from '../services/api'; // Ensure to import your API function

const ExpenseForm = ({ onExpenseCreated }) => {
    const [formData, setFormData] = useState({ description: '', amount: '' });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        // Update form data and clear messages on input change
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setMessage(''); // Clear message on input change
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission
        setIsSubmitting(true); // Disable button to prevent multiple submissions
        setMessage(''); // Clear previous messages

        try {
            await createExpense(formData); // Call the createExpense function from the API service
            setMessage('Expense created successfully!'); // Success message
            onExpenseCreated(); // Refresh expense list or handle response
            setFormData({ description: '', amount: '' }); // Clear form inputs
        } catch (error) {
            // Just log the error if you don't want to show a message
            console.error('Expense creation failed:', error);
        } finally {
            setIsSubmitting(false); // Re-enable button after submission
        }
    };

    return (
        <div>
            <h2>Add Expense</h2>
            <form onSubmit={handleSubmit}>
                <input 
                    name="description" 
                    placeholder="Description" 
                    onChange={handleChange} 
                    value={formData.description} 
                    required 
                />
                <input 
                    name="amount" 
                    type="number" 
                    placeholder="Amount" 
                    onChange={handleChange} 
                    value={formData.amount} 
                    required 
                />
                <button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Adding...' : 'Add Expense'}
                </button>
            </form>
            {message && <div style={{ color: 'green' }}>{message}</div>} {/* Display success message */}
        </div>
    );
};

export default ExpenseForm;
