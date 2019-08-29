import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import 'dotenv/config';

import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
import models from './models';
import getMe from './utils/getMe';
// import userLoader from './utils/userLoader';

export default async () => {
  const port = process.env.PORT || 8000;
  const app = express();

  app.use(bodyParser.json());
  app.use(cors());

  const server = new ApolloServer({
    introspection: true,
    playground: true,
    typeDefs: schema,
    resolvers,
    context: async ({ req, connection }) => {
      if (connection) {
        return {
          models,
          // loaders: {
          //   user: userLoader
          // }
        };
      }

      if (req) {
        const me = await getMe(req);

        return {
          models,
          me,
          secret: process.env.SECRET,
          // loaders: {
          //   user: userLoader
          // }
        };
      }
    },
  });

  server.applyMiddleware({ app, path: '/graphql' });

  await mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  app.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
};
