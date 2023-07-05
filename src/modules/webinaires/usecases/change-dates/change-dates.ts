import { AbstractExecutable } from '../../../shared/executable';

type Request = {
  webinaireId: string;
  startAt: Date;
  endAt: Date;
};

type Response = void;

export class ChangeDates extends AbstractExecutable<Request, Response> {
  async handle({ webinaireId, startAt, endAt }: Request): Promise<Response> {
    return;
  }
}
