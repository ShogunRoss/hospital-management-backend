import { gql } from 'apollo-server-express';

export default gql`
  type File {
    filename: String!
    mimetype: String!
    encoding: String!
  }

  extend type Query {
    files: [String]
  }

  extend type Mutation {
    singleUpload(file: Upload!): Boolean
  }
`;
