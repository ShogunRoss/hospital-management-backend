import { createConfirmToken, createForgotPasswordToken } from './createToken';

const createConfirmEmailLink = async (url, email) => {
  const token = await createConfirmToken(email);

  return `${url}/confirm/${token}`;
};

const createForgotPasswordLink = async (url, user) => {
  const token = await createForgotPasswordToken(user);

  return `${url}/reset-password/${token}`;
};

export { createConfirmEmailLink, createForgotPasswordLink };
