import { getModelToken } from '@nestjs/mongoose';

import { MongoWebinaire } from './models/mongo-webinaire';
import { MongoParticipation } from './models/mongo-participation';
import { MongoUser } from '../auth/models/mongo-user';
import { I_FIND_WEBINAIRE_BY_ID_QUERY } from '../../../modules/webinaires/read/queries/find-webinaire-by-id.query-interface';
import { FindWebinaireByIdQuery } from './queries/find-webinaire-by-id.query';
import { I_FIND_WEBINAIRES_USER_PARTICIPATES_IN_QUERY } from '../../../modules/webinaires/read/queries/find-webinaires-user-participates-in.query-interface';
import { FindWebinairesUserParticipatesInQuery } from './queries/find-webinaires-user-participates-in.query';

export const queries = [
  {
    provide: I_FIND_WEBINAIRE_BY_ID_QUERY,
    inject: [
      getModelToken(MongoUser.CollectionName),
      getModelToken(MongoWebinaire.CollectionName),
      getModelToken(MongoParticipation.CollectionName),
    ],
    useFactory: (userModel, webinaireModel, participationModel) => {
      return new FindWebinaireByIdQuery(
        userModel,
        webinaireModel,
        participationModel,
      );
    },
  },
  {
    provide: I_FIND_WEBINAIRES_USER_PARTICIPATES_IN_QUERY,
    inject: [
      getModelToken(MongoUser.CollectionName),
      getModelToken(MongoWebinaire.CollectionName),
      getModelToken(MongoParticipation.CollectionName),
    ],
    useFactory: (userModel, webinaireModel, participationModel) => {
      return new FindWebinairesUserParticipatesInQuery(
        userModel,
        webinaireModel,
        participationModel,
      );
    },
  },
];
