import { gql } from 'apollo-server-express';

export default gql`
  type Device {
    id: ID!
    title: String!
    model: String!
    manufacturer: String!
    origin: String!
    manufacturedYear: String!
    startUseTime: Date!
    startUseState: Boolean!
    faculty: String!
    originalPrice: Int!
    currentPrice: Int!
    activeState: Boolean!
    availability: String!
    qrcode: String!
    createdAt: Date!
    createdBy: User!
  }

  type DevicesResultCursor {
    data: [Device!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  input DeviceInput {
    title: String!
    model: String!
    manufacturer: String!
    origin: String!
    manufacturedYear: String!
    startUseTime: Date!
    startUseState: Boolean!
    faculty: String!
    originalPrice: Int!
  }

  extend type Query {
    devices(cursor: String, limit: Int): DevicesResultCursor
    device(id: ID!): Device
  }

  extend type Mutation {
    addDevice(deviceInput: DeviceInput): Device
    editDevice(id: ID!, deviceInput: DeviceInput): Device
    deleteDevice(id: ID!): Boolean!
  }
`;
