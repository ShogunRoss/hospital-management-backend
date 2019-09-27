import { createForgotPasswordToken } from './createToken';

export default async (url, user) => {
  const token = await createForgotPasswordToken(user);

  return `${url}/change-password/${token}`;
};
