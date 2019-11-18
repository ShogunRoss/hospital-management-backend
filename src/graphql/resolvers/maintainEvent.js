import { combineResolvers } from 'graphql-resolvers';

import { isAdmin } from '../../utils/authorization';
import { transformEvent } from '../../utils/transform';
import { UserInputError } from 'apollo-server';

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
          finished: false,
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

        if (!device) {
          throw new UserInputError('No device found', {
            name: 'NoDeviceFound',
            invalidArg: 'deviceId',
          });
        }

        let event;

        if (device.availability === 'liquidated') {
          throw new Error('Device was liquidated');
        }

        if (device.activeState) {
          const [lastestOnEvent] = await models.ActiveEvent.find({
            device: deviceId,
            actionType: true,
          })
            .sort({ createdAt: -1 })
            .limit(1);

          if (!lastestOnEvent) {
            //TODO: Handle later
            throw new Error('Database leaked');
          }

          await models.ActiveEvent.create({
            actionType: false,
            creator: me.id,
            device: deviceId,
            usedInterval: Date.now() - lastestOnEvent.createdAt,
          });
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
            throw new Error('Database leaked');
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
  },
};
