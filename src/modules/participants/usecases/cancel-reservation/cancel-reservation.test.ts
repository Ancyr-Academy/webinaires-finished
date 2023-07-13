import { UserFactory } from '../../../auth/entity/user.factory';
import { WebinaireFactory } from '../../../webinaires/entities/webinaire.factory';
import { ParticipationFactory } from '../../entities/participation.factory';
import { InMemoryParticipationRepository } from '../../gateway-infra/in-memory-participation-gateway';
import { CancelReservation } from './cancel-reservation';
describe('Feature: canceling a participation', () => {
  const alice = UserFactory.create({
    id: 'alice',
  });

  const webinaire = WebinaireFactory.createViewModel({
    id: 'webinaire-id-1',
  });

  const participation = ParticipationFactory.create({
    id: 'alice-participation-id',
    webinaireId: webinaire.data.id,
    userId: alice.id,
  });

  let participationRepository: InMemoryParticipationRepository;
  let useCase: CancelReservation;

  beforeEach(() => {
    participationRepository = new InMemoryParticipationRepository({
      'alice-participation-id': participation,
    });

    useCase = new CancelReservation(participationRepository);
  });

  describe('Scenario: canceling a participation', () => {
    const payload = {
      user: alice,
      webinaireId: webinaire.data.id,
    };

    it('should cancel the participation', async () => {
      await useCase.execute(payload);

      const participationOption = await participationRepository.findById(
        'alice-participation-id',
      );

      expect(participationOption.isNull()).toBe(true);
    });
  });

  describe('Scenario: the participation does not exist', () => {
    const payload = {
      user: alice,
      webinaireId: 'does-not-exist',
    };

    it('should cancel the participation', async () => {
      await expect(useCase.execute(payload)).rejects.toThrowError(
        'Participation not found',
      );

      const participationOption = await participationRepository.findById(
        'alice-participation-id',
      );

      expect(participationOption.isNull()).toBe(false);
    });
  });
});
