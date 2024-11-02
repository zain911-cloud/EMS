import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Ensure the import path is correct

const Navbar = () => {
    const { token, logout } = useAuth();

    return (
        <nav>
            <Link to="/register">Register</Link>
            <Link to="/login">Login</Link>
            {token && (
                <>
                    <Link to="/expenses">Expenses</Link>
                    <Link to="/add-expense">Add Expense</Link>
                    <button onClick={logout}>Logout</button>
                </>
            )}
        </nav>
    );
};

export default Navbar;
