const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  console.log(authHeader);
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: `Access denied! No token provided, please login to continue`,
    });
  }

  //INFO Decode this token -> Means to get user information
  try {
    const decodedTokenInfo = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log(decodedTokenInfo);

    req.userInfo = decodedTokenInfo;
    next()
  } catch (err) {
    res.status(500).json({
      success: false,
      message: `Access denied! No token provided, please login to continue`,
    });
  }
};

module.exports = authMiddleware;
