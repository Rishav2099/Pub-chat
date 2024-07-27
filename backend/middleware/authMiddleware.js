const { verifyToken } = require('../utils/jwt');

exports.authenticateToken = (req, res, next) => {
  const token = localStorage.getItem('user')

  if (!token) {
    return res.status(401).json({ message: 'Not logged in' });
  }

  try {
    req.user = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Invalid token' });
  }
};
