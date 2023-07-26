import { z } from 'zod';

export namespace WebinaireAPI {
  export namespace CancelReservation {
    export type Response = void;
  }

  export namespace CancelWebinaire {
    export type Response = void;
  }

  export namespace ChangeDates {
    export const schema = z.object({
      startAt: z.date(),
      endAt: z.date(),
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
      startAt: z.date(),
      endAt: z.date(),
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
}
