// src/main.jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// ... rest of the file // <-- Import CartProvider

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider> {/* <-- Wrap App with CartProvider */}
        <App />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);