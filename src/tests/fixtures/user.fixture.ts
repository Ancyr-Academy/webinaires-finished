import { IFixture } from '../setup/fixture';
import { CreateAccount } from '../../modules/auth/usecases/create-account/create-account';
import { ITestApp } from '../setup/test-app.interface';
import { Nullable } from '../../modules/shared/types';

export class UserFixture implements IFixture {
  public id: Nullable<string> = null;

  constructor(public emailAddress: string, public password: string) {}

  async save(app: ITestApp) {
    const authGateway = app.get<CreateAccount>(CreateAccount);
    const result = await authGateway.execute({
      emailAddress: this.emailAddress,
      password: this.password,
    });

    this.id = result.id;
  }

  getAuthorizationToken() {
    return `Basic ${Buffer.from(
      `${this.emailAddress}:${this.password}`,
    ).toString('base64')}`;
  }

  getId() {
    return this.id!;
  }
}
