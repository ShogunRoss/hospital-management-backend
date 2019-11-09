import DataLoader from 'dataloader';

import loaders from '../loaders';
import models from '../models';
import dateToString from './dateToString';

const userLoader = new DataLoader(keys => loaders.batchUsers(keys, models));

const deviceLoader = new DataLoader(keys => loaders.batchDevices(keys, models));

const userOne = async userId => {
  const user = await userLoader.load(userId.toString());

  return transformUser(user);
};

const deviceOne = async deviceId => {
  const device = await deviceLoader.load(deviceId.toString());

  return transformDevice(device);
};

export const transformUser = user => {
  return {
    ...user._doc,
    id: user.id,
    password: null,
    createdAt: dateToString(user._doc.createdAt),
  };
};

export const transformDevice = device => {
  return {
    ...device._doc,
    id: device.id,
    createdBy: userOne.bind(this, device._doc.createdBy),
    createdAt: dateToString(device._doc.createdAt),
  };
};

export const transformEvent = event => {
  return {
    ...event._doc,
    id: event.id,
    creator: userOne.bind(this, event._doc.creator),
    device: deviceOne.bind(this, event._doc.device),
    createdAt: dateToString(event._doc.createdAt),
  };
};
