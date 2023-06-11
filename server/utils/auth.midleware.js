import jwt from 'jsonwebtoken';

export const checkAuth = (req, res, next) => {
  try {
    console.log('Token >>> ');
    console.log(req.headers.authorization.split('Bearer')[1].trim());
    const token = req.headers.authorization.split('Bearer')[1].trim();
    if (!token) {
      return res.status(400).json({ message: 'Not authorization' });
    }
    const decoded = jwt.verify(token, process.env.TOKEN_PASSWORD);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json('Not authorization');
  }
};
