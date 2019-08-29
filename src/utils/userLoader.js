import DataLoader from 'dataloader';

import loaders from '../loaders';
import models from '../models';

export default new DataLoader(keys => loaders.batchUsers(keys, models));
