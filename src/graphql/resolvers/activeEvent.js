import { combineResolvers } from 'graphql-resolvers';
import { UserInputError } from 'apollo-server';

import { isAdmin, isAuthenticated } from '../../utils/authorization';
import { transformEvent } from '../../utils/transform';
import eventQuery from '../../utils/eventQuery';

export default {
  Query: {
    activeEvents: combineResolvers(
      isAdmin,
      async (_, { cursor = Date.now(), limit = 0 }, { models }) => {
        return await eventQuery(models.ActiveEvent, null, cursor, limit);
      }
    ),

    activeEventsByUser: combineResolvers(
      isAdmin,
      async (_, { userId, cursor = Date.now(), limit = 0 }, { models }) => {
        return await eventQuery(
          models.ActiveEvent,
          { creator: userId },
          cursor,
          limit
        );
      }
    ),

    activeEventsByDevice: combineResolvers(
      isAdmin,
      async (_, { deviceId, cursor = Date.now(), limit = 0 }, { models }) => {
        return await eventQuery(
          models.ActiveEvent,
          { device: deviceId },
          cursor,
          limit
        );
      }
    ),
  },

  Mutation: {
    createActiveEvent: combineResolvers(
      isAuthenticated,
      async (_, { deviceId }, { models, me }) => {
        const device = await models.Device.findById(deviceId);

        if (device.availability === 'maintaining') {
          throw new UserInputError('Device is under maintain', {
            name: 'DeviceUnderMaintain',
            invalidArg: 'deviceId',
          });
        }

        if (device.availability === 'liquidated') {
          throw new UserInputError('Device was liquidated', {
            name: 'DeviceLiquidated',
            invalidArg: 'deviceId',
          });
        }

        const actionType = !device.activeState;
        let usedInterval = 0;

        if (actionType === false) {
          // if action is TURN OFF
          const [lastestOnEvent] = await models.ActiveEvent.find({
            device: deviceId,
            actionType: true,
          })
            .sort({ createdAt: -1 })
            .limit(1);

          if (lastestOnEvent) {
            usedInterval = Date.now() - lastestOnEvent.createdAt;
          }
        }

        const event = await models.ActiveEvent.create({
          actionType,
          creator: me.id,
          device: deviceId,
          usedInterval,
        });

        device.activeState = actionType;
        await device.save();

        return transformEvent(event);
      }
    ),
  },
};
