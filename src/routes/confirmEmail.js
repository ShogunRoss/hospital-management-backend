import jwt from 'jsonwebtoken';
import User from '../models/user';

export default async (req, res) => {
  const { token } = req.params;
  const { userId } = await jwt.verify(token, process.env.SECRET);

  if (userId) {
    await User.findByIdAndUpdate(userId, { confirmed: true });
    res.send('200 - ok');
  } else {
    res.send('404 - invalid');
  }
};
