import jwt from 'jsonwebtoken';

export default async (url, userId) => {
  const token = await jwt.sign({ userId }, process.env.SECRET, {
    expiresIn: '7d',
  });

  return `${url}/confirm/${token}`;
};
