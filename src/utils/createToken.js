import jwt from 'jsonwebtoken';

export default async (user, expiresIn) => {
  const { id, email, role } = user;
  return await jwt.sign(
    { id, email, role },
    process.env.SECRET,
    expiresIn && { expiresIn }
  );
};
