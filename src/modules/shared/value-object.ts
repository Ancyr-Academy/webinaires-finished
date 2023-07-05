export abstract class AbstractValueObject<TValue> {
  private _value: TValue;

  constructor(value: unknown) {
    this.validate(value);
    this._value = value as TValue;
  }

  abstract validate(value: unknown): boolean;

  get value() {
    return this._value;
  }

  equals(entity: AbstractValueObject<TValue>) {
    return this._value === entity._value;
  }
}
