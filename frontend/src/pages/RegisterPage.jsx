// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RegisterPage() {
  // 'useNavigate' gives us a function to redirect the user
  const navigate = useNavigate();

  // 'useState' to manage the form input fields
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: ''
  });
  const [error, setError] = useState(null); // To store any error messages from the API

  // A handler to update the state as the user types
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // A handler for when the form is submitted
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission (page reload)
    setError(null); // Clear previous errors

    try {
      const response = await fetch('${import.meta.env.VITE_API_BASE_URL}/api/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (!response.ok) {
        // If the server response is not 2xx, throw an error
        throw new Error(data.message || 'Failed to register');
      }

      // If registration is successful, redirect to the login page
      console.log('Registration successful:', data);
      navigate('/login');

    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message); // Display the error message to the user
    }
  };

  return (
    <div>
      <h1>Register</h1>
      <form onSubmit={handleSubmit}>
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <br />
        <input type="password" name="password" placeholder="Password" value={formData.password} onChange={handleChange} required />
        <br />
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} />
        <br />
        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} />
        <br />
        <button type="submit">Register</button>
      </form>
      {/* Display any error message here */}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default RegisterPage;