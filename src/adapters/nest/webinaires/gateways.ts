import { getModelToken } from '@nestjs/mongoose';

import { I_WEBINAIRE_QUERY } from '../../../modules/webinaires/read/ports/webinaire.query';
import { InMemoryWebinaireQuery } from '../../../modules/webinaires/read/adapters/in-memory-webinaire-query';
import { I_WEBINAIRE_REPOSITORY } from '../../../modules/webinaires/write/ports/webinaire.repository';
import { I_PARTICIPANT_QUERY } from '../../../modules/webinaires/read/ports/participant.query';
import { InMemoryParticipantQuery } from '../../../modules/webinaires/read/adapters/in-memory-participant-query';
import { I_PARTICIPATION_REPOSITORY } from '../../../modules/webinaires/write/ports/participation.repository';
import { MongoWebinaire } from './models/mongo-webinaire';
import { MongoWebinaireRepository } from './adapters/mongo.webinaire-repository';
import { MongoParticipation } from './models/mongo-participation';
import { MongoParticipationRepository } from './adapters/mongo.participation-repository';

export const gateways = [
  {
    provide: I_WEBINAIRE_QUERY,
    useFactory: () => {
      return new InMemoryWebinaireQuery();
    },
  },
  {
    provide: I_WEBINAIRE_REPOSITORY,
    inject: [getModelToken(MongoWebinaire.CollectionName)],
    useFactory: (model) => {
      return new MongoWebinaireRepository(model);
    },
  },
  {
    provide: I_PARTICIPANT_QUERY,
    useFactory: () => {
      return new InMemoryParticipantQuery();
    },
  },
  {
    provide: I_PARTICIPATION_REPOSITORY,
    inject: [getModelToken(MongoParticipation.CollectionName)],
    useFactory: (model) => {
      return new MongoParticipationRepository(model);
    },
  },
];
