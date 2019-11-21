import { UserInputError } from 'apollo-server';
import { transformLeanEvent } from './transform';

export default async (model, condition, cursor, limit) => {
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

  const allEvents = await model
    .find(condition)
    .sort('-createdAt')
    .lean();
  const unlimitedEvents = allEvents.map(event => {
    if (event.createdAt < cursor) {
      return transformLeanEvent(event);
    }
  });
  const events =
    limit !== 0 ? unlimitedEvents.slice(0, limit) : unlimitedEvents;

  return {
    data: events,
    pageInfo: {
      endCursor: events[events.length - 1].createdAt,
      hasNextPage: limit !== 0 ? unlimitedEvents.length > limit : false,
    },
    totalCount: allEvents.length,
  };
};
