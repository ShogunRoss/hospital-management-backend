import { gql } from 'apollo-server-express';

import userSchema from './user';
import deviceSchema from './device';
import eventSchema from './event';

const linkSchema = gql`
  scalar Date

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export default [linkSchema, userSchema, deviceSchema, eventSchema];
