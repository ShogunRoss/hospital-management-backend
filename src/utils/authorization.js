import { ForbiddenError } from 'apollo-server';
import { combineResolvers, skip } from 'graphql-resolvers';

export const isAuthenticated = (_, __, { me }) =>
  me ? skip : new ForbiddenError('Not authenticated');

export const isAdmin = combineResolvers(
  isAuthenticated,
  (_, __, { me: { role } }) =>
    role === 'ADMIN' || role === 'OWNER'
      ? skip
      : new ForbiddenError('Not authorized as admin')
);

export const isAccountant = combineResolvers(
  isAuthenticated,
  (_, __, { me: { role } }) => {
    role === 'ACCOUNTANT' || role === 'OWNER'
      ? skip
      : new ForbiddenError('Not authorized as accountant');
  }
);

export const isOwner = combineResolvers(
  isAuthenticated,
  (_, __, { me: { role } }) =>
    role === 'OWNER' ? skip : new ForbiddenError('Not authorized as owner')
);
