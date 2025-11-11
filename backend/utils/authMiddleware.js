const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET || 'replace_with_a_long_secret';

module.exports = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if(!authHeader) return res.status(401).json({msg: 'No token'});
  const token = authHeader.split(' ')[1];
  if(!token) return res.status(401).json({msg: 'No token'});
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({msg: 'Invalid token'});
  }
};
