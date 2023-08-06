export abstract class Executable<TRequest, TResponse> {
  abstract run(payload: TRequest): Promise<TResponse>;

  protected validate(payload: TRequest): Promise<void> {
    return Promise.resolve();
  }

  public async execute(payload: TRequest): Promise<TResponse> {
    await this.validate(payload);
    return await this.run(payload);
  }
}
