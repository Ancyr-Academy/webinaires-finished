import { I_WEBINAIRE_REPOSITORY } from '../../../modules/webinaires/write/ports/webinaire.repository';
import { I_PARTICIPATION_REPOSITORY } from '../../../modules/webinaires/write/ports/participation.repository';
import { Organize } from '../../../modules/webinaires/write/usecases/organize/organize';
import { I_ID_PROVIDER } from '../../../modules/system/id/id-provider';
import { I_DATE_PROVIDER } from '../../../modules/system/date/date-provider';
import { CancelReservation } from '../../../modules/webinaires/write/usecases/cancel-reservation/cancel-reservation';
import { I_MAILER } from '../../../modules/mailer/ports/mailer.interface';
import { CancelWebinaire } from '../../../modules/webinaires/write/usecases/cancel-webinaire/cancel-webinaire';
import { ChangeDates } from '../../../modules/webinaires/write/usecases/change-dates/change-dates';
import { ChangeSeats } from '../../../modules/webinaires/write/usecases/change-seats/change-seats';
import { ReserveSeat } from '../../../modules/webinaires/write/usecases/reserve-seat/reserve-seat';
import { I_USER_REPOSITORY } from '../../../modules/auth/ports/user-repository';

export const useCases = [
  {
    provide: CancelReservation,
    inject: [
      I_USER_REPOSITORY,
      I_WEBINAIRE_REPOSITORY,
      I_PARTICIPATION_REPOSITORY,
      I_MAILER,
    ],
    useFactory: (
      userRepository,
      webinaireRepository,
      participationRepository,
      mailer,
    ) => {
      return new CancelReservation(
        userRepository,
        webinaireRepository,
        participationRepository,
        mailer,
      );
    },
  },
  {
    provide: CancelWebinaire,
    inject: [
      I_USER_REPOSITORY,
      I_WEBINAIRE_REPOSITORY,
      I_PARTICIPATION_REPOSITORY,
      I_MAILER,
    ],
    useFactory: (
      userRepository,
      webinaireRepository,
      participationRepository,
      mailer,
    ) => {
      return new CancelWebinaire(
        userRepository,
        webinaireRepository,
        participationRepository,
        mailer,
      );
    },
  },
  {
    provide: ChangeDates,
    inject: [
      I_DATE_PROVIDER,
      I_USER_REPOSITORY,
      I_WEBINAIRE_REPOSITORY,
      I_PARTICIPATION_REPOSITORY,
      I_MAILER,
    ],
    useFactory: (
      dateProvider,
      userRepository,
      webinaireRepository,
      participantQuery,
      mailer,
    ) => {
      return new ChangeDates(
        dateProvider,
        userRepository,
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
      I_USER_REPOSITORY,
      I_WEBINAIRE_REPOSITORY,
      I_PARTICIPATION_REPOSITORY,
      I_MAILER,
    ],
    useFactory: (
      idProvider,
      userRepository,
      webinaireRepository,
      participationRepository,
      mailer,
    ) => {
      return new ReserveSeat(
        idProvider,
        userRepository,
        webinaireRepository,
        participationRepository,
        mailer,
      );
    },
  },
];
