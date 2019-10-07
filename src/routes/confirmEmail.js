import jwt from 'jsonwebtoken';
import User from '../models/user';

export default async (req, res) => {
  const { confirmToken } = req.params;
  console.log(confirmToken);
  try {
    const { email } = await jwt.verify(
      confirmToken,
      process.env.CONFIRM_TOKEN_SECRET
    );

    if (email) {
      await User.findOneAndUpdate({ email }, { confirmed: true });
      res.redirect(process.env.FRONTEND_URL + `/confirm/${confirmToken}`);
    } else {
      res.send('404 - invalid');
    }
  } catch (err) {
    if (err) {
      res.send(`error - ${err.name} - ${err.message}`);
      throw err;
    }
  }
};
