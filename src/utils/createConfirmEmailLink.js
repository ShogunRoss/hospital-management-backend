import { createConfirmToken } from './createToken';

export default async (url, user) => {
  const token = await createConfirmToken(user);

  return `${url}/confirm/${token}`;
};
