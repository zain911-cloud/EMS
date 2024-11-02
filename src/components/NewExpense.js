// NewExpense.js
import React, { useState } from 'react';
import axios from 'axios';

const NewExpense = () => {
    const [form, setForm] = useState({
        expenseId: '',
        name: '',
        amount: '',
        location: '',
        date: '',
        attachment: null
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && (file.type === 'application/pdf' || file.type.startsWith('image/'))) {
            setForm({ ...form, attachment: file });
        } else {
            alert('Only PDF and image files are allowed');
            setForm({ ...form, attachment: null });
        }
    };

    const validateForm = () => {
        const validationErrors = {};
        if (!form.expenseId) validationErrors.expenseId = "Expense ID is required";
        if (!form.name) validationErrors.name = "Expense name is required";
        if (!form.amount || form.amount <= 0) validationErrors.amount = "Valid amount is required";
        if (!form.location) validationErrors.location = "Location is required";
        if (!form.date) validationErrors.date = "Date is required";
        if (!form.attachment) validationErrors.attachment = "Attachment is required";
        setErrors(validationErrors);
        return Object.keys(validationErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        const formData = new FormData();
        Object.keys(form).forEach(key => formData.append(key, form[key]));

        try {
            await axios.post('/api/expense/add', formData);
            alert('Expense added successfully');
            setForm({ expenseId: '', name: '', amount: '', location: '', date: '', attachment: null });
            setErrors({});
        } catch (error) {
            alert('Failed to add expense');
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ maxWidth: '400px', margin: 'auto' }}>
            <div>
                <label>Expense ID</label>
                <input name="expenseId" value={form.expenseId} onChange={handleChange} placeholder="Expense ID" />
                {errors.expenseId && <span style={{ color: 'red' }}>{errors.expenseId}</span>}
            </div>
            <div>
                <label>Expense Name</label>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Expense Name" />
                {errors.name && <span style={{ color: 'red' }}>{errors.name}</span>}
            </div>
            <div>
                <label>Amount</label>
                <input name="amount" type="number" value={form.amount} onChange={handleChange} placeholder="Amount" />
                {errors.amount && <span style={{ color: 'red' }}>{errors.amount}</span>}
            </div>
            <div>
                <label>Location</label>
                <input name="location" value={form.location} onChange={handleChange} placeholder="Location" />
                {errors.location && <span style={{ color: 'red' }}>{errors.location}</span>}
            </div>
            <div>
                <label>Date</label>
                <input name="date" type="date" value={form.date} onChange={handleChange} />
                {errors.date && <span style={{ color: 'red' }}>{errors.date}</span>}
            </div>
            <div>
                <label>Attachment (PDF or Image)</label>
                <input type="file" onChange={handleFileChange} accept=".pdf,image/*" />
                {errors.attachment && <span style={{ color: 'red' }}>{errors.attachment}</span>}
            </div>
            <button type="submit">Submit</button>
        </form>
    );
};

export default NewExpense;
