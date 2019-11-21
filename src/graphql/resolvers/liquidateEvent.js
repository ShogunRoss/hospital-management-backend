import { combineResolvers } from 'graphql-resolvers';
import { UserInputError } from 'apollo-server';

import { isAdmin, isAccountant } from '../../utils/authorization';
import { transformEvent } from '../../utils/transform';
import eventQuery from '../../utils/eventQuery';

export default {
  Query: {
    liquidateEvents: combineResolvers(
      isAdmin,
      async (_, { cursor = Date.now(), limit = 0 }, { models }) => {
        return await eventQuery(models.LiquidateEvent, null, cursor, limit);
      }
    ),

    liquidateEventByDevice: combineResolvers(
      isAdmin,
      async (_, { deviceId }, { models }) => {
        const [event] = await models.LiquidateEvent.find({ device: deviceId });
        return transformEvent(event);
      }
    ),

    liquidateEventsByUser: combineResolvers(
      isAdmin,
      async (_, { userId, cursor = Date.now(), limit = 0 }, { models }) => {
        return await eventQuery(
          models.LiquidateEvent,
          { creator: userId },
          cursor,
          limit
        );
      }
    ),
  },

  Mutation: {
    createLiquidateEvent: combineResolvers(
      isAccountant,
      async (_, { deviceId, liquidateInfo }, { models, me }) => {
        const device = await models.Device.findById(deviceId);
        if (!device) {
          throw new UserInputError('No device found', {
            name: 'NoDeviceFound',
            invalidArg: 'deviceId',
          });
        }

        if (device.availability === 'liquidated') {
          throw new Error('Device was liquidated');
        }

        if (device.availability === 'maintaining') {
          const [lastestStartEvent] = await models.MaintainEvent.find({
            device: deviceId,
            finished: false,
          })
            .sort({ createdAt: -1 })
            .limit(1);

          if (!lastestStartEvent) {
            throw new Error('Database leaked');
          }

          const event = lastestStartEvent;
          // Update new info of an event
          event.maintainInterval = Date.now() - lastestStartEvent.createdAt;
          event.finished = true;
          event.receiver = me.id;
          await event.save();
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

        const event = await models.LiquidateEvent.create({
          creator: me.id,
          device: deviceId,
          liquidateInfo,
        });

        device.availability = 'liquidated';
        await device.save();

        return transformEvent(event);
      }
    ),
  },
};
