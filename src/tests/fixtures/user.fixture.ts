import { IFixture } from '../setup/fixture';
import { ITestApp } from '../setup/test-app.interface';
import { Nullable } from '../../modules/shared/types';
import {
  IUserRepository,
  I_USER_REPOSITORY,
} from '../../modules/auth/ports/user-repository';
import {
  IPasswordHasher,
  I_PASSWORD_HASHER,
} from '../../modules/auth/services/password-hasher/password-hasher.interface';
import { UserEntity } from '../../modules/auth/core/user.entity';

export class UserFixture implements IFixture {
  constructor(
    public props: {
      id: string;
      emailAddress: string;
      password: string;
    },
  ) {}

  async save(app: ITestApp) {
    const authGateway = app.get<IUserRepository>(I_USER_REPOSITORY);
    const passwordHasher = app.get<IPasswordHasher>(I_PASSWORD_HASHER);

    const hashedPassword = await passwordHasher.hash(this.props.password);
    const user = new UserEntity({
      id: this.props.id,
      emailAddress: this.props.emailAddress,
      password: hashedPassword,
    });

    await authGateway.createUser(user);
  }

  getAuthorizationToken() {
    return `Basic ${Buffer.from(
      `${this.props.emailAddress}:${this.props.password}`,
    ).toString('base64')}`;
  }

  getId() {
    return this.props.id;
  }
}
