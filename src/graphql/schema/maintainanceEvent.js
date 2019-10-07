import { gql } from 'apollo-server-express';

export default gql`
  type Maintainance {
    name: String
    address: String
    phone: String
    note: String
    cost: Int
  }

  input MaintainanceInfo {
    name: String
    address: String
    phone: String
    note: String
    cost: Int
  }

  type MaintainanceEvent {
    id: ID!
    creator: User!
    device: Device!
    actionType: Boolean!
    createdAt: Date!
    maintainance: Maintainance!
    maintainedInterval: Int!
  }

  extend type Query {
    maintainanceEvents: [MaintainanceEvent!]!
    maintainanceEventsByUser: [MaintainanceEvent!]!
    maintainanceEventsByDevice: [MaintainanceEvent!]!
    lastestMaintainEvent(deviceId: ID!): MaintainanceEvent
  }

  extend type Mutation {
    createMaintainEvent(
      deviceId: ID!
      maintainanceInfo: MaintainanceInfo!
    ): MaintainanceEvent!
    createStartMaintainEvent(
      deviceId: ID!
      maintainanceInfo: MaintainanceInfo!
    ): MaintainanceEvent!
  }
`;
