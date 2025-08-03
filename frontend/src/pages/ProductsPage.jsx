// src/pages/ProductsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import CartContext from '../context/CartContext';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function fetchProducts() {
      console.log("Fetching from API URL:", import.meta.env.VITE_API_BASE_URL);
      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/products`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    }
    fetchProducts();
  }, []);

  return (
    <div>
      <h1>Our Products</h1>
      <div>
        {products.map(product => (
          <div key={product.product_id} style={{ border: '1px solid #ccc', margin: '10px', padding: '10px' }}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p><strong>Price:</strong> ${product.price}</p>
            <button onClick={() => addToCart(product)}>Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;