// middlewares/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Ensure correct path to your User model

const authenticate = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const decoded = jwt.verify(token, '18df4fae3ae58f89ae6b6ad0e03054bd317b2c4f41441cb5100ff85b73c8b6bcd0bad9fae7c9f7e2f694b6d79684856c00aa41f177b38b7fd866dce477393075'); // Replace with your actual secret
        req.user = await User.findById(decoded.id); // Fetch user from the database
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid token.' });
    }
};

module.exports = { authenticate };
