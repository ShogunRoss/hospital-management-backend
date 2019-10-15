import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
import deviceResolvers from './device';
import activeEventResolvers from './activeEvent';
import maintainEventResolvers from './maintainanceEvent';
import accountantEventResolvers from './accountantEvent';

const customScalarResolver = {
  Date: GraphQLDateTime,
};

export default [
  customScalarResolver,
  userResolvers,
  deviceResolvers,
  activeEventResolvers,
  maintainEventResolvers,
  accountantEventResolvers,
];
