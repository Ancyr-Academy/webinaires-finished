export abstract class Executable<TRequest, TResponse> {
  abstract execute(payload: TRequest): Promise<TResponse>;
}
