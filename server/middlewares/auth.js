import jwt from 'jsonwebtoken';

import { unAuthenticatedError } from '../errors/index.js';

const authenticateUser = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // check header
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    throw new unAuthenticatedError('Authoriztion Invalid');
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: payload.userId };
    next();
  } catch (error) {
    throw new unAuthenticatedError('Authentication Invalid');
  }
};

export default authenticateUser;
