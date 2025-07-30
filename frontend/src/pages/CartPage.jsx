// src/pages/CartPage.jsx
import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CartContext from '../context/CartContext';
import AuthContext from '../context/AuthContext';

function CartPage() {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState('123 Main St, Anytown, USA'); // Default address for now
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const totalPrice = cartItems.reduce((acc, item) => acc + (item.qty * parseFloat(item.price)), 0).toFixed(2);

  const handleCheckout = async () => {
    setError('');
    setSuccess('');

    // 1. Check if user is logged in
    if (!user) {
      navigate('/login'); // Redirect to login if not authenticated
      return;
    }

    try {
      // 2. Send the checkout request to the backend
      const response = await fetch('http://localhost:5000/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token // Send the authentication token
        },
        body: JSON.stringify({
          cartItems: cartItems,
          shipping_address: shippingAddress
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Checkout failed');
      }

      // 3. On success: show message, clear the cart, and maybe redirect
      setSuccess(`Order placed successfully! Your Order ID is: ${data.orderId}`);
      clearCart();
      // Optional: redirect to an order confirmation page after a few seconds
      // setTimeout(() => navigate('/orders'), 3000);

    } catch (err) {
      console.error('Checkout error:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Your Shopping Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty. {success && <span style={{ color: 'green' }}>{success}</span>}</p>
      ) : (
        <div>
          {cartItems.map((item) => (
            <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #eee', padding: '10px 0' }}>
              <span>{item.name}</span>
              <span>{item.qty} x ${item.price}</span>
            </div>
          ))}
          <div style={{ marginTop: '20px', fontWeight: 'bold', fontSize: '1.2em' }}>
            <h2>Total: ${totalPrice}</h2>
          </div>
          
          {/* --- Checkout Section --- */}
          <div style={{ marginTop: '20px' }}>
            <h3>Shipping Address</h3>
            <textarea 
              value={shippingAddress}
              onChange={(e) => setShippingAddress(e.target.value)}
              rows="3"
              style={{ width: '300px' }}
            />
            <br />
            <button onClick={handleCheckout} style={{ marginTop: '10px' }}>
              Proceed to Checkout
            </button>
          </div>

          {/* Display success or error messages */}
          {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
          {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
        </div>
      )}
    </div>
  );
}

export default CartPage;