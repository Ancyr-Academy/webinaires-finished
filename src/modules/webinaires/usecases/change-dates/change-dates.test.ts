import { UserFactory } from '../../../auth/entity/user.factory';
import { FixedDateProvider } from '../../../system/date/fixed-date-provider';
import { WebinaireFactory } from '../../entities/webinaire.factory';
import { InMemoryWebinaireRepository } from '../../gateway-infra/in-memory-webinaire-repository';
import { ChangeDates } from './change-dates';

describe('Feature: Changing the dates of a webinaire', () => {
  async function getWebinaireById(id: string) {
    const updatedWebinaireOption = await webinaireGateway.getWebinaireById(id);
    return updatedWebinaireOption.getOrThrow();
  }

  async function expectDatesAreUnchanged(id: string) {
    const updatedWebinaire = await getWebinaireById(id);
    expect(updatedWebinaire.data.startAt).toEqual(startAt);
    expect(updatedWebinaire.data.endAt).toEqual(endAt);
  }

  const todayIs = new Date('2023-01-01T00:00:00.000Z');
  const startAt = new Date('2023-01-21T11:00:00.000Z');
  const endAt = new Date('2023-01-21T12:00:00.000Z');

  const alice = UserFactory.create({
    id: 'alice',
  });

  const bob = UserFactory.create({
    id: 'bob',
  });

  const webinaire = WebinaireFactory.create({
    id: 'webinaire-id',
    organizerId: alice.id,
    startAt,
    endAt,
  });

  let dateProvider: FixedDateProvider;
  let webinaireGateway: InMemoryWebinaireRepository;
  let useCase: ChangeDates;

  beforeEach(() => {
    dateProvider = new FixedDateProvider(todayIs);
    webinaireGateway = new InMemoryWebinaireRepository();
    webinaireGateway.create(webinaire.cloneInitial());

    useCase = new ChangeDates(dateProvider, webinaireGateway);
  });

  describe('Scenario: Changing the dates', () => {
    const payload = {
      user: alice,
      webinaireId: 'webinaire-id',
      startAt: new Date('2023-01-29T11:00:00.000Z'),
      endAt: new Date('2023-01-29T12:00:00.000Z'),
    };

    it('should update the webinaire', async () => {
      const result = await useCase.execute(payload);
      expect(result).toBeUndefined();

      const updatedWebinaire = await getWebinaireById('webinaire-id');

      expect(updatedWebinaire.data.startAt).toEqual(
        new Date('2023-01-29T11:00:00.000Z'),
      );

      expect(updatedWebinaire.data.endAt).toEqual(
        new Date('2023-01-29T12:00:00.000Z'),
      );
    });
  });

  describe('Scenario: the webinaire does not exist', () => {
    const payload = {
      user: bob,
      webinaireId: 'does-not-exist',
      startAt: new Date('2023-01-29T11:00:00.000Z'),
      endAt: new Date('2023-01-29T12:00:00.000Z'),
    };

    it('should fail to update', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinaire not found',
      );

      await expectDatesAreUnchanged('webinaire-id');
    });
  });

  describe('Scenario: the user is not the organizer', () => {
    const payload = {
      user: bob,
      webinaireId: 'webinaire-id',
      startAt: new Date('2023-01-29T11:00:00.000Z'),
      endAt: new Date('2023-01-29T12:00:00.000Z'),
    };

    it('should fail to update', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Only the organizer can change the dates',
      );

      await expectDatesAreUnchanged('webinaire-id');
    });
  });

  describe('Scenario: the choosen date is too close to today', () => {
    const payload = {
      user: alice,
      webinaireId: 'webinaire-id',
      startAt: new Date('2023-01-03T11:00:00.000Z'),
      endAt: new Date('2023-01-03T12:00:00.000Z'),
    };

    it('should fail to update', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinaire must start in at least 3 days',
      );

      await expectDatesAreUnchanged('webinaire-id');
    });
  });
});
