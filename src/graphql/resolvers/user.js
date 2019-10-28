import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import { isAdmin, isAuthenticated } from '../../utils/authorization';
import { createAccessToken } from '../../utils/createToken';
import { transformUser } from '../../utils/transform';
import {
  sendConfirmEmail,
  sendForgotPasswordEmail,
} from '../../utils/sendEmail';
import {
  createConfirmEmailLink,
  createForgotPasswordLink,
} from '../../utils/createLink';
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
      const confirmEmailLink = await createConfirmEmailLink(url, email);

      if (process.env.NODE_ENV !== 'test') {
        try {
          const info = await sendConfirmEmail(email, confirmEmailLink);

          if (info) {
            await models.User.create({
              email,
              password,
            });
          }
        } catch (err) {
          throw new Error(err);
        }
      } else {
        console.log(confirmEmailLink);
        await models.User.create({
          email,
          password,
        });
      }

      return true;
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
      sendRefreshToken(res, '');
      return true;
    },

    confirmEmail: async (_, { confirmToken }, { models }) => {
      try {
        const { userId } = await jwt.verify(
          confirmToken,
          process.env.CONFIRM_TOKEN_SECRET
        );

        if (!userId) {
          throw new Error('Invalid token');
        }

        await models.User.findByIdAndUpdate(userId, { confirmed: true });

        return true;
      } catch (err) {
        throw new Error(err);
      }
    },

    forgotPassword: async (_, { email }, { models }) => {
      const user = await models.User.findOne({ email });

      // *: If check user availability here, we might expose our user emails to the attacker - so we will send to whatever email user enter to avoid this scheme.
      // *: But it will take a lot of our Email API. So consider this in the future

      if (!user) {
        throw new Error('User do not exist');
      }
      const forgotPasswordLink = await createForgotPasswordLink(
        process.env.FRONTEND_URL,
        user
      );

      if (process.env.NODE_ENV !== 'test') {
        console.log(forgotPasswordLink);
        await sendForgotPasswordEmail(email, forgotPasswordLink);
      } else {
        console.log(forgotPasswordLink);
      }

      return true;
    },

    resetPassword: async (_, { newPassword, passwordToken }, { models }) => {
      try {
        const { userId, password } = await jwt.verify(
          passwordToken,
          process.env.PASSWORD_TOKEN_SECRET
        );

        if (userId) {
          const user = await models.User.findById(userId);
          if (user.password === password) {
            user.password = newPassword;
            await user.save();

            return true;
          } else {
            throw new Error('Invalid Token (password)');
          }
        } else {
          throw new Error('Invalid Token (userId)');
        }
      } catch (err) {
        if (err) {
          throw err;
        }
      }
    },

    changePassword: combineResolvers(
      isAuthenticated,
      async (_, { newPassword }, { models, me }) => {
        let password = await bcrypt.hash(newPassword, 10);
        await models.User.findByIdAndUpdate(me.id, {
          password,
        });
        return true;
      }
    ),

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

    makeAdmin: combineResolvers(isAdmin, async (_, { id }, { models }) => {
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
