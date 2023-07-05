import { IDateProvider } from './date-provider';

export class CurrentDateProvider implements IDateProvider {
  getDate(): Date {
    return new Date();
  }
}
