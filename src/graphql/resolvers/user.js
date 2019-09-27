import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';

import { isAdmin, isAuthenticated, isOwner } from '../../utils/authorization';
import { createAccessToken } from '../../utils/createToken';
import { transformUser } from '../../utils/transfrom';
import sendConfirmEmail from '../../utils/sendConfirmEmail';
import createConfirmEmailLink from '../../utils/createConfirmEmailLink';
import createForgotPasswordLink from '../../utils/createForgotPasswordLink';
import sendForgotPasswordEmail from '../../utils/sendForgotPasswordEmail';
import sendRefreshToken from '../../utils/sendRefreshToken';
import { createRefreshToken } from '../../utils/createToken';

export default {
  Query: {
    users: async (_, __, { models }) => {
      const users = await models.User.find();

      return users.map(user => {
        return transformUser(user);
      });
    },

    user: async (_, { id }, { models }) => {
      const user = await models.User.findById(id);

      return transformUser(user);
    },

    me: async (_, __, { models, me }) => {
      if (!me) {
        return null;
      }

      const user = await models.User.findById(me.id);

      return transformUser(user);
    },
  },

  Mutation: {
    signUp: async (_, { email, password }, { models, url }) => {
      const userAlreadyExist = await models.User.findOne({ email });

      if (userAlreadyExist) {
        throw new Error('Email is already taken.');
      }
      const user = await models.User.create({
        email,
        password,
      });

      if (process.env.NODE_ENV !== 'test') {
        await sendConfirmEmail(email, await createConfirmEmailLink(url, user));
      } else {
        user.confirmed = true;
        await user.save();
      }

      return null;
    },

    signIn: async (_, { email, password }, { models, res }) => {
      const user = await models.User.findOne({ email });

      if (!user) {
        throw new UserInputError('No user found with this login credentials.');
      }

      if (!user.confirmed) {
        throw new Error('User still does not confirmed email');
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      sendRefreshToken(res, await createRefreshToken(user));

      return { accessToken: await createAccessToken(user, '1h') };
    },

    signOut: async (_, __, { res }) => {
      //?: Apply Redis to blacklist the revoked token. Follow instructions: https://dev.to/cea/using-redis-for-token-blacklisting-in-node-js-42g7 https://blog.hasura.io/best-practices-of-using-jwt-with-graphql/
      console.log('signout');
      sendRefreshToken(res, '');
      return true;
    },

    sendForgotPasswordEmail: async (_, { email }, { models }) => {
      const user = await models.User.findOne({ email });

      // *: If check user avaibility here, we might expose our user emails to the attacker - so we will send to whatever email user enter to avoid this scheme.
      // *: But it will take a lot of our Email API. So consider this in the future

      if (!user) {
        throw new Error('User do not exist');
      }

      await sendForgotPasswordEmail(
        email,
        await createForgotPasswordLink('http://localhost:3000', user)
      );

      return true;
    },

    passwordChange: async (_, { newPassword, token }, { models }) => {
      try {
        const { userId, password } = await jwt.verify(
          token,
          process.env.ACCESS_TOKEN_SECRET
        );

        if (userId) {
          const user = await models.User.findById(userId);
          if (user.password === password) {
            //TODO: implement later
            user.password = newPassword;
            user.save();

            return true;
          } else {
            throw new Error('Invalid Token');
          }
        }
      } catch (err) {
        if (err) {
          throw err;
        }
      }
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (_, { userInput }, { models, me }) => {
        const user = await models.User.findByIdAndUpdate(me.id, userInput, {
          new: true,
        });
        return transformUser(user);
      }
    ),

    deleteUser: combineResolvers(isAdmin, async (_, { id }, { models }) => {
      const user = await models.User.findById(id);

      if (user) {
        await user.remove();
        return true;
      } else {
        return false;
      }
    }),

    selfDeleteUser: combineResolvers(
      isAuthenticated,
      async (_, __, { models, me }) => {
        const user = await models.User.findById(me.id);

        if (user) {
          await user.remove();
          return true;
        } else {
          return false;
        }
      }
    ),

    makeAdmin: combineResolvers(isOwner, async (_, { id }, { models }) => {
      //! FIX ME: what's about OWNER role, what if someone make OWNER to become ADMIN
      const user = await models.User.findByIdAndUpdate(id, { role: 'ADMIN' });

      if (user) {
        if (user.role !== 'ADMIN') {
          return true;
        } else {
          throw new Error('User is already an Admin.');
        }
      } else {
        throw new Error('User does not exist.');
      }
    }),
  },
};
