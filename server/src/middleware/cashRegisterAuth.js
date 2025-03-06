import jwt from 'jsonwebtoken';

const WaiterVerify = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET_KEY, (err, user) => {
      if (err) {
        return res.status(403).json({
          message: 'Token uyuşmuyor.',
        });
      }
      req.user = user;
      if (Number(user.level) === 3) {
        return next();
      }
      return res.status(401).json({ message: 'Yetkisiz giriş denemesi.' });
    });
  } else {
    return res.status(401).json({ message: 'Yetkisiz giriş denemesi.' });
  }
};

export default WaiterVerify;
