export const batchDevices = async (keys, models) => {
  const devices = await models.Device.find({
    _id: {
      $in: keys,
    },
  });

  return keys.map(key => devices.find(device => device.id == key));
};
