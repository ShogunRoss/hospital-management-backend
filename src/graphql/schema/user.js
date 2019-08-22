import { gql } from 'apollo-server-express';

export default gql`
  type AuthData {
    token: String!
  }

  type User {
    id: ID!
    email: String!
    password: String
    phone: String!
    firstName: String!
    lastName: String!
    createdAt: String!
    role: String
    confirmed: Boolean!
    createdEvents: [Event!]
  }

  input UserInput {
    email: String!
    password: String!
    phone: String!
    firstName: String!
    lastName: String!
  }

  input UpdateInput {
    phone: String!
    firstName: String!
    lastName: String!
  }

  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(userInput: UserInput!): AuthData!
    signIn(email: String!, password: String!): AuthData!
    updateUser(updateInput: UpdateInput!): User!
    deleteUser(id: ID!): Boolean!
    selfDeleteUser: Boolean!
  }
`;
