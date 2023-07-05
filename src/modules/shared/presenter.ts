export abstract class AbstractPresenter<TInput, TOutput> {
  public abstract transform(data: TInput): Promise<TOutput>;
}
