import { IIDProvider } from './id-provider';

export class FixedIdProvider implements IIDProvider {
  constructor(private id = 'stub-id') {}

  getId() {
    return this.id;
  }
}
