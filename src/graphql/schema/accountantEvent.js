import { gql } from 'apollo-server-express';

export default gql`
  type AccountantEvent {
    id: ID!
    creator: User!
    device: Device!
    createdAt: Date!
  }

  extend type Query {
    accountantEvents: [AccountantEvent!]!
  }

  extend type Mutation {
    createAccountantEvent(deviceId: ID!): AccountantEvent!
  }
`;
