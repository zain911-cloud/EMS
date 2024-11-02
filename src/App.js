import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import Login from './components/Login';
import Register from './components/Register';
import ExpenseForm from './components/ExpenseForm';
import ExpenseList from './components/ExpenseList';
import Logout from './components/Logout';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

    return (
        <Router>
            <div>
                {/* Navigation */}
                <nav style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>
                    <Link to="/" style={{ marginRight: '10px' }}>Home</Link>
                    {isAuthenticated ? (
                        <>
                            <Link to="/expenses" style={{ marginRight: '10px' }}>My Expenses</Link>
                            <Link to="/add-expense" style={{ marginRight: '10px' }}>Add Expense</Link>
                            <Logout setIsAuthenticated={setIsAuthenticated} />
                        </>
                    ) : (
                        <>
                            <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
                            <Link to="/register">Register</Link>
                        </>
                    )}
                </nav>

                {/* Routes */}
                <Routes>
                    <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/register" element={<Register />} />
                    {isAuthenticated ? (
                        <>
                            <Route path="/expenses" element={<ExpenseList />} />
                            <Route path="/add-expense" element={<ExpenseForm />} />
                            <Route path="/" element={<Navigate to="/expenses" />} />
                        </>
                    ) : (
                        <Route path="/" element={<Navigate to="/login" />} />
                    )}
                </Routes>
            </div>
        </Router>
    );
};

export default App;
