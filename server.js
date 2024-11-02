require('dotenv').config(); // Load environment variables

const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const User = require('./models/User'); // Ensure this path is correct
const Expense = require('./models/Expense'); // Ensure this path is correct

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(fileUpload());

// Log MongoDB URI for debugging
console.log('MONGO_URI:', process.env.MONGO_URI);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true 
})
.then(() => console.log('MongoDB connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(403).json({ message: 'Failed to authenticate token' });
        }
        req.user = decoded;
        next();
    });
};


// **1. Register a new user**
app.post('/api/users/register', async (req, res) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Registration failed' });
    }
});

// **2. Log in an existing user**
app.post('/api/users/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Login failed' });
    }
});



// **3. Create a new expense**
app.post('/api/expenses', verifyToken, async (req, res) => {
    const { description, amount } = req.body;
    const userId = req.user.id;

    try {
        const newExpense = new Expense({ description, amount, userId });
        await newExpense.save();
        res.status(201).json({ message: 'Expense created successfully', expense: newExpense });
    } catch (error) {
        console.error('Error creating expense:', error);
        res.status(500).json({ message: 'Expense creation failed' });
    }
});

// **4. Fetch all expenses for the authenticated user**
app.get('/api/expenses', verifyToken, async (req, res) => {
    try {
        const userId = req.user.id;
        const expenses = await Expense.find({ userId, isDeleted: false });
        res.status(200).json(expenses);
    } catch (error) {
        console.error('Error fetching expenses:', error);
        res.status(500).json({ message: 'Fetching expenses failed' });
    }
});

// **5. Update an existing expense by ID**
app.put('/api/expenses/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    const { description, amount } = req.body;

    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { description, amount },
            { new: true }
        );
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense updated successfully', expense });
    } catch (error) {
        console.error('Error updating expense:', error);
        res.status(500).json({ message: 'Expense update failed' });
    }
});

// **6. Soft delete an expense**
app.put('/api/expenses/delete/:id', verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        const expense = await Expense.findOneAndUpdate(
            { _id: id, userId: req.user.id },
            { isDeleted: true },
            { new: true }
        );
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.status(200).json({ message: 'Expense deleted successfully', expense });
    } catch (error) {
        console.error('Error deleting expense:', error);
        res.status(500).json({ message: 'Expense deletion failed' });
    }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
