export class DomainException extends Error {
  constructor(
    public code: string,
    message: string,
  ) {
    super(message);
    this.name = 'DomainException';
  }
}
