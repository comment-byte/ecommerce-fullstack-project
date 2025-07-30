// src/pages/OrderHistoryPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

function OrderHistoryPage() {
  const { user, token } = useContext(AuthContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      // If user is not logged in, redirect them
      navigate('/login');
      return;
    }

    async function fetchOrders() {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/api/orders/my-orders', {
          headers: {
            'x-auth-token': token,
          },
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }
        setOrders(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }

    fetchOrders();
  }, [token, navigate]);

  if (loading) {
    return <p>Loading your order history...</p>;
  }

  return (
    <div>
      <h1>My Order History</h1>
      {orders.length === 0 ? (
        <p>You have not placed any orders yet.</p>
      ) : (
        orders.map((order) => (
          <div key={order.order_id} style={{ border: '1px solid #ccc', margin: '20px 0', padding: '15px' }}>
            <h3>Order ID: {order.order_id}</h3>
            <p><strong>Date:</strong> {new Date(order.order_date).toLocaleDateString()}</p>
            <p><strong>Total:</strong> ${order.total_amount}</p>
            <p><strong>Status:</strong> {order.status}</p>
            <h4>Items:</h4>
            <ul>
              {order.items.map((item, index) => (
                <li key={index}>
                  {item.product_name} - {item.quantity} x ${item.price}
                </li>
              ))}
            </ul>
          </div>
        ))
      )}
    </div>
  );
}

export default OrderHistoryPage;