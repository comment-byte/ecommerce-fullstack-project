// src/components/Header.jsx
import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import CartContext from '../context/CartContext';
import { FaShoppingCart, FaSearch } from 'react-icons/fa'; // Import icons

function Header() {
  const { user, logout } = useContext(AuthContext);
  const { cartItems } = useContext(CartContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalCartItems = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <header className="bg-amazon_blue text-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="text-2xl font-bold border border-transparent hover:border-white p-1">
          eShop
        </Link>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-grow items-center mx-4">
          <input 
            type="text" 
            className="w-full h-10 px-3 rounded-l-md text-black focus:outline-none" 
            placeholder="Search..."
          />
          <button className="bg-amazon_orange hover:bg-amazon_orange-light h-10 px-4 rounded-r-md flex items-center justify-center">
            <FaSearch size={20} className="text-black" />
          </button>
        </div>

        {/* Auth & Cart Links */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link to="/profile" className="hover:underline text-sm">Hello, {user.email.split('@')[0]}</Link>
              <Link to="/orders" className="hover:underline text-sm">Orders</Link>
              <button onClick={handleLogout} className="text-sm hover:underline">Logout</button>
            </div>
          ) : (
            <Link to="/login" className="hover:underline">Sign In</Link>
          )}

          <Link to="/cart" className="flex items-center hover:underline relative border border-transparent hover:border-white p-1">
            <FaShoppingCart size={24} />
            <span className="ml-1">Cart</span>
            {totalCartItems > 0 && (
              <span className="absolute top-0 right-0 -mt-1 -mr-1 bg-amazon_orange text-black text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {totalCartItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Header;