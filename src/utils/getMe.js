import jwt from 'jsonwebtoken';
import { AuthenticationError } from 'apollo-server';

export default async req => {
  const authHeader = req.get('Authorization');

  if (authHeader) {
    const token = authHeader.split(' ')[1];
    try {
      return await jwt.verify(token, process.env.SECRET);
    } catch (e) {
      throw new AuthenticationError('Your session expired. Sign in again.');
    }
  }
};
