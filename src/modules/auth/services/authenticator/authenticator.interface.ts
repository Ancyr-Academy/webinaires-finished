import { UserEntity } from '../../core/user.entity';

export const I_AUTHENTICATOR = Symbol('I_AUTHENTICATOR');

export interface IAuthenticator {
  authenticate(token: string): Promise<UserEntity>;
}
