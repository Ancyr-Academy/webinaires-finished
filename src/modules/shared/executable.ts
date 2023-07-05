export abstract class AbstractExecutable<TRequest, TResponse> {
  abstract handle(payload: TRequest): Promise<TResponse>;

  protected validate(payload: TRequest): Promise<void> {
    return Promise.resolve();
  }

  public async execute(payload: TRequest): Promise<TResponse> {
    await this.validate(payload);
    return await this.handle(payload);
  }
}

export type ExecutableInput<T> = T extends AbstractExecutable<infer P, any>
  ? P
  : never;

export type ExecutableOutput<T> = T extends AbstractExecutable<any, infer P>
  ? P
  : never;

export type ExecutableReturnType<T extends AbstractExecutable<any, any>> =
  Awaited<T['handle']>;
