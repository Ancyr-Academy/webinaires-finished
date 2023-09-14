import { I_WEBINAIRE_QUERY } from '../../../modules/webinaires/read/ports/webinaire.query';
import { InMemoryWebinaireQuery } from '../../../modules/webinaires/read/adapters/in-memory-webinaire-query';
import { I_WEBINAIRE_REPOSITORY } from '../../../modules/webinaires/write/ports/webinaire.repository';
import { InMemoryWebinaireRepository } from '../../../modules/webinaires/write/adapters/in-memory-webinaire-repository';
import { I_PARTICIPANT_QUERY } from '../../../modules/webinaires/read/ports/participant.query';
import { InMemoryParticipantQuery } from '../../../modules/webinaires/read/adapters/in-memory-participant-query';
import { I_PARTICIPATION_REPOSITORY } from '../../../modules/webinaires/write/ports/participation.repository';
import { InMemoryParticipationRepository } from '../../../modules/webinaires/write/adapters/in-memory-participation-repository';

export const gateways = [
  {
    provide: I_WEBINAIRE_QUERY,
    useFactory: () => {
      return new InMemoryWebinaireQuery();
    },
  },
  {
    provide: I_WEBINAIRE_REPOSITORY,
    useFactory: () => {
      return new InMemoryWebinaireRepository();
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
    useFactory: () => {
      return new InMemoryParticipationRepository();
    },
  },
];
