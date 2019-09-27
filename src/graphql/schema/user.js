import { gql } from 'apollo-server-express';

export default gql`
  type AuthData {
    accessToken: String!
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
    tokenVersion: Int!
  }

  input UserInput {
    phone: String
    firstName: String
    lastName: String
  }

  extend type Query {
    users: [User!]
    user(id: ID!): User
    me: User
  }

  extend type Mutation {
    signUp(email: String!, password: String!): Boolean
    signIn(email: String!, password: String!): AuthData!
    signOut: Boolean
    sendForgotPasswordEmail(email: String!): Boolean
    passwordChange(newPassword: String!): [Error!]
    updateUser(UserInput: UserInput!): User!
    deleteUser(id: ID!): Boolean
    selfDeleteUser: Boolean
    makeAdmin(id: ID!): Boolean
  }
`;
