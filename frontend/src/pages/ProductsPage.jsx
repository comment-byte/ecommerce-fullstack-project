// src/pages/ProductsPage.jsx
import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import CartContext from '../context/CartContext';

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function fetchProducts() {
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
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Results</h1>
      
      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {products.map(product => (
          // We'll wrap the card in a Link to a future product detail page
          <Link to={`/products/${product.product_id}`} key={product.product_id} className="bg-white rounded-lg shadow-sm hover:shadow-lg transition-shadow duration-300">
            <div className="p-4 flex flex-col h-full">
              {/* Product Image Placeholder */}
              <div className="h-48 bg-gray-200 mb-4 flex items-center justify-center">
                <span className="text-gray-500">Image</span>
              </div>
              
              {/* Product Name - uses line-clamp to limit to 2 lines */}
              <h2 className="text-md text-gray-900 font-medium mb-2 line-clamp-2 hover:text-amazon_orange">
                {product.name}
              </h2>
              
              {/* Description Snippet */}
              <p className="text-sm text-gray-600 mb-4 flex-grow line-clamp-3">
                {product.description}
              </p>
              
              {/* Price and Add to Cart */}
              <div className="mt-auto">
                <p className="text-xl font-bold text-gray-800 mb-3">${product.price}</p>
                <button 
                  onClick={(e) => {
                    e.preventDefault(); // Prevent Link navigation when button is clicked
                    addToCart(product);
                  }} 
                  className="w-full bg-amazon_orange-light text-black py-2 px-4 rounded-md hover:bg-amazon_orange focus:outline-none focus:ring-2 focus:ring-amazon_orange"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ProductsPage;