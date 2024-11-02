// controllers/expenseController.js
const Expense = require('../models/Expense');

// Create a new expense
exports.addExpense = async (req, res) => {
    const { name, amount, location, date } = req.body;
    const userId = req.user._id; // Get the user ID from the auth middleware

    const newExpense = new Expense({ name, amount, location, date, userId });

    // Handle file upload if there's an attachment
    if (req.files && req.files.attachment) {
        const attachment = req.files.attachment; // Using express-fileupload or multer
        const attachmentPath = `uploads/${attachment.name}`; // Save path for the attachment
        await attachment.mv(attachmentPath); // Move file to the desired location
        newExpense.attachment = attachmentPath; // Store the path in the expense
    }

    try {
        const savedExpense = await newExpense.save();
        res.status(201).json(savedExpense);
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(400).json({ message: 'Error creating expense', error });
    }
};

// Get expenses
exports.getExpenses = async (req, res) => {
    const userId = req.user._id;

    try {
        // If the user is an Admin, fetch all expenses; otherwise, fetch only the user's expenses
        const expenses = req.user.role === 'Admin'
            ? await Expense.find({ isDeleted: false }) // Admin can see all expenses
            : await Expense.find({ userId, isDeleted: false }); // User can see only their expenses
        
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Error fetching expenses', error });
    }
};

// Soft delete an expense
exports.softDeleteExpense = async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findById(id);
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        expense.isDeleted = true; // Mark the expense as deleted
        await expense.save();
        res.status(200).json({ message: 'Expense deleted successfully' });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Error deleting expense', error });
    }
};
