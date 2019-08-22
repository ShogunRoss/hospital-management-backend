import { GraphQLDateTime } from 'graphql-iso-date';

import userResolvers from './user';
// import deviceResolvers from './device';
// import eventResolvers from './event';

const customScalarResolver = {
  Date: GraphQLDateTime
};

export default [
  customScalarResolver,
  userResolvers
  // deviceResolvers,
  // eventResolvers
];
