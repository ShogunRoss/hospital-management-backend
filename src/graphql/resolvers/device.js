import { combineResolvers } from 'graphql-resolvers';

import { isAdmin, isAuthenticated } from '../../utils/authorization';
import { transformDevice, transformLeanDevice } from '../../utils/transform';
import { UserInputError } from 'apollo-server';
import genQRCode from '../../utils/genQRCode';

export default {
  Query: {
    devices: combineResolvers(
      isAdmin,
      async (_, { cursor = Date.now(), limit = 0 }, { models }) => {
        if (limit < 0) {
          throw new UserInputError('Limit must be positive', {
            invalidArg: 'limit',
          });
        }

        if (!cursor) {
          throw new UserInputError('Cursor is not valid', {
            invalidArg: 'cursor',
          });
        }

        const allDevices = await models.Device.find()
          .sort('-createdAt')
          .lean();
        const unlimitedDevices = allDevices.map(device => {
          if (device.createdAt < cursor) {
            return transformLeanDevice(device);
          }
        });
        const devices =
          limit !== 0 ? unlimitedDevices.slice(0, limit) : unlimitedDevices;

        return {
          data: devices,
          pageInfo: {
            endCursor: devices[devices.length - 1].createdAt,
            hasNextPage: limit !== 0 ? unlimitedDevices.length > limit : false,
          },
          totalCount: allDevices.length,
        };
      }
    ),

    device: combineResolvers(isAuthenticated, async (_, { id }, { models }) => {
      const device = await models.Device.findById(id);

      if (!device) {
        throw new UserInputError('No device found', {
          name: 'NoDeviceFound',
          invalidArg: 'id',
        });
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

        device.qrcode = genQRCode(device.id);
        const result = await device.save();

        return transformDevice(result);
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
        throw new UserInputError('No device found', {
          name: 'NoDeviceFound',
          invalidArg: 'id',
        });
      }
    }),
  },
};
