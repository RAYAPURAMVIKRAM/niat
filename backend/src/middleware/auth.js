const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'hacksphere_super_secret_jwt_key_2026';

/**
 * Middleware to require JWT authentication
 */
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      error: 'Access token required',
      message: 'Please provide a valid Bearer token in the Authorization header'
    });
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (err) {
      return res.status(403).json({
        error: 'Invalid or expired token',
        message: err.message
      });
    }

    req.user = decodedUser;
    next();
  });
};

/**
 * Optional authentication: attaches user if token is valid, continues if not
 */
const optionalAuth = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    req.user = null;
    return next();
  }

  jwt.verify(token, JWT_SECRET, (err, decodedUser) => {
    if (!err && decodedUser) {
      req.user = decodedUser;
    } else {
      req.user = null;
    }
    next();
  });
};

module.exports = {
  authenticateToken,
  optionalAuth,
  JWT_SECRET,
};
