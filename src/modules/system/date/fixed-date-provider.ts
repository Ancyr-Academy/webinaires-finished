import { IDateProvider } from './date-provider';

export class FixedDateProvider implements IDateProvider {
  constructor(private date = new Date()) {}

  getDate(): Date {
    return this.date;
  }
}
