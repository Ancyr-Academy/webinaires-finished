import { nanoid } from 'nanoid';

export class NanoidProvider {
  getId() {
    return nanoid(21);
  }
}
