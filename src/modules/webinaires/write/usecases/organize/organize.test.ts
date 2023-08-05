import { UserFactory } from '../../../../auth/entity/user.factory';
import { FixedDateProvider } from '../../../../system/date/fixed-date-provider';
import { FixedIdProvider } from '../../../../system/id/fixed-id-provider';
import { InMemoryWebinaireRepository } from '../../adapters/in-memory-webinaire-repository';
import { Organize } from './organize';

describe('Feature: Organizing webinaires', () => {
  const todayIs = new Date('2023-01-01T00:00:00.000Z');
  const user = UserFactory.create();

  let idProvider: FixedIdProvider;
  let dateProvider: FixedDateProvider;
  let webinaireGateway: InMemoryWebinaireRepository;
  let useCase: Organize;

  beforeEach(() => {
    idProvider = new FixedIdProvider('webinaire-id');
    dateProvider = new FixedDateProvider(todayIs);
    webinaireGateway = new InMemoryWebinaireRepository();
    useCase = new Organize(idProvider, dateProvider, webinaireGateway);
  });

  describe('Scenario: organizing a webinaire', () => {
    const payload = {
      user: user,

      startAt: new Date('2023-01-21T11:00:00.000Z'),
      endAt: new Date('2023-01-21T12:00:00.000Z'),
      seats: 10,
    };

    it('should return the id of the webinaire', async () => {
      const result = await useCase.execute(payload);
      expect(result).toEqual({
        id: 'webinaire-id',
      });
    });

    it('should save the webinaire', async () => {
      await useCase.execute(payload);
      const createdWebinaireOption = await webinaireGateway.getWebinaireById(
        'webinaire-id',
      );

      const createdWebinaire = createdWebinaireOption.get();
      expect(createdWebinaire).not.toBe(null);
      expect(createdWebinaire.current).toMatchObject({
        id: 'webinaire-id',
        organizerId: user.id,
        startAt: new Date('2023-01-21T11:00:00.000Z'),
        endAt: new Date('2023-01-21T12:00:00.000Z'),
        seats: 10,
      });
    });
  });

  describe('Scenario: the date of the webinaire is in 2 days', () => {
    const payload = {
      user: user,

      startAt: new Date('2023-01-03T11:00:00.000Z'),
      endAt: new Date('2023-01-03T12:00:00.000Z'),
      seats: 10,
    };

    it('should fail', async () => {
      expect(async () => {
        await useCase.execute(payload);
      }).rejects.toThrowError('Webinaire must start in at least 3 days');
    });

    it('should not create the webinaire', async () => {
      try {
        await useCase.execute(payload);
      } catch (e) {}

      expect(webinaireGateway.count()).toBe(0);
    });
  });

  describe('Scenario: the webinaire has an invalid number of seats', () => {
    it.each([-1, 0, 1001])('should fail with %i seats', async (seats) => {
      const payload = {
        user: user,

        startAt: new Date('2023-01-21T11:00:00.000Z'),
        endAt: new Date('2023-01-21T12:00:00.000Z'),
        seats: seats,
      };

      await expect(async () => {
        await useCase.execute(payload);
      }).rejects.toThrowError('Webinaire must have between 1 and 1000 seats');

      expect(webinaireGateway.count()).toBe(0);
    });
  });
});
