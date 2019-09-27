import jwt from 'jsonwebtoken';
import User from '../models/user';

export default async (req, res) => {
  const { token } = req.params;
  try {
    const { userId } = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (userId) {
      await User.findByIdAndUpdate(userId, { confirmed: true });
      res.send('200 - ok');
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
