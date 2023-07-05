import { DomainException } from '../../../shared/domain-exception';

export class AuthenticationException extends DomainException {
  constructor(message: string) {
    super('AUTHENTICATION_FAILED', message);
  }
}
