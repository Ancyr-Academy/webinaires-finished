import { InMemoryParticipationRepository } from '../../gateway-infra/in-memory-participation-gateway';
import { ReserveSeat } from './reserve-seat';
import { UserFactory } from '../../../auth/entity/user.factory';
import { InMemoryWebinaireQuery } from '../../../webinaires/gateway-infra/in-memory-webinaire-query';
import { FixedIdProvider } from '../../../system/id/fixed-id-provider';
import { WebinaireFactory } from '../../../webinaires/entities/webinaire.factory';
import { ParticipationFactory } from '../../entities/participation.factory';

describe('Feature: reserving a seat', () => {
  async function expectParticipationNotToBeCreated() {
    const participationOption = await participationRepository.findById(
      'participation-id',
    );

    expect(participationOption.isNull()).toBe(true);
  }

  const alice = UserFactory.create({
    id: 'alice',
  });

  const webinaire = WebinaireFactory.createViewModel({
    id: 'webinaire-id-1',
  });

  const webinaireInWhichAliceParticipate = WebinaireFactory.createViewModel({
    id: 'webinaire-id-2',
  });

  const fullWebinaire = WebinaireFactory.createViewModel({
    id: 'full-webinaire-id',
    seats: {
      available: 0,
      total: 10,
    },
  });

  const aliceParticipationInWebinaire = ParticipationFactory.create({
    id: 'alice-participation-id',
    webinaireId: webinaireInWhichAliceParticipate.data.id,
    userId: alice.id,
  });

  let idProvider: FixedIdProvider;
  let participationRepository: InMemoryParticipationRepository;
  let webinaireQuery: InMemoryWebinaireQuery;
  let useCase: ReserveSeat;

  beforeEach(() => {
    idProvider = new FixedIdProvider('participation-id');
    participationRepository = new InMemoryParticipationRepository({
      'alice-participation-id': aliceParticipationInWebinaire,
    });
    webinaireQuery = new InMemoryWebinaireQuery({
      'webinaire-id-1': webinaire,
      'webinaire-id-2': webinaireInWhichAliceParticipate,
      'full-webinaire-id': fullWebinaire,
    });

    useCase = new ReserveSeat(
      idProvider,
      webinaireQuery,
      participationRepository,
    );
  });

  describe('Scenario: user reserves a seat', () => {
    const payload = {
      user: alice,
      webinaireId: 'webinaire-id-1',
    };

    it('should reserve a seat', async () => {
      await useCase.execute(payload);

      const participationOption = await participationRepository.find(
        'webinaire-id-1',
        alice.id,
      );

      const participation = participationOption.get();
      expect(participation.data).toMatchObject({
        id: 'participation-id',
        webinaireId: 'webinaire-id-1',
        userId: alice.id,
      });
    });
  });

  describe('Scenario: the webinaire does not exist', () => {
    const payload = {
      user: alice,
      webinaireId: 'does-not-exist',
    };

    it('should fail to reserve the seat', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinaire not found',
      );

      await expectParticipationNotToBeCreated();
    });
  });

  describe('Scenario: the webinaire is full', () => {
    const payload = {
      user: alice,
      webinaireId: fullWebinaire.data.id,
    };

    it('should fail to reserve the seat', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinaire is full',
      );

      await expectParticipationNotToBeCreated();
    });
  });

  describe('Scenario: the user already has a participation', () => {
    const payload = {
      user: alice,
      webinaireId: webinaireInWhichAliceParticipate.data.id,
    };

    it('should fail to reserve the seat', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'You already participate in this webinaire',
      );

      await expectParticipationNotToBeCreated();
    });
  });
});
