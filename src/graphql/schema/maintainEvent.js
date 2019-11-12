import { gql } from 'apollo-server-express';

export default gql`
  type Maintain {
    name: String
    address: String
    phone: String
    note: String
    cost: Int
  }

  input MaintainInfo {
    name: String
    address: String
    phone: String
    note: String
    cost: Int
  }

  type MaintainEvent {
    id: ID!
    creator: User!
    receiver: User
    device: Device!
    finished: Boolean!
    createdAt: Date!
    maintainInfo: Maintain!
    maintainInterval: Int!
  }

  extend type Query {
    maintainEvents: [MaintainEvent!]!
    maintainEventsByUser(userId: ID!): [MaintainEvent!]!
    maintainEventsByDevice(deviceId: ID!): [MaintainEvent!]!
    lastestMaintainEvent(deviceId: ID!): MaintainEvent
  }

  extend type Mutation {
    createMaintainEvent(
      deviceId: ID!
      maintainInfo: MaintainInfo!
    ): MaintainEvent
    createStartMaintainEvent(
      deviceId: ID!
      maintainInfo: MaintainInfo!
    ): MaintainEvent
  }
`;
