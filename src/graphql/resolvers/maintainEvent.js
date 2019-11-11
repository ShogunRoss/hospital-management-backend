import { combineResolvers } from 'graphql-resolvers';

import { isAdmin } from '../../utils/authorization';
import { transformEvent } from '../../utils/transform';
import { UserInputError, ApolloError } from 'apollo-server';

export default {
  Query: {
    maintainEvents: combineResolvers(isAdmin, async (_, __, { models }) => {
      const events = await models.MaintainEvent.find();

      return events.map(event => {
        return transformEvent(event);
      });
    }),

    maintainEventsByUser: combineResolvers(
      isAdmin,
      async (_, { userId }, { models }) => {
        const events = await models.MaintainEvent.find({ creator: userId });
        return events.map(event => {
          return transformEvent(event);
        });
      }
    ),

    maintainEventsByDevice: combineResolvers(
      isAdmin,
      async (_, { deviceId }, { models }) => {
        const events = await models.MaintainEvent.find({
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
        const [event] = await models.MaintainEvent.find({
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
      async (_, { deviceId, maintainInfo }, { models, me }) => {
        const device = await models.Device.findById(deviceId);
        let event;

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

        const isDeviceMaintain = device.availability === 'maintaining';

        if (isDeviceMaintain) {
          const [lastestStartEvent] = await models.MaintainEvent.find({
            device: deviceId,
            finished: false,
          })
            .sort({ createdAt: -1 })
            .limit(1);

          if (!lastestStartEvent) {
            device.availability = 'active';
            await device.save();
            throw new ApolloError(
              'Database Leaked! Lastest Start Maintain Event does not exist!',
              'DATABASE_LEAKED',
              { name: 'DatabaseLeaked' }
            );
          }

          event = lastestStartEvent;
          // Update new info of an event
          event.maintainInterval = Date.now() - lastestStartEvent.createdAt;
          event.finished = true;
          event.receiver = me.id;
          event.maintainInfo = maintainInfo;
          await event.save();

          device.availability = 'active';
          await device.save();
        } else {
          device.availability = 'maintaining';
          await device.save();
          event = await models.MaintainEvent.create({
            creator: me.id,
            device: deviceId,
            maintainInfo,
          });
        }

        return transformEvent(event);
      }
    ),
    //* This resolver is deprecated
    createStartMaintainEvent: combineResolvers(
      isAdmin,
      async (_, { deviceId, maintainInfo }, { models, me }) => {
        const device = await models.Device.findById(deviceId);

        if (device.availability === 'liquidated') {
          throw new UserInputError('Device has been liquidated!', {
            name: 'DeviceLiquidated',
            invalidArg: 'deviceId',
          });
        }

        if (device.availability === 'maintaining') {
          // TODO: Handle this situation in the future
          throw new UserInputError('Device is under maintain!', {
            name: 'DeviceUnderMaintain',
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

        const event = await models.MaintainEvent.create({
          creator: me.id,
          device: deviceId,
          maintainInfo,
        });

        device.availability = 'maintaining';
        await device.save();

        return transformEvent(event);
      }
    ),
  },
};
