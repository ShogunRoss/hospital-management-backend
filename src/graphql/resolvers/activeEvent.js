import { combineResolvers } from 'graphql-resolvers';

import { isAdmin, isAuthenticated } from '../../utils/authorization';
import { transformEvent } from '../../utils/transform';
import { UserInputError } from 'apollo-server';

export default {
  Query: {
    activeEvents: combineResolvers(isAdmin, async (_, __, { models }) => {
      const events = await models.ActiveEvent.find();

      return events.map(event => {
        return transformEvent(event);
      });
    }),

    activeEventsByUser: combineResolvers(
      isAdmin,
      async (_, { userId }, { models }) => {
        const events = await models.ActiveEvent.find({ creator: userId });
        return events.map(event => {
          return transformEvent(event);
        });
      }
    ),

    activeEventsByDevice: combineResolvers(
      isAdmin,
      async (_, { deviceId }, { models }) => {
        const events = await models.ActiveEvent.find({ device: deviceId });
        return events.map(event => {
          return transformEvent(event);
        });
      }
    ),
  },

  Mutation: {
    createActiveEvent: combineResolvers(
      isAuthenticated,
      async (_, { deviceId }, { models, me }) => {
        const device = await models.Device.findById(deviceId);

        if (device.availability === 'maintaining') {
          throw new UserInputError('Device is under maintainance!', {
            name: 'DeviceUnderMaintainance',
            invalidArg: 'deviceId',
          });
        }

        if (device.availability === 'liquidated') {
          throw new UserInputError('Device has been liquidated!', {
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
