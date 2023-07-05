import { UserEntity } from '../../entity/user.entity';

export const I_AUTHENTICATOR = Symbol('I_AUTHENTICATOR');

export interface IAuthenticator {
  fromBasicAuth(basicAuth: string): Promise<UserEntity>;
}
