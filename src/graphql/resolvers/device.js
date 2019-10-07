import { combineResolvers } from 'graphql-resolvers';

import { isAdmin, isAuthenticated } from '../../utils/authorization';
import { transformDevice } from '../../utils/transform';

export default {
  Query: {
    devices: combineResolvers(isAdmin, async (_, __, { models }) => {
      const devices = await models.Device.find();

      return devices.map(device => {
        return transformDevice(device);
      });
    }),

    device: combineResolvers(isAuthenticated, async (_, { id }, { models }) => {
      const device = await models.Device.findById(id);

      if (!device) {
        throw new Error('Device does not exist.');
      }

      return transformDevice(device);
    }),
  },

  Mutation: {
    addDevice: combineResolvers(
      isAdmin,
      async (_, { deviceInput }, { models, me }) => {
        const device = await models.Device.create({
          createdBy: me.id,
          ...deviceInput,
          currentPrice: deviceInput.originalPrice,
        });

        return transformDevice(device);
      }
    ),

    editDevice: combineResolvers(
      isAdmin,
      async (_, { id, deviceInput }, { models }) => {
        const device = await models.Device.findByIdAndUpdate(id, deviceInput, {
          new: true,
        });

        return transformDevice(device);
      }
    ),

    deleteDevice: combineResolvers(isAdmin, async (_, { id }, { models }) => {
      const device = await models.Device.findById(id);

      if (device) {
        await device.remove();
        return true;
      } else {
        return false;
      }
    }),
  },
};
