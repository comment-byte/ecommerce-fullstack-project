// middleware/authMiddleware.js

const jwt = require('jsonwebtoken');

// This is the same secret key you used in server.js
const JWT_SECRET = 'your_super_secret_key_that_is_long_and_random'; 

function auth(req, res, next) {
  // Get token from the header. 'x-auth-token' is a common convention.
  const token = req.header('x-auth-token');

  // Check if no token
  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);

    // Add user from payload to the request object
    req.user = decoded.user;
    next(); // Pass control to the next middleware or route handler
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
}

// middleware/authMiddleware.js

// ... (all the code for the auth function) ...

// Change the export line to this:
module.exports = {
  authMiddleware: auth
};