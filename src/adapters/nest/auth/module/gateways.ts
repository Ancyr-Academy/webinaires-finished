import { getModelToken } from '@nestjs/mongoose';

import { I_USER_REPOSITORY } from '../../../../modules/auth/ports/user-repository';
import { MongoUserRepository } from '../adapters/mongo.user-repository';
import { MongoUser } from '../models/mongo-user';

export const gateways = [
  {
    provide: I_USER_REPOSITORY,
    inject: [getModelToken(MongoUser.CollectionName)],
    useFactory: (model) => {
      return new MongoUserRepository(model);
    },
  },
];
