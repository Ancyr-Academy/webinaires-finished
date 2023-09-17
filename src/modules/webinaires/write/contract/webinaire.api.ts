import { z } from 'zod';
import { WebinaireReadModel } from '../../read/model/webinaire.read-model';

export namespace WebinaireAPI {
  export namespace CancelReservation {
    export type Response = void;
  }

  export namespace CancelWebinaire {
    export type Response = void;
  }

  export namespace ChangeDates {
    export const schema = z.object({
      startAt: z.coerce.date(),
      endAt: z.coerce.date(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }

  export namespace ChangeSeats {
    export const schema = z.object({
      seats: z.number(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = void;
  }

  export namespace Organize {
    export const schema = z.object({
      startAt: z.coerce.date(),
      endAt: z.coerce.date(),
      seats: z.number(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = {
      id: string;
    };
  }

  export namespace ReserveSeat {
    export type Response = void;
  }

  export namespace FindWebinaireById {
    export type Response = WebinaireReadModel;
  }

  export namespace FindWebinairesUserParticipatesIn {
    export type Response = WebinaireReadModel[];
  }
}
