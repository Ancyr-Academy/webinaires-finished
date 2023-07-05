import * as argon2 from 'argon2';
import { IPasswordHasher } from './password-hasher.interface';

export class Argon2PasswordHasher implements IPasswordHasher {
  async hash(password: string): Promise<string> {
    const hash = await argon2.hash(password);
    return hash;
  }

  async verify(password: string, hash: string): Promise<boolean> {
    const isPasswordValid = await argon2.verify(hash, password);
    return isPasswordValid;
  }
}
