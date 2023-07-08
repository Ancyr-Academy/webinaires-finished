import { WebinaireEntity } from './webinaire.entity';
import { WebinaireFactory } from './webinaire.factory';

describe('Webinaire entity', () => {
  test('isTooClose', () => {
    const entity = WebinaireFactory.create({
      startAt: new Date('2023-01-21T11:00:00.000Z'),
    });

    expect(entity.isTooClose(new Date('2023-01-01T00:00:00.000Z'))).toBe(false);
    expect(entity.isTooClose(new Date('2023-01-19T00:00:00.000Z'))).toBe(true);
    expect(entity.isTooClose(new Date('2023-01-22T00:00:00.000Z'))).toBe(true);
    expect(entity.isTooClose(new Date('2023-01-25T00:00:00.000Z'))).toBe(true);
  });

  test('hasValidNumberOfSeats', () => {
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
