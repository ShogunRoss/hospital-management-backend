import { combineResolvers } from 'graphql-resolvers';
import { UserInputError } from 'apollo-server';
import jwt from 'jsonwebtoken';

import { isAdmin, isAuthenticated } from '../../utils/authorization';
import { createAccessToken } from '../../utils/createToken';
import { transformUser, transformLeanUser } from '../../utils/transform';
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
    users: combineResolvers(
      isAdmin,
      async (_, { cursor = Date.now(), limit = 0 }, { models }) => {
        if (limit < 0) {
          throw new UserInputError('Limit must be positive', {
            invalidArg: 'limit',
          });
        }

        if (!cursor) {
          throw new UserInputError('Cursor is not valid', {
            invalidArg: 'cursor',
          });
        }

        const allUsers = await models.User.find()
          .sort('-createdAt')
          .lean();
        const unlimitedUsers = allUsers.map(user => {
          if (user.createdAt < cursor) {
            return transformLeanUser(user);
          }
        });
        const users =
          limit !== 0 ? unlimitedUsers.slice(0, limit) : unlimitedUsers;

        return {
          data: users,
          pageInfo: {
            endCursor: users[users.length - 1].createdAt,
            hasNextPage: limit !== 0 ? unlimitedUsers.length > limit : false,
          },
          totalCount: allUsers.length,
        };
      }
    ),

    user: combineResolvers(isAdmin, async (_, { id }, { models }) => {
      const user = await models.User.findById(id).lean();

      if (!user) {
        throw new UserInputError('No user found', {
          name: 'NoUserFound',
          invalidArg: 'id',
        });
      }

      return transformLeanUser(user);
    }),

    me: combineResolvers(isAuthenticated, async (_, __, { models, me }) => {
      const user = await models.User.findById(me.id).lean();

      return transformLeanUser(user);
    }),
  },

  Mutation: {
    signUp: async (_, { email, password, employeeId }, { models, url }) => {
      const userAlreadyExist = await models.User.findOne({ email }).lean();

      if (userAlreadyExist) {
        throw new UserInputError('Email is already taken', {
          name: 'UserAlreadyExist',
          invalidArg: 'email',
        });
      }
      const confirmEmailLink = await createConfirmEmailLink(url, email);

      if (process.env.NODE_ENV !== 'test') {
        const info = await sendConfirmEmail(email, confirmEmailLink);
        // console.log(info);
        if (info) {
          await models.User.create({
            email,
            password,
            employeeId,
          });
        }
      } else {
        console.log(confirmEmailLink);
        await models.User.create({
          email,
          password,
          employeeId,
        });
      }

      return true;
    },

    signIn: async (_, { email, password }, { models, res }) => {
      const user = await models.User.findOne({ email });

      if (!user) {
        throw new UserInputError('No user found', {
          name: 'NoUserFound',
          invalidArg: 'email',
        });
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new UserInputError('Invalid password', {
          name: 'InvalidPassword',
          invalidArg: 'password',
        });
      }

      if (!user.confirmed) {
        throw new Error('User still does not confirmed email');
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
      let { userId } = await jwt.verify(
        confirmToken,
        process.env.CONFIRM_TOKEN_SECRET
      );

      if (!userId) {
        throw new Error('Invalid confirm token');
      }

      await models.User.findByIdAndUpdate(userId, { confirmed: true });

      return true;
    },

    forgotPassword: async (_, { email }, { models }) => {
      const user = await models.User.findOne({ email }).lean();

      // *: If check user availability here, we might expose our user emails to the attacker - so we will send to whatever email user enter to avoid this scheme.
      // *: But it will take a lot of our Email API. So consider this in the future

      if (!user) {
        throw new UserInputError('No user found', {
          name: 'NoUserExist',
          invalidArg: 'email',
        });
      }

      const forgotPasswordLink = await createForgotPasswordLink(
        process.env.FRONTEND_URL,
        user
      );

      if (process.env.NODE_ENV !== 'test') {
        // console.log(forgotPasswordLink);
        await sendForgotPasswordEmail(email, forgotPasswordLink);
      } else {
        console.log(forgotPasswordLink);
      }

      return true;
    },

    resetPassword: async (_, { newPassword, passwordToken }, { models }) => {
      const { userId, password } = jwt.verify(
        passwordToken,
        process.env.PASSWORD_TOKEN_SECRET
      );

      if (userId) {
        const user = await models.User.findById(userId);
        if (user.password === password) {
          user.password = newPassword;
          await user.save();
          return true;
        }
      }

      throw new Error('Invalid password token');
    },

    changePassword: combineResolvers(
      isAuthenticated,
      async (_, { oldPassword, newPassword }, { models, me }) => {
        const user = await models.User.findById(me.id);
        const isValid = await user.validatePassword(oldPassword);

        if (!isValid) {
          throw new UserInputError('Invalid old password', {
            name: 'InvalidOldPassword',
            invalidArg: 'oldPassword',
          });
        }

        user.password = newPassword;
        await user.save();
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
        throw new UserInputError('No user found', {
          name: 'NoUserFound',
          invalidArg: 'email',
        });
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
          throw new UserInputError('No user found', {
            name: 'NoUserFound',
            invalidArg: 'email',
          });
        }
      }
    ),

    makeAdmin: combineResolvers(isAdmin, async (_, { id }, { models }) => {
      const user = await models.User.findByIdAndUpdate(id, {
        role: 'ADMIN',
      }).lean();

      if (user) {
        if (user.role !== 'ADMIN') {
          return true;
        } else {
          throw new UserInputError('User is already an Admin', {
            name: 'UserAlreadyAdmin',
            invalidArg: 'id',
          });
        }
      } else {
        throw new UserInputError('No user found', {
          name: 'NoUserFound',
          invalidArg: 'id',
        });
      }
    }),
  },
};
