const jwt = require('jsonwebtoken');
const User = require('./User'); // Import User model to validate user existence

// Middleware to check if the user is authenticated
const isAuthenticated = (req, res, next) => {
  // Retrieve the token from the Authorization header
  const token = req.headers['authorization'];

  // If no token is provided, return an error response
  if (!token) {
    return res.status(401).json({ success: false, message: 'Token is missing' });
  }

  // Remove the 'JWT ' prefix if it exists (for example, 'JWT <token>')
  const tokenWithoutPrefix = token.replace('JWT ', '');

  // Verify the token using the secret key
  jwt.verify(tokenWithoutPrefix, process.env.SECRET_KEY, async (err, decoded) => {
    if (err) {
      // If the token is invalid or expired, return an error response
      return res.status(401).json({ success: false, message: 'Token is invalid or expired' });
    }

    // Attach the user information to the request object
    req.user = decoded;

    try {
      // Optionally, validate that the user still exists in the database (to prevent unauthorized access)
      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(401).json({ success: false, message: 'User not found' });
      }

      // If everything is fine, proceed to the next middleware or route handler
      next();
    } catch (err) {
      // Handle any unexpected errors during user lookup
      console.error(err);
      res.status(500).json({ success: false, message: 'Failed to verify user' });
    }
  });
};

module.exports = { isAuthenticated };