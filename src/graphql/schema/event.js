import { gql } from 'apollo-server-express';

export default gql`
  type Event {
    id: ID!
    creator: User!
    device: Device!
    action: Boolean!
    createdAt: Date!
  }

  input EventInput {
    deviceId: String!
    action: Boolean!
  }

  extend type Query {
    events: [Event!]!
  }

  extend type Mutation {
    createEvent(eventInput: EventInput): Event
  }
`;
