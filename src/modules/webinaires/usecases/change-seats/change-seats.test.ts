import { UserFactory } from '../../../auth/entity/user.factory';
import { WebinaireFactory } from '../../entities/webinaire.factory';
import { InMemoryWebinaireRepository } from '../../gateway-infra/in-memory-webinaire-repository';
import { ChangeSeats } from './change-seats';

describe('Feature: Changing the number of seats of a webinaire', () => {
  async function getWebinaireById(id: string) {
    const updatedWebinaireOption = await webinaireGateway.getWebinaireById(id);
    return updatedWebinaireOption.getOrThrow();
  }

  const alice = UserFactory.create({
    id: 'alice',
  });

  const bob = UserFactory.create({
    id: 'bob',
  });

  const webinaire = WebinaireFactory.create({
    id: 'webinaire-id',
    organizerId: alice.id,
    seats: 5,
  });

  let webinaireGateway: InMemoryWebinaireRepository;
  let useCase: ChangeSeats;

  beforeEach(() => {
    webinaireGateway = new InMemoryWebinaireRepository();
    webinaireGateway.create(webinaire.cloneInitial());

    useCase = new ChangeSeats(webinaireGateway);
  });

  describe('Scenario: Changing the number of seats', () => {
    const payload = {
      user: alice,
      webinaireId: 'webinaire-id',
      seats: 10,
    };

    it('should update the webinaire', async () => {
      const result = await useCase.execute(payload);
      expect(result).toBeUndefined();

      const updatedWebinaire = await getWebinaireById('webinaire-id');
      expect(updatedWebinaire.data.seats).toBe(10);
    });
  });

  describe('Scenario: the webinaire does not exist', () => {
    const payload = {
      user: alice,
      webinaireId: 'does-not-exist',
      seats: 10,
    };

    it('should update the webinaire', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinaire not found',
      );

      const updatedWebinaire = await getWebinaireById('webinaire-id');
      expect(updatedWebinaire.data.seats).toBe(5);
    });
  });

  describe('Scenario: the user is not the organizer', () => {
    const payload = {
      user: bob,
      webinaireId: 'webinaire-id',
      seats: 10,
    };

    it('should fail to update', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Only the organizer can change the number of seats',
      );

      const updatedWebinaire = await getWebinaireById('webinaire-id');
      expect(updatedWebinaire.data.seats).toBe(5);
    });
  });

  describe('Scenario: reducing the number of seats available', () => {
    const payload = {
      user: alice,
      webinaireId: 'webinaire-id',
      seats: 3,
    };

    it('should fail to update', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'You cannot reduce the number of seats',
      );

      const updatedWebinaire = await getWebinaireById('webinaire-id');
      expect(updatedWebinaire.data.seats).toBe(5);
    });
  });

  describe('Scenario: using an invalid number of seats', () => {
    it('should fail with a too large amount of seats', async () => {
      const payload = {
        user: alice,
        webinaireId: 'webinaire-id',
        seats: 1001,
      };

      await expect(async () => {
        await useCase.execute(payload);
      }).rejects.toThrowError('Webinaire must have between 1 and 1000 seats');

      const updatedWebinaire = await getWebinaireById('webinaire-id');
      expect(updatedWebinaire.data.seats).toBe(5);
    });
  });
});
