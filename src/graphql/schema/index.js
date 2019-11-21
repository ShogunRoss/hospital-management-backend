import { gql } from 'apollo-server-express';

import userSchema from './user';
import deviceSchema from './device';
import activeEventSchema from './activeEvent';
import maintainSchema from './maintainEvent';
import liquidateSchema from './liquidateEvent';
import accountantSchema from './accountantEvent';
import fileSchema from './file';

const linkSchema = gql`
  scalar Date

  type Error {
    path: String!
    message: String!
  }

  type PageInfo {
    endCursor: String
    hasNextPage: Boolean!
  }

  type Query {
    _: Boolean
  }

  type Mutation {
    _: Boolean
  }
`;

export default [
  linkSchema,
  userSchema,
  deviceSchema,
  activeEventSchema,
  maintainSchema,
  liquidateSchema,
  accountantSchema,
  fileSchema,
];
