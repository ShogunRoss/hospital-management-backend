import { createRefreshToken, createAccessToken } from '../utils/createToken';
import { verify } from 'jsonwebtoken';
import User from '../models/user';
import sendRefreshToken from '../utils/sendRefreshToken';

export default async (req, res) => {
  const token = req.cookies.jid;
  if (!token) {
    return res.send({ ok: false, accessToken: '' });
  }

  let payload = null;
  try {
    payload = verify(token, process.env.REFRESH_TOKEN_SECRET);
  } catch (err) {
    console.log(err);
    return res.send({ ok: false, accessToken: '' });
  }

  // token is valid and we can send back an access token
  const user = await User.findById(payload.userId);

  if (!user) {
    return res.send({ ok: false, accessToken: '' });
  }

  if (user.tokenVersion !== payload.tokenVersion) {
    return res.send({ ok: false, accessToken: '' });
  }

  sendRefreshToken(res, await createRefreshToken(user));

  return res.send({ ok: true, accessToken: await createAccessToken(user) });
};
