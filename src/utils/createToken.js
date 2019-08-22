import jwt from 'jsonwebtoken';

export default async (user, secret, expiresIn) => {
  const { id, email, username, role } = user;
  return await jwt.sign(
    { id, email, username, role },
    secret,
    expiresIn && { expiresIn }
  );
};
