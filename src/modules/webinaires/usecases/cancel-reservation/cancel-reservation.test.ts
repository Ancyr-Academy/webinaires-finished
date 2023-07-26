import { UserFactory } from '../../../auth/entity/user.factory';
import { LoopbackMailer } from '../../../mailer/gateway-infra/loopback-mailer';
import { WebinaireFactory } from '../../entities/webinaire.factory';
import { InMemoryWebinaireQuery } from '../../gateway-infra/in-memory-webinaire-query';
import { ParticipationFactory } from '../../entities/participation.factory';
import { InMemoryParticipationRepository } from '../../gateway-infra/in-memory-participation-gateway';
import { CancelReservation } from './cancel-reservation';

describe('Feature: canceling a participation', () => {
  const alice = UserFactory.create({
    id: 'alice',
    emailAddress: 'alice@gmail.com',
  });

  const webinaire = WebinaireFactory.createViewModel({
    id: 'webinaire-id-1',
    organizer: {
      id: 'organizer-1',
      name: 'The Organizer 1',
      emailAddress: 'organizer-1@gmail.com',
    },
  });

  const participation = ParticipationFactory.create({
    id: 'alice-participation-id',
    webinaireId: webinaire.data.id,
    userId: alice.id,
  });

  let participationRepository: InMemoryParticipationRepository;
  let webinaireQuery: InMemoryWebinaireQuery;
  let mailer: LoopbackMailer;
  let useCase: CancelReservation;

  beforeEach(() => {
    participationRepository = new InMemoryParticipationRepository({
      'alice-participation-id': participation,
    });
    webinaireQuery = new InMemoryWebinaireQuery({
      'webinaire-id-1': webinaire,
    });
    mailer = new LoopbackMailer();

    useCase = new CancelReservation(
      participationRepository,
      webinaireQuery,
      mailer,
    );
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

    it('should an email to the organizer', async () => {
      await useCase.execute(payload);
      const sentEmails = mailer.getSentEmails();

      expect(sentEmails).toContainEqual({
        to: 'organizer-1@gmail.com',
        subject: 'Annulation de participation',
        body: 'Une personne a annulé sa participation à votre webinaire.',
      });
    });

    it('should an email to the participant', async () => {
      await useCase.execute(payload);
      const sentEmails = mailer.getSentEmails();

      expect(sentEmails).toContainEqual({
        to: 'alice@gmail.com',
        subject: 'Annulation de votre participation',
        body: 'Votre participation au webinaire a bien été annulée.',
      });
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
