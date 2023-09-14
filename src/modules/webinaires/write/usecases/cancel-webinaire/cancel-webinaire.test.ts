import { UserFactory } from '../../../../auth/core/user.factory';
import { LoopbackMailer } from '../../../../mailer/adapters/loopback-mailer';
import { WebinaireFactory } from '../../model/webinaire.factory';
import { InMemoryWebinaireRepository } from '../../adapters/in-memory-webinaire-repository';
import { CancelWebinaire } from './cancel-webinaire';
import { ParticipationFactory } from '../../model/participation.factory';
import { InMemoryParticipationRepository } from '../../adapters/in-memory-participation-repository';
import { InMemoryUserRepository } from '../../../../auth/adapters/in-memory-user-repository';
describe('Feature: canceling a webinaire', () => {
  const alice = UserFactory.create({
    id: 'alice',
  });

  const bob = UserFactory.create({
    id: 'bob',
  });

  const webinaire = WebinaireFactory.create({
    id: 'webinaire-id',
    organizerId: alice.id,
  });

  const jack = UserFactory.create({
    id: 'jack',
    emailAddress: 'jack@gmail.com',
  });

  const jill = UserFactory.create({
    id: 'jill',
    emailAddress: 'jill@gmail.com',
  });

  const jackParticipation = ParticipationFactory.create({
    id: 'jack-participation',
    webinaireId: webinaire.id,
    userId: jack.id,
  });

  const jillParticipation = ParticipationFactory.create({
    id: 'jill-participation',
    webinaireId: webinaire.id,
    userId: jill.id,
  });

  let userRepository: InMemoryUserRepository;
  let webinaireRepository: InMemoryWebinaireRepository;
  let participationRepository: InMemoryParticipationRepository;
  let mailer: LoopbackMailer;
  let useCase: CancelWebinaire;

  beforeEach(() => {
    userRepository = new InMemoryUserRepository([alice, bob, jill, jack]);
    webinaireRepository = new InMemoryWebinaireRepository([webinaire]);
    participationRepository = new InMemoryParticipationRepository([
      jackParticipation,
      jillParticipation,
    ]);

    mailer = new LoopbackMailer();
    useCase = new CancelWebinaire(
      userRepository,
      webinaireRepository,
      participationRepository,
      mailer,
    );
  });

  describe('Scenario: canceling a webinaire', () => {
    const payload = {
      user: alice,
      webinaireId: 'webinaire-id',
    };

    it('should delete the webinaire', async () => {
      await useCase.execute(payload);

      const updatedWebinaireOption =
        await webinaireRepository.getWebinaireById('webinaire-id');

      expect(updatedWebinaireOption.isNull()).toBe(true);
    });

    it('should send an email to all participants', async () => {
      await useCase.execute(payload);
      const sentEmails = mailer.getSentEmails();

      expect(sentEmails).toContainEqual({
        to: 'jack@gmail.com',
        subject: 'Annulation du webinaire',
        body: 'Le webinaire a été annulé.',
      });

      expect(sentEmails).toContainEqual({
        to: 'jill@gmail.com',
        subject: 'Annulation du webinaire',
        body: 'Le webinaire a été annulé.',
      });
    });
  });

  describe('Scenario: canceling a webinaire that does not exist', () => {
    it('should fail', async () => {
      await expect(
        useCase.execute({
          user: alice,
          webinaireId: 'does-not-exist',
        }),
      ).rejects.toThrowError('Webinaire not found');
    });
  });

  describe('Scenario: canceling a webinaire the user does not own', () => {
    it('should fail', async () => {
      await expect(
        useCase.execute({
          user: bob,
          webinaireId: 'webinaire-id',
        }),
      ).rejects.toThrowError('Only the organizer can cancel the webinaire');
    });
  });
});
