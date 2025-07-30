// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Import your components
import CartPage from './pages/CartPage';
import Header from './components/Header';
import ProductsPage from './pages/ProductsPage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage'; 
import ProfilePage from './pages/ProfilePage';
import OrderHistoryPage from './pages/OrderHistoryPage';
// You added this

// A simple placeholder for the home page for now
const HomePage = () => <h1>Welcome to the Home Page!</h1>;
 // You added this

// src/App.jsx

// ... (imports) ...

function App() {
  return (
    <Router>
      <div>
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            
            {/* THIS IS THE LINE THAT IS LIKELY MISSING OR HAS A TYPO */}
            <Route path="/cart" element={<CartPage />} /> 
            <Route path="/orders" element={<OrderHistoryPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;