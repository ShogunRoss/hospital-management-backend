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

  type MaintainEventResultCursor {
    data: [MaintainEvent]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  extend type Query {
    maintainEvents: MaintainEventResultCursor
    maintainEventsByUser(
      userId: ID!
      cursor: String
      limit: Int
    ): MaintainEventResultCursor
    maintainEventsByDevice(
      deviceId: ID!
      cursor: String
      limit: Int
    ): MaintainEventResultCursor
    lastestMaintainEvent(
      deviceId: ID!
      cursor: String
      limit: Int
    ): MaintainEvent
  }

  extend type Mutation {
    createMaintainEvent(
      deviceId: ID!
      maintainInfo: MaintainInfo!
    ): MaintainEvent
  }
`;
