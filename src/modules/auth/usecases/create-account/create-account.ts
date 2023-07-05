import { AbstractExecutable } from '../../../shared/executable';

type Request = {
  emailAddress: string;
  password: string;
};

type Response = {
  id: string;
};

export class CreateAccount extends AbstractExecutable<Request, Response> {
  async handle(payload: Request): Promise<Response> {
    return {
      id: '123',
    };
  }
}
