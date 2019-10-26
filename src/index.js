import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import mongoose from 'mongoose';
import 'dotenv/config';

import schema from './graphql/schema';
import resolvers from './graphql/resolvers';
import models from './models';
import getMe from './utils/getMe';
import confirmEmail from './routes/confirmEmail';
import refreshToken from './routes/refreshToken';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
// import userLoader from './utils/userLoader';

const imagesDir = path.join(__dirname, '../images');

const App = async () => {
  const port = process.env.PORT || 8000;
  const app = express();

  app.use(cookieParser());
  app.use(
    cors({
      origin: 'http://localhost:3000',
      credentials: true,
    })
  );

  app.get('/', (_, res) => res.send('Welcome to hospital management backend.'));
  app.get('/confirm/:confirmToken', confirmEmail);
  app.post('/refresh-token', refreshToken);

  const apolloServer = new ApolloServer({
    introspection: true,
    playground: true,
    typeDefs: schema,
    resolvers,
    context: async ({ req, res, connection }) => {
      // * connection is used for Graphql Subscriptions which we haven't implemented.
      if (connection) {
        return {
          models,
        };
      }

      if (req) {
        const me = await getMe(req);

        return {
          models,
          me,
          url: req.protocol + '://' + req.get('host'),
          res,
        };
      }
    },
  });

  existsSync(imagesDir) || mkdirSync(imagesDir);
  app.use('/images', express.static(imagesDir));
  apolloServer.applyMiddleware({ app, cors: false });

  await mongoose.connect(process.env.MONGO_DB, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });

  app.listen({ port }, () => {
    console.log(`Apollo Server on http://localhost:${port}/graphql`);
  });
};

App();

export default App;
