import { getModelToken } from '@nestjs/mongoose';

import { MongoWebinaire } from './models/mongo-webinaire';
import { MongoParticipation } from './models/mongo-participation';
import { MongoUser } from '../auth/models/mongo-user';
import { I_GET_WEBINAIRE_BY_ID_QUERY } from '../../../modules/webinaires/read/queries/get-webinaire-by-id.query-interface';
import { GetWebinaireByIdQuery } from './queries/get-webinaire-by-id.query';
import { I_GET_WEBINAIRES_USER_PARTICIPATES_IN_QUERY } from '../../../modules/webinaires/read/queries/get-webinaires-user-participates-in.query-interface';
import { GetWebinairesUserParticipatesInQuery } from './queries/get-webinaires-user-participates-in.query';

export const queries = [
  {
    provide: I_GET_WEBINAIRE_BY_ID_QUERY,
    inject: [
      getModelToken(MongoUser.CollectionName),
      getModelToken(MongoWebinaire.CollectionName),
      getModelToken(MongoParticipation.CollectionName),
    ],
    useFactory: (userModel, webinaireModel, participationModel) => {
      return new GetWebinaireByIdQuery(
        userModel,
        webinaireModel,
        participationModel,
      );
    },
  },
  {
    provide: I_GET_WEBINAIRES_USER_PARTICIPATES_IN_QUERY,
    inject: [
      getModelToken(MongoUser.CollectionName),
      getModelToken(MongoWebinaire.CollectionName),
      getModelToken(MongoParticipation.CollectionName),
    ],
    useFactory: (userModel, webinaireModel, participationModel) => {
      return new GetWebinairesUserParticipatesInQuery(
        userModel,
        webinaireModel,
        participationModel,
      );
    },
  },
];
