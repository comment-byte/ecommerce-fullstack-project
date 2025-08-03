// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  const navStyle = {
    display: 'flex',
    gap: '20px',
    padding: '10px',
    borderBottom: '1px solid #ccc'
  };

  return (
    <nav style={navStyle}>
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/cart">Cart ({totalCartItems})</Link>
      
      <div style={{ marginLeft: 'auto', display: 'flex', gap: '20px' }}>
        {user ? (
          <>
            <Link to="/profile">Profile</Link>
            <Link to="/orders">My Orders</Link>
            <button onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Header;