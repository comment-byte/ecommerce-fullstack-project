// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext'; // <-- Import CartContext

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext); // <-- Get cartItems from context
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Calculate total number of items in the cart
  const totalCartItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const navStyle = {
    display: 'flex',
    gap: '20px',
    padding: '10px',
    backgroundColor: '#f0f0f0',
    borderBottom: '1px solid #ccc',
    alignItems: 'center'
  };

  return (
    <nav style={navStyle}>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/cart">Cart ({totalCartItems})</Link> {/* <-- Add Cart link */}
      
      <div style={{ marginLeft: 'auto' }}> {/* This pushes the auth links to the right */}
        {user ? (
          <>
            <Link to="/profile" style={{ marginRight: '10px' }}>Profile ({user.email})</Link>
             <Link to="/orders" style={{ marginRight: '10px' }}>My Orders</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      
      </div>
    </nav>
  );
}

export default Header;