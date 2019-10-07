import { gql } from 'apollo-server-express';

export default gql`
  type ActiveEvent {
    id: ID!
    creator: User!
    device: Device!
    actionType: Boolean!
    createdAt: Date!
    usedInterval: Int!
    reported: Boolean!
  }

  extend type Query {
    activeEvents: [ActiveEvent!]!
    activeEventsByUser(userId: ID!): [ActiveEvent!]!
    activeEventsByDevice(deviceId: ID!): [ActiveEvent!]!
  }

  extend type Mutation {
    createActiveEvent(deviceId: ID!): ActiveEvent!
  }
`;
