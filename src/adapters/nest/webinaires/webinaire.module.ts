import { Module } from '@nestjs/common';

import { I_WEBINAIRE_QUERY } from '../../../modules/webinaires/read/ports/webinaire.query';
import { InMemoryWebinaireQuery } from '../../../modules/webinaires/read/adapters/in-memory-webinaire-query';
import { I_WEBINAIRE_REPOSITORY } from '../../../modules/webinaires/write/ports/webinaire.repository';
import { InMemoryWebinaireRepository } from '../../../modules/webinaires/write/adapters/in-memory-webinaire-repository';
import { I_PARTICIPANT_QUERY } from '../../../modules/webinaires/read/ports/participant.query';
import { InMemoryParticipantQuery } from '../../../modules/webinaires/read/adapters/in-memory-participant-query';
import { I_PARTICIPATION_REPOSITORY } from '../../../modules/webinaires/write/ports/participation.repository';
import { InMemoryParticipationRepository } from '../../../modules/webinaires/write/adapters/in-memory-participation-repository';
import { Organize } from '../../../modules/webinaires/write/usecases/organize/organize';
import { I_ID_PROVIDER } from '../../../modules/system/id/id-provider';
import { I_DATE_PROVIDER } from '../../../modules/system/date/date-provider';
import { CancelReservation } from '../../../modules/webinaires/write/usecases/cancel-reservation/cancel-reservation';
import { I_MAILER } from '../../../modules/mailer/ports/mailer.interface';
import { CancelWebinaire } from '../../../modules/webinaires/write/usecases/cancel-webinaire/cancel-webinaire';
import { ChangeDates } from '../../../modules/webinaires/write/usecases/change-dates/change-dates';
import { ChangeSeats } from '../../../modules/webinaires/write/usecases/change-seats/change-seats';
import { ReserveSeat } from '../../../modules/webinaires/write/usecases/reserve-seat/reserve-seat';
import { MailerModule } from '../mailer/mailer.module';
import { WebinaireController } from './webinaire.controller';

const gateways = [
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

const useCases = [
  {
    provide: CancelReservation,
    inject: [I_PARTICIPATION_REPOSITORY, I_WEBINAIRE_QUERY, I_MAILER],
    useFactory: (participationRepository, webinaireQuery, mailer) => {
      return new CancelReservation(
        participationRepository,
        webinaireQuery,
        mailer,
      );
    },
  },
  {
    provide: CancelWebinaire,
    inject: [I_WEBINAIRE_REPOSITORY, I_PARTICIPANT_QUERY, I_MAILER],
    useFactory: (webinaireRepository, participantQuery, mailer) => {
      return new CancelWebinaire(webinaireRepository, participantQuery, mailer);
    },
  },
  {
    provide: ChangeDates,
    inject: [
      I_DATE_PROVIDER,
      I_WEBINAIRE_REPOSITORY,
      I_PARTICIPANT_QUERY,
      I_MAILER,
    ],
    useFactory: (
      dateProvider,
      webinaireRepository,
      participantQuery,
      mailer,
    ) => {
      return new ChangeDates(
        dateProvider,
        webinaireRepository,
        participantQuery,
        mailer,
      );
    },
  },
  {
    provide: ChangeSeats,
    inject: [I_WEBINAIRE_REPOSITORY],
    useFactory: (webinaireRepository) => {
      return new ChangeSeats(webinaireRepository);
    },
  },
  {
    provide: Organize,
    inject: [I_ID_PROVIDER, I_DATE_PROVIDER, I_WEBINAIRE_REPOSITORY],
    useFactory: (idProvider, dateProvider, webinaireGateway) => {
      return new Organize(idProvider, dateProvider, webinaireGateway);
    },
  },
  {
    provide: ReserveSeat,
    inject: [
      I_ID_PROVIDER,
      I_WEBINAIRE_QUERY,
      I_PARTICIPATION_REPOSITORY,
      I_MAILER,
    ],
    useFactory: (
      idProvider,
      webinaireQuery,
      participationRepository,
      mailer,
    ) => {
      return new ReserveSeat(
        idProvider,
        webinaireQuery,
        participationRepository,
        mailer,
      );
    },
  },
];

@Module({
  imports: [MailerModule],
  controllers: [WebinaireController],
  providers: [...gateways, ...useCases],
  exports: [],
})
export class WebinaireModule {}
