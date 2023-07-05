import * as deepObjectDiff from 'deep-object-diff';

export abstract class AbstractEntity<TData extends { id: string }> {
  private initialState: TData;
  private currentState: TData;

  constructor(data: TData) {
    this.initialState = data;
    this.currentState = data;

    Object.freeze(this.initialState);
  }

  get id() {
    return this.currentState.id;
  }

  get current() {
    return this.currentState;
  }

  get initial() {
    return this.initialState;
  }

  get data() {
    return this.currentState;
  }

  setState(newState: Partial<TData>) {
    this.currentState = {
      ...this.currentState,
      ...newState,
    };
  }

  equals(entity: AbstractEntity<TData>) {
    return this.currentState.id === entity.currentState.id;
  }

  didChange() {
    return this.currentState !== this.initialState;
  }

  diff() {
    return deepObjectDiff.diff(this.initialState, this.currentState);
  }

  cloneInitial() {
    return new (this.constructor as any)(this.initialState);
  }

  commit() {
    this.initialState = this.currentState;
    Object.freeze(this.initialState);
  }
}

export type EntityType<T> = T extends AbstractEntity<infer P> ? P : never;
