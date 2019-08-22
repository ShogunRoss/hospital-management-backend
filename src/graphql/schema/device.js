import { gql } from 'apollo-server-express';

export default gql`
  type Device {
    id: ID!
    deviceId: String!
    title: String!
    model: String!
    manufacturer: String!
    origin: String!
    manufacturedYear: String!
    startUseTime: Date!
    startUseState: Boolean!
    price: Int!
    falcuty: String!
    currentState: Boolean!
    createEvents: [Event!]
  }

  input DeviceInput {
    deviceId: String!
    title: String!
    model: String!
    manufacturer: String!
    origin: String!
    manufacturedYear: String!
    startUseTime: Date!
    startUseState: Boolean!
    price: Int!
    falcuty: String!
  }

  extend type Query {
    devices: [Device!]
    device(deviceId: String!): Device!
  }

  extend type Mutation {
    addDevice(deviceInput: DeviceInput): Device
    updateDevice(deviceInput: DeviceInput): Device
    deleteDevice(deviceId: String!): Boolean!
  }
`;
