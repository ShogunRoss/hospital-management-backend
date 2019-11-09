import { createWriteStream, unlinkSync } from 'fs';
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

        const newFilename = `${me.id}_${Date.now()}.${filename
          .split('.')
          .pop()}`;

        const avatar = `${process.env.BACKEND_URL}/avatars/${newFilename}`;

        const user = await models.User.findByIdAndUpdate(me.id, { avatar });

        if (user.avatar) {
          try {
            unlinkSync(
              user.avatar.replace(process.env.BACKEND_URL, './assets')
            );
          } catch (err) {
            console.log(err);
          }
        }

        await new Promise(res =>
          createReadStream()
            .pipe(createWriteStream(path.join('./assets/avatars', newFilename)))
            .on('close', res)
        );

        return true;
      }
    ),
  },
};
