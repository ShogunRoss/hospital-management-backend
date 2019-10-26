import { gql } from 'apollo-server-express';

import userSchema from './user';
import deviceSchema from './device';
import activeEventSchema from './activeEvent';
import maintainanceSchema from './maintainanceEvent';
import liquidationSchema from './liquidationEvent';
import accountantSchema from './accountantEvent';
import fileSchema from './file';

const linkSchema = gql`
  scalar Date

  type Error {
    path: String!
    message: String!
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
  maintainanceSchema,
  liquidationSchema,
  accountantSchema,
  fileSchema,
];
