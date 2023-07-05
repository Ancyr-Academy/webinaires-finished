import { AbstractExecutable } from '../../../shared/executable';

type Request = {
  webinaireId: string;
  seats: number;
};

type Response = void;

export class ChangeSeats extends AbstractExecutable<Request, Response> {
  async handle({ webinaireId, seats }: Request): Promise<Response> {
    return;
  }
}
