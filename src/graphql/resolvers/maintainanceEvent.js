import { combineResolvers } from 'graphql-resolvers';

import { isAdmin } from '../../utils/authorization';
import { transformEvent } from '../../utils/transform';
import { UserInputError } from 'apollo-server';

export default {
  Query: {
    maintainanceEvents: combineResolvers(isAdmin, async (_, __, { models }) => {
      const events = await models.MaintainanceEvent.find();

      return events.map(event => {
        return transformEvent(event);
      });
    }),

    maintainanceEventsByUser: combineResolvers(
      isAdmin,
      async (_, { userId }, { models }) => {
        const events = await models.MaintainanceEvent.find({ creator: userId });
        return events.map(event => {
          return transformEvent(event);
        });
      }
    ),

    maintainanceEventsByDevice: combineResolvers(
      isAdmin,
      async (_, { deviceId }, { models }) => {
        const events = await models.MaintainanceEvent.find({
          device: deviceId,
        });
        return events.map(event => {
          return transformEvent(event);
        });
      }
    ),
    lastestMaintainEvent: combineResolvers(
      isAdmin,
      async (_, { deviceId }, { models }) => {
        const [event] = await models.MaintainanceEvent.find({
          device: deviceId,
        })
          .sort({ createdAt: -1 })
          .limit(1);

        if (event) {
          return transformEvent(event);
        } else {
          return null;
        }
      }
    ),
  },

  Mutation: {
    createMaintainEvent: combineResolvers(
      isAdmin,
      async (_, { deviceId, maintainanceInfo }, { models, me }) => {
        const device = await models.Device.findById(deviceId);

        if (device.availability === 'liquidated') {
          throw new Error('Device has been liquidated!');
        }

        if (device.activeState) {
          throw new UserInputError(
            'Device still on! You should turn it off before continue!',
            {
              name: 'DeviceStillOn',
              invalidArg: 'deviceId',
            }
          );
        }

        const isDeviceMaintained = device.availability === 'maintaining';
        let maintainedInterval = 0;

        if (isDeviceMaintained) {
          const [lastestStartEvent] = await models.MaintainanceEvent.find({
            device: deviceId,
            actionType: true,
          })
            .sort({ createdAt: -1 })
            .limit(1);

          if (!lastestStartEvent) {
            // TODO: Handle this situation in the future
            throw new Error(
              'There is a leak in database! Lastest Start Maintain Event does not exist!'
            );
          }

          maintainedInterval = Date.now() - lastestStartEvent.createdAt;
          device.availability = 'working';
        } else {
          device.availability = 'maintaining';
        }

        const event = await models.MaintainanceEvent.create({
          actionType: !isDeviceMaintained,
          creator: me.id,
          device: deviceId,
          maintainedInterval,
          maintainance: maintainanceInfo,
        });

        await device.save();

        return transformEvent(event);
      }
    ),
    //* This resolver is deprecated
    createStartMaintainEvent: combineResolvers(
      isAdmin,
      async (_, { deviceId, maintainanceInfo }, { models, me }) => {
        const device = await models.Device.findById(deviceId);

        if (device.availability === 'liquidated') {
          throw new UserInputError('Device has been liquidated!', {
            name: 'DeviceLiquidated',
            invalidArg: 'deviceId',
          });
        }

        if (device.availability === 'maintaining') {
          // TODO: Handle this situation in the future
          throw new UserInputError('Device is under maintainance!', {
            name: 'DeviceUnderMaintainance',
            invalidArg: 'deviceId',
          });
        }

        if (device.activeState) {
          throw new UserInputError(
            'Device still on! You should turn it off before continue!',
            {
              name: 'DeviceStillOn',
              invalidArg: 'deviceId',
            }
          );
        }

        const event = await models.MaintainanceEvent.create({
          actionType: true,
          creator: me.id,
          device: deviceId,
          maintainance: maintainanceInfo,
        });

        device.availability = 'maintaining';
        await device.save();

        return transformEvent(event);
      }
    ),
  },
};
