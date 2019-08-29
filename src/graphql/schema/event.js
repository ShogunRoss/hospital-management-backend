import { gql } from 'apollo-server-express';

export default gql`
  type Event {
    id: ID!
    creator: User!
    device: Device!
    action: Boolean!
    createdAt: Date!
  }

  extend type Query {
    events: [Event!]!
  }

  extend type Mutation {
    createEvent(deviceId: ID!): Event!
  }
`;
