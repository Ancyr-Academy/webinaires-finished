import { IPasswordHasher } from './password-hasher.interface';

export class PassthroughPasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    return 'hashed_' + password;
  }

  async verify(password: string, hash: string): Promise<boolean> {
    const isPasswordValid = 'hashed_' + password === hash;
    return isPasswordValid;
  }
}
