import { gql } from 'apollo-server-express';

export default gql`
  type AuthData {
    accessToken: String!
  }

  type User {
    id: ID!
    email: String!
    password: String
    phone: String
    firstName: String
    lastName: String
    createdAt: Date!
    role: String!
    confirmed: Boolean!
    tokenVersion: Int!
    avatar: String
  }

  type UsersResultCursor {
    data: [User!]!
    pageInfo: PageInfo!
    totalCount: Int!
  }

  input UserInput {
    phone: String
    firstName: String
    lastName: String
  }

  extend type Query {
    users(cursor: String, limit: Int): UsersResultCursor
    user(id: ID!): User
    me: User!
  }

  extend type Mutation {
    signUp(email: String!, password: String!): Boolean
    signIn(email: String!, password: String!): AuthData!
    signOut: Boolean
    confirmEmail(confirmToken: String!): Boolean
    forgotPassword(email: String!): Boolean
    changePassword(oldPassword: String!, newPassword: String!): Boolean
    resetPassword(newPassword: String!, passwordToken: String!): Boolean
    updateUser(userInput: UserInput!): User
    deleteUser(id: ID!): Boolean
    selfDeleteUser: Boolean
    makeAdmin(id: ID!): Boolean
  }
`;
