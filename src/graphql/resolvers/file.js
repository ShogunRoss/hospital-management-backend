import { createWriteStream } from 'fs';
import path from 'path';
import { UserInputError } from 'apollo-server';
import { combineResolvers } from 'graphql-resolvers';

import { isAuthenticated } from '../../utils/authorization';

const files = [];

const acceptedImageTypes = ['image/gif', 'image/jpeg', 'image/png'];

export default {
  Query: {
    files: () => files,
  },
  Mutation: {
    singleUpload: async (_, { file }) => {
      const { createReadStream, filename } = await file;

      const newFilename = 'file_' + Date.now() + '_' + filename;

      await new Promise(res =>
        createReadStream()
          .pipe(createWriteStream(path.join('./assets/files', newFilename)))
          .on('close', res)
      );

      files.push(newFilename);

      return true;
    },
    avatarUpload: combineResolvers(
      isAuthenticated,
      async (_, { file }, { models, me }) => {
        const { createReadStream, filename, mimetype } = await file;
        const isImageType = acceptedImageTypes.includes(mimetype);

        if (!isImageType) {
          return UserInputError('The file you uploaded is not image.', {
            name: 'NotImageType',
            invalidArg: 'file',
          });
        }

        const newFilename = 'avatar_' + Date.now() + '_' + filename;

        await new Promise(res =>
          createReadStream()
            .pipe(createWriteStream(path.join('./assets/avatars', newFilename)))
            .on('close', res)
        );

        await models.User.findByIdAndUpdate(me.id, {
          avatar: `${process.env.FRONTEND_URL}/avatars/${newFilename}`,
        });

        return true;
      }
    ),
  },
};
