import { AbstractExecutable } from '../../../shared/executable';

type Request = {
  startAt: Date;
  endAt: Date;
  seats: number;
};

type Response = {
  id: string;
};

export class Organize extends AbstractExecutable<Request, Response> {
  async handle({ startAt, endAt, seats }: Request): Promise<Response> {
    return {
      id: '123',
    };
  }
}
