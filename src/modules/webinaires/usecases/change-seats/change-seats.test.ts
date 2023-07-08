import { UserFactory } from '../../../auth/entity/user.factory';
import { WebinaireFactory } from '../../entities/webinaire.factory';
import { InMemoryWebinaireGateway } from '../../gateway-infra/in-memory-webinaire-gateway';
import { ChangeSeats } from './change-seats';

describe('Changing the number of seats of a webinaire', () => {
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

  let webinaireGateway: InMemoryWebinaireGateway;
  let useCase: ChangeSeats;

  beforeEach(() => {
    webinaireGateway = new InMemoryWebinaireGateway();
    webinaireGateway.create(webinaire.cloneInitial());

    useCase = new ChangeSeats(webinaireGateway);
  });

  describe('Changing the number of seats', () => {
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

  describe('Changing the seats when the user is not the organizer', () => {
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

  describe('Changing the seats when the user is not the organizer', () => {
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

  describe('Using invalid number of seats', () => {
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
