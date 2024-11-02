// routes/expenses.js
const express = require('express');
const router = express.Router();
const { authenticate } = require('../middlewares/auth'); // Ensure the correct path to your auth middleware
const Expense = require('../models/Expense'); // Ensure the correct path to your Expense model

// POST /expenses/add - Create a new expense
router.post('/add', authenticate, async (req, res) => {
    try {
        const { name, amount, location, date } = req.body;
        const userId = req.user._id; // Extract userId from authenticated user

        // Handle file upload
        let attachment = null;
        if (req.files && req.files.attachment) {
            const file = req.files.attachment;
            const uploadPath = `uploads/${file.name}`; // Define the path where the file will be saved
            await file.mv(uploadPath); // Move the file to the desired location
            attachment = uploadPath; // Set the attachment path
        }

        // Create a new expense object
        const newExpense = new Expense({ name, amount, location, date, userId, attachment });
        const savedExpense = await newExpense.save(); // Save the expense to the database

        res.status(201).json(savedExpense); // Respond with the saved expense
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(400).json({ message: 'Error creating expense', error });
    }
});

// GET /expenses - Fetch expenses for the authenticated user
router.get('/', authenticate, async (req, res) => {
    try {
        console.log('Fetching expenses for user:', req.user._id); // Log user ID for debugging
        const expenses = await Expense.find({ userId: req.user._id }); // Fetch expenses associated with the user
        res.status(200).json(expenses); // Respond with the list of expenses
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Fetching expenses failed' });
    }
});

module.exports = router;
