import { gql } from 'apollo-server-express';

export default gql`
  type Liquidation {
    name: String
    address: String
    phone: String
    note: String
    price: Int!
  }

  type LiquidationEvent {
    id: ID!
    creator: User!
    device: Device!
    createdAt: Date!
    maintainance: Liquidation!
  }

  extend type Query {
    liquidationEvents: [LiquidationEvent!]!
  }

  extend type Mutation {
    createLiquidationEvent(deviceId: ID!): LiquidationEvent!
  }
`;
