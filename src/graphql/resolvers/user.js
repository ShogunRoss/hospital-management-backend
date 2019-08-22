import { combineResolvers } from 'graphql-resolvers';
import { AuthenticationError, UserInputError } from 'apollo-server';

import { isAdmin, isAuthenticated } from '../../utils/authorization';
import createToken from '../../utils/createToken';

export default {
  Query: {
    users: async (_, __, { models }) => {
      return await models.User.find();
    },

    user: async (_, { id }, { models }) => {
      return await models.User.findById(id);
    },

    me: async (_, __, { models, me }) => {
      if (!me) {
        return null;
      }

      const user = await models.User.findById(me.id);

      return {
        ...user._doc,
        id: user.id,
        password: null
      };
    }
  },

  Mutation: {
    signUp: async (
      _,
      { userInput: { email, password, phone, firstName, lastName } },
      { models, secret }
    ) => {
      const user = await models.User.create({
        email,
        password,
        phone,
        firstName,
        lastName
      });

      return { token: createToken(user, secret) };
    },

    signIn: async (_, { email, password }, { models, secret }) => {
      const user = await models.User.findOne({ email });

      if (!user) {
        throw new UserInputError('No user found with this login credentials.');
      }

      const isValid = await user.validatePassword(password);

      if (!isValid) {
        throw new AuthenticationError('Invalid password.');
      }

      return { token: createToken(user, secret) };
    },

    updateUser: combineResolvers(
      isAuthenticated,
      async (
        _,
        { updateInput: { phone, firstName, lastName } },
        { models, me }
      ) => {
        const user = await models.User.findByIdAndUpdate(
          me.id,
          { phone, firstName, lastName },
          { new: true }
        );
        return {
          ...user._doc,
          id: user.id,
          password: null
        };
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
    )
  }
};
