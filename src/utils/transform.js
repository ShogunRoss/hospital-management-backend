import DataLoader from 'dataloader';

import loaders from '../loaders';
import models from '../models';

const userLoader = new DataLoader(keys => loaders.batchUsers(keys, models));

const deviceLoader = new DataLoader(keys => loaders.batchDevices(keys, models));

const userOne = async userId => {
  const user = await userLoader.load(userId);

  return transformUser(user);
};

const deviceOne = async deviceId => {
  const device = await deviceLoader.load(deviceId);

  return transformDevice(device);
};

export const transformUser = user => {
  return {
    ...user._doc,
    id: user.id,
    password: null,
  };
};

export const transformDevice = async device => {
  return {
    ...device._doc,
    id: device.id,
    createdBy: userOne.bind(this, device.createdBy),
  };
};

export const transformEvent = async event => {
  return {
    ...event._doc,
    id: event.id,
    creator: userOne.bind(this, event.creator),
    device: deviceOne.bind(this, event.device),
  };
};
