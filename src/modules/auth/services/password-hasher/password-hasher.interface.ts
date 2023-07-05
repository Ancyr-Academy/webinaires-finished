export const I_PASSWORD_HASHER = Symbol('I_PASSWORD_HASHER');

export interface IPasswordHasher {
  hash(password: string): Promise<string>;
  verify(password: string, hash: string): Promise<boolean>;
}
