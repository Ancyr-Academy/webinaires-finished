import { differenceInDays } from 'date-fns';
import { AbstractEntity } from '../../shared/entity';

type WebinaireData = {
  id: string;
  organizerId: string;
  seats: number;
  startAt: Date;
  endAt: Date;
};

export class WebinaireEntity extends AbstractEntity<WebinaireData> {
  static MAX_SEATS = 1000;
  static DAYS_BEFORE_TOO_CLOSE = 3;

  isTooClose(now: Date): boolean {
    return (
      differenceInDays(this.data.startAt, now) <
      WebinaireEntity.DAYS_BEFORE_TOO_CLOSE
    );
  }

  hasValidNumberOfSeats(): boolean {
    return this.data.seats > 0 && this.data.seats <= WebinaireEntity.MAX_SEATS;
  }

  isOrganizer(userId: string) {
    return this.data.organizerId === userId;
  }
}
