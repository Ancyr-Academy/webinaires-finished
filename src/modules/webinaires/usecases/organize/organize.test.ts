import { UserFactory } from '../../../auth/entity/user.factory';
import { Optional } from '../../../shared/optional';
import { FixedDateProvider } from '../../../system/date/fixed-date-provider';
import { FixedIdProvider } from '../../../system/id/fixed-id-provider';
import { WebinaireEntity } from '../../entities/webinaire.entity';
import { IWebinaireGateway } from '../../gateway/webinaire.gateway';
import { Organize } from './organize';

class InMemoryWebinaireGateway implements IWebinaireGateway {
  private webinaires = new Map<string, WebinaireEntity>();

  async getWebinaireById(id: string): Promise<Optional<WebinaireEntity>> {
    const webinaire = this.webinaires.get(id);
    return webinaire ? Optional.of(webinaire) : Optional.empty();
  }

  async create(entity: WebinaireEntity): Promise<void> {
    this.webinaires.set(entity.id, entity);
    return;
  }

  count() {
    return this.webinaires.size;
  }
}
describe('Organizing webinaires', () => {
  const todayIs = new Date('2023-01-01T00:00:00.000Z');
  const user = UserFactory.create();

  let idProvider: FixedIdProvider;
  let dateProvider: FixedDateProvider;
  let webinaireGateway: InMemoryWebinaireGateway;
  let useCase: Organize;

  beforeEach(() => {
    idProvider = new FixedIdProvider('webinaire-id');
    dateProvider = new FixedDateProvider(todayIs);
    webinaireGateway = new InMemoryWebinaireGateway();
    useCase = new Organize(idProvider, dateProvider, webinaireGateway);
  });

  describe('Organizing a webinaire', () => {
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

  describe('Organizing a webinaire too close to the start date', () => {
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

  describe('Organizing a webinaire with an invalid amount of seats', () => {
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
