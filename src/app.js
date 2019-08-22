import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import bodyParser from 'body-parser';
import mongoose from 'mongoose';
import DataLoader from 'dataloader';
import 'dotenv/config';

import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
import models from './models';
import loaders from './loaders';
import getMe from './utils/getMe';

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
          loaders: {
            user: new DataLoader(keys => loaders.user.batchUsers(keys, models))
          }
        };
      }

      if (req) {
        const me = await getMe(req);

        return {
          models,
          me,
          secret: process.env.SECRET,
          loaders: {
            user: new DataLoader(keys => loaders.user.batchUsers(keys, models))
          }
        };
      }
    }
  });

  server.applyMiddleware({ app, path: '/graphql' });

  await mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: true
  });
  app.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
};
