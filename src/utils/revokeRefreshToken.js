import models from '../models';

export default async userId => {
  await models.User.findByIdAndUpdate(
    { _id: userId },
    { $inc: { tokenVersion: 1 } }
  );
};
