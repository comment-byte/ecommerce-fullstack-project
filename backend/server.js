// server.js

// 1. Import Dependencies
// server.js

// Change the import line to this, using curly braces:
const cors = require('cors');
const { authMiddleware } = require('./middleware/authMiddleware');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const { Pool } = require('pg'); // Import the pg Pool object

// 2. Create an instance of an Express application
const app = express();
// vvv PASTE THIS ENTIRE BLOCK vvv

const allowedOrigins = [
  https://storied-rolypoly-c9f33c.netlify.app/, // <-- REPLACE with your actual Netlify URL
  'http://localhost:5173'                     // Your local development frontend
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
app.use(express.json()); // <-- ADD THIS LINE
// 3. Define the port the server will run on
const PORT = process.env.PORT || 5000;

// 4. Configure the PostgreSQL Connection Pool
//    Replace the placeholder with your actual password for the 'ecommerce_user'
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

// 5. Define our API routes

// A) A simple root route to confirm the API is running
app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

// B) An endpoint to get ALL products from the DATABASE
app.get('/api/products', async (req, res) => {
  try {
    // Use the pool to send a query to the database
    const result = await pool.query('SELECT * FROM products ORDER BY product_id ASC');
    
    // Send the query result rows back to the client as JSON
    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

// C) An endpoint to get a SINGLE product by its ID (WE WILL UPDATE THIS NEXT)
// C) An endpoint to get a SINGLE product by its ID from the DATABASE
app.get('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params; // Get the ID from the URL parameter

    // Use a parameterized query to prevent SQL injection
    const queryText = 'SELECT * FROM products WHERE product_id = $1';
    const result = await pool.query(queryText, [id]);

    // Check if a product was found
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Send the single product object back as JSON
    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// D) An endpoint to CREATE a new product
app.post('/api/products', async (req, res) => {
  try {
    // Get the new product data from the request body
    const { name, description, price, sku, stock_quantity, image_url } = req.body;

    // Basic validation
    if (!name || !price || !sku) {
      return res.status(400).json({ message: 'Name, price, and SKU are required' });
    }

    const queryText = `
      INSERT INTO products (name, description, price, sku, stock_quantity, image_url)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *;
    `; // 'RETURNING *' sends back the newly created row

    const values = [name, description, price, sku, stock_quantity, image_url];
    const result = await pool.query(queryText, values);

    // Send a 201 (Created) status and the new product data
    res.status(201).json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// E) An endpoint to UPDATE a product (partial update)
app.patch('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock_quantity } = req.body;

    // Fetch the original product to see what exists
    const originalProductResult = await pool.query('SELECT * FROM products WHERE product_id = $1', [id]);

    if (originalProductResult.rows.length === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }
    const originalProduct = originalProductResult.rows[0];

    // Create the updated product object, using new values or falling back to original values
    const updatedProduct = {
      name: name || originalProduct.name,
      description: description || originalProduct.description,
      price: price || originalProduct.price,
      stock_quantity: stock_quantity || originalProduct.stock_quantity
    };

    const queryText = `
      UPDATE products
      SET name = $1, description = $2, price = $3, stock_quantity = $4, updated_at = NOW()
      WHERE product_id = $5
      RETURNING *;
    `;
    
    const values = [
      updatedProduct.name,
      updatedProduct.description,
      updatedProduct.price,
      updatedProduct.stock_quantity,
      id
    ];

    const result = await pool.query(queryText, values);
    
    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// F) An endpoint to DELETE a product
app.delete('/api/products/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const queryText = 'DELETE FROM products WHERE product_id = $1 RETURNING *;';
    const result = await pool.query(queryText, [id]);

    // Check if any row was actually deleted
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted successfully', deletedProduct: result.rows[0] });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// =================== USER AUTHENTICATION ROUTES ===================

// G) An endpoint to REGISTER a new user
app.post('/api/users/register', async (req, res) => {
  try {
    const { email, password, first_name, last_name } = req.body;

    // --- Basic Validation ---
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // --- Check if user already exists ---
    const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // --- Hash the password ---
    const saltRounds = 10; // The "cost factor" for the hash - 10 is a good standard
    const password_hash = await bcrypt.hash(password, saltRounds);

    // --- Insert the new user into the database ---
    const queryText = `
      INSERT INTO users (email, password_hash, first_name, last_name)
      VALUES ($1, $2, $3, $4)
      RETURNING user_id, email, first_name, last_name, created_at;
    `; // Note: We are NOT returning the password_hash

    const values = [email, password_hash, first_name, last_name];
    const result = await pool.query(queryText, values);
    const newUser = result.rows[0];

    // --- Send back the new user data (without the hash) ---
    res.status(201).json(newUser);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// H) An endpoint to LOG IN a user
app.post('/api/users/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // --- Basic Validation ---
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // --- Find the user by email ---
    const queryText = 'SELECT * FROM users WHERE email = $1';
    const result = await pool.query(queryText, [email]);
    const user = result.rows[0];

    // If no user found, or if passwords don't match, send generic error
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // --- Compare the provided password with the stored hash ---
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // --- Login successful, create a JWT ---
    const payload = {
      user: {
        id: user.user_id,
        email: user.email
      }
    };

    // We need a secret key to sign the token. Store this securely!
    // For now, we'll put it here. In a real app, this would be in an environment variable.
    const JWT_SECRET = 'your_super_secret_key_that_is_long_and_random'; 

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '1h' }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.json({ token }); // Send the token to the client
      }
    );

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
// I) A protected route to get the logged-in user's profile
app.get('/api/profile', authMiddleware, async (req, res) => {
  try {
    // Because our middleware ran, req.user is now available!
    // We can fetch the user's data from the DB without the password hash.
    const user = await pool.query(
      'SELECT user_id, email, first_name, last_name FROM users WHERE user_id = $1',
      [req.user.id]
    );

    res.json(user.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server Error' });
  }
});
// =================== ORDER ROUTES ===================

// K) An endpoint to CREATE a new order (Protected)
// We use our authMiddleware to make sure only logged-in users can create orders.
app.post('/api/orders', authMiddleware, async (req, res) => {
  // The 'client' object will be our connection to the DB for the transaction
  const client = await pool.connect();
  
  try {
    const { cartItems, shipping_address } = req.body;
    const { id: user_id } = req.user; // Get user_id from our auth middleware

    // Basic validation
    if (!cartItems || cartItems.length === 0 || !shipping_address) {
      return res.status(400).json({ message: 'Missing cart items or shipping address.' });
    }

    // --- Start the database transaction ---
    await client.query('BEGIN');

    // Calculate total amount on the server-side for security
    let total_amount = 0;
    for (const item of cartItems) {
      // Fetch the current price from the DB to prevent price tampering
      const productResult = await client.query('SELECT price FROM products WHERE product_id = $1', [item.product_id]);
      if (productResult.rows.length === 0) {
        throw new Error(`Product with ID ${item.product_id} not found.`);
      }
      const currentPrice = parseFloat(productResult.rows[0].price);
      total_amount += item.qty * currentPrice;
    }
// L) An endpoint to get all orders for the logged-in user (Protected)
app.get('/api/orders/my-orders', authMiddleware, async (req, res) => {
  try {
    const { id: user_id } = req.user; // Get user_id from the token

    // This query joins the orders and order_items tables to get all the details
    // It's a bit more complex, but very powerful.
    const queryText = `
      SELECT 
        o.order_id, 
        o.order_date, 
        o.total_amount, 
        o.status,
        json_agg(
          json_build_object(
            'product_name', p.name,
            'quantity', oi.quantity,
            'price', oi.price
          )
        ) as items
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      JOIN products p ON oi.product_id = p.product_id
      WHERE o.user_id = $1
      GROUP BY o.order_id
      ORDER BY o.order_date DESC;
    `;
    
    const result = await pool.query(queryText, [user_id]);
    
    res.json(result.rows);

  } catch (err) {
    console.error('Error fetching user orders:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});
    // 1. Insert into the 'orders' table
    const orderQueryText = `
      INSERT INTO orders (user_id, total_amount, shipping_address)
      VALUES ($1, $2, $3)
      RETURNING order_id;
    `;
    const orderValues = [user_id, total_amount, shipping_address];
    const orderResult = await client.query(orderQueryText, orderValues);
    const newOrderId = orderResult.rows[0].order_id;

    // 2. Insert each cart item into the 'order_items' table
    const orderItemsQueryText = `
      INSERT INTO order_items (order_id, product_id, quantity, price)
      VALUES ($1, $2, $3, $4);
    `;
    for (const item of cartItems) {
      // It's best practice to use the price from when the item was added to the cart
      const itemPrice = parseFloat(item.price);
      const itemValues = [newOrderId, item.product_id, item.qty, itemPrice];
      await client.query(orderItemsQueryText, itemValues);
    }
    
    // --- If all queries were successful, commit the transaction ---
    await client.query('COMMIT');
    
    res.status(201).json({ message: 'Order created successfully', orderId: newOrderId });

  } catch (err) {
    // --- If any query failed, roll back the entire transaction ---
    await client.query('ROLLBACK');
    console.error('Order creation error:', err);
    res.status(500).json({ message: 'Internal Server Error during order creation' });
  } finally {
    // --- Always release the client back to the pool ---
    client.release();
  }
});
// 6. Start the server and listen for incoming requests
app.listen(PORT, () => {
  console.log(`Server is up and running on http://localhost:${PORT}`);
});