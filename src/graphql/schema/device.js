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
    price: Int!
    faculty: String!
    currentState: Boolean!
    createdEvents: [Event!]
    createdAt: Date!
    createdBy: User!
  }

  input DeviceInput {
    title: String!
    model: String!
    manufacturer: String!
    origin: String!
    manufacturedYear: String!
    startUseTime: Date!
    startUseState: Boolean!
    price: Int!
    faculty: String!
  }

  extend type Query {
    devices: [Device!]
    device(id: ID!): Device!
  }

  extend type Mutation {
    addDevice(deviceInput: DeviceInput): Device
    updateDevice(id: ID!, deviceInput: DeviceInput): Device
    deleteDevice(id: ID!): Boolean!
  }
`;
