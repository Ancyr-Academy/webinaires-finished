import { Argon2PasswordHasher } from './argon2-password-hasher';

describe('Password hash', () => {
  test('hashing and verifying the password', async () => {
    const passwordHasher = new Argon2PasswordHasher();
    const password = 'azerty';

    const hashed = await passwordHasher.hash(password);
    const isPasswordValid = await passwordHasher.verify(password, hashed);

    expect(isPasswordValid).toBe(true);
  });
});
