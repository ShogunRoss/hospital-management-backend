import { combineResolvers } from 'graphql-resolvers';

import { isAdmin, isAuthenticated } from '../../utils/authorization';
import { transformEvent } from '../../utils/transfrom';

export default {
  Query: {
    events: combineResolvers(isAdmin, async (_, __, { models }) => {
      const events = await models.Event.find();

      return events.map(event => {
        return transformEvent(event);
      });
    }),
  },

  Mutation: {
    createEvent: combineResolvers(
      isAuthenticated,
      async (_, { deviceId }, { models, me }) => {
        const user = await models.User.findById(me.id);
        const device = await models.Device.findById(deviceId);

        const altDeviceState = !device.currentState;

        const event = await models.Event.create({
          creator: me.id,
          device: deviceId,
          action: altDeviceState,
        });

        user.createdEvents.push(event.id);
        device.createdEvents.push(event.id);
        device.currentState = altDeviceState;

        await user.save();
        await device.save();

        return transformEvent(event);
      }
    ),
  },
};
