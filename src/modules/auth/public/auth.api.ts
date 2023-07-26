import { z } from 'zod';

export namespace AuthAPI {
  export namespace CreateAccount {
    export const schema = z.object({
      emailAddress: z.string(),
      password: z.string(),
    });

    export type Request = z.infer<typeof schema>;
    export type Response = {
      id: string;
    };
  }
}
