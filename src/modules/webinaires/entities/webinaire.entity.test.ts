import { WebinaireEntity } from './webinaire.entity';
import { WebinaireFactory } from './webinaire.factory';

describe('Webinaire entity', () => {
  test('is today too close of the webinaire starting day', () => {
    const dayOfMonth = (day: string) =>
      new Date(`2023-01-${day}T00:00:00.000Z`);

    const entity = WebinaireFactory.create({
      startAt: dayOfMonth('21'),
    });

    expect(entity.isTooClose(dayOfMonth('01'))).toBe(false);
    expect(entity.isTooClose(dayOfMonth('19'))).toBe(true);
    expect(entity.isTooClose(dayOfMonth('22'))).toBe(true);
    expect(entity.isTooClose(dayOfMonth('25'))).toBe(true);
  });

  test('has a valid number of seats', () => {
    const createWithSeats = (seats: number) =>
      WebinaireFactory.create({
        seats,
      });

    expect(createWithSeats(-1).hasValidNumberOfSeats()).toBe(false);
    expect(createWithSeats(0).hasValidNumberOfSeats()).toBe(false);
    expect(createWithSeats(1).hasValidNumberOfSeats()).toBe(true);

    expect(
      createWithSeats(WebinaireEntity.MAX_SEATS).hasValidNumberOfSeats(),
    ).toBe(true);

    expect(
      createWithSeats(WebinaireEntity.MAX_SEATS + 1).hasValidNumberOfSeats(),
    ).toBe(false);
  });
});
