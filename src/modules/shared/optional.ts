export class Optional<T> {
  static empty<T>() {
    return new Optional<T>(null);
  }

  static of<T>(value: T) {
    return new Optional(value);
  }

  constructor(private readonly value: T | null | undefined) {}

  public get(): T {
    if (this.value === null || this.value === undefined) {
      throw new Error('Value is null or undefined');
    }

    return this.value;
  }

  public getOrThrow(error = new Error('Option was null')): T {
    if (this.value === null || this.value === undefined) {
      throw error;
    }

    return this.value;
  }

  public isNull(): boolean {
    return this.value === null || this.value === undefined;
  }
}
