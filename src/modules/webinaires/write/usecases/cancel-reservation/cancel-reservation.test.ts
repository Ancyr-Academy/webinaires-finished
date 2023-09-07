import { UserFactory } from '../../../../auth/entity/user.factory';
import { LoopbackMailer } from '../../../../mailer/adapters/loopback-mailer';
import { WebinaireFactory } from '../../model/webinaire.factory';
import { ParticipationFactory } from '../../model/participation.factory';
import { InMemoryParticipationRepository } from '../../adapters/in-memory-participation-repository';
import { CancelReservation } from './cancel-reservation';
import { InMemoryWebinaireRepository } from '../../adapters/in-memory-webinaire-repository';
import { InMemoryUserRepository } from '../../../../auth/adapters/in-memory/in-memory-user-repository';

describe('Feature: canceling a participation', () => {
  const alice = UserFactory.create({
    id: 'alice',
    emailAddress: 'alice@gmail.com',
  });

  const bob = UserFactory.create({
    id: 'bob',
    emailAddress: 'bob@gmail.com',
  });

  const webinaire = WebinaireFactory.create({
    id: 'webinaire-id-1',
    organizerId: 'bob',
  });

  const participation = ParticipationFactory.create({
    id: 'alice-participation-id',
    webinaireId: webinaire.data.id,
    userId: alice.id,
  });

  let userRepository: InMemoryUserRepository;
  let participationRepository: InMemoryParticipationRepository;
  let webinaireRepository: InMemoryWebinaireRepository;
  let mailer: LoopbackMailer;
  let useCase: CancelReservation;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([alice, bob]);

    participationRepository = new InMemoryParticipationRepository([
      participation,
    ]);

    webinaireRepository = new InMemoryWebinaireRepository([webinaire]);
    mailer = new LoopbackMailer();

    useCase = new CancelReservation(
      userRepository,
      participationRepository,
      webinaireRepository,
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
        to: 'bob@gmail.com',
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
