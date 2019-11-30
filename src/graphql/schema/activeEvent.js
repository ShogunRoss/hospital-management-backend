import { gql } from 'apollo-server-express';

export default gql`
  type ActiveEvent {
    id: ID!
    creator: User!
    device: Device!
    actionType: Boolean!
    createdAt: Date!
    usedInterval: Int!
    reported: Boolean!
  }

  type ActiveEventResultCursor {
    data: [ActiveEvent]
    pageInfo: PageInfo!
    totalCount: Int!
  }

  extend type Query {
    activeEvents(cursor: String, limit: Int): ActiveEventResultCursor
    activeEventsByUser(
      userId: ID!
      cursor: String
      limit: Int
    ): ActiveEventResultCursor
    activeEventsByDevice(
      deviceId: ID!
      cursor: String
      limit: Int
    ): ActiveEventResultCursor
  }

  extend type Mutation {
    createActiveEvent(deviceId: ID!, reported: Boolean): ActiveEvent!
  }
`;
