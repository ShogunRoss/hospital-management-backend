import jwt from 'jsonwebtoken';

export const createAccessToken = async user => {
  const { id, email, role } = user;
  return await jwt.sign({ id, email, role }, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: '15m',
  });
};

export const createRefreshToken = async user => {
  return await jwt.sign(
    { userId: user.id, tokenVersion: user.tokenVersion },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );
};

export const createConfirmToken = async user => {
  return await jwt.sign({ userId: user.id }, process.env.CONFIRM_TOKEN_SECRET, {
    expiresIn: '7d',
  });
};

export const createForgotPasswordToken = async user => {
  const { id, password } = user;
  return await jwt.sign(
    { userId: id, password },
    process.env.PASSWORD_TOKEN_SECRET,
    {
      expiresIn: '1d',
    }
  );
};
