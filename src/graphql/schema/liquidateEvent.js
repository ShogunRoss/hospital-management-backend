import { gql } from 'apollo-server-express';

export default gql`
  type LiquidateInfo {
    name: String
    address: String
    phone: String
    note: String
    price: Int!
  }

  type LiquidateEvent {
    id: ID!
    creator: User!
    device: Device!
    createdAt: Date!
    liquidateInfo: LiquidateInfo!
  }

  extend type Query {
    liquidateEvents: [LiquidateEvent]
    liquidateEventByDevice(deviceId: ID!): LiquidateEvent
    liquidateEventsByUser(userId: ID!): [LiquidateEvent]
  }

  extend type Mutation {
    createLiquidateEvent(deviceId: ID!): LiquidateEvent!
  }
`;
