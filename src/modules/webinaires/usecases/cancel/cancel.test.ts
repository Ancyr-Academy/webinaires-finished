import { UserFactory } from '../../../auth/entity/user.factory';
import { LoopbackMailer } from '../../../mailer/gateway-infra/loopback-mailer';
import { ParticipationFactory } from '../../../participants/entities/participation.factory';
import { InMemoryParticipantQuery } from '../../../participants/gateway-infra/in-memory-participant-query';
import { WebinaireFactory } from '../../entities/webinaire.factory';
import { InMemoryWebinaireRepository } from '../../gateway-infra/in-memory-webinaire-repository';
import { Cancel } from './cancel';
describe('Feature: canceling a webinaire', () => {
  const createParticipant = (name: string) =>
    ParticipationFactory.createViewModel({
      id: `user-${name}`,
      name: name,
      emailAddress: `${name}@gmail.com`,
    });

  let webinaireGateway: InMemoryWebinaireRepository;
  let participantQuery: InMemoryParticipantQuery;
  let mailer: LoopbackMailer;
  let useCase: Cancel;

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

  const jack = createParticipant('jack');
  const jill = createParticipant('jill');

  beforeEach(() => {
    webinaireGateway = new InMemoryWebinaireRepository();
    webinaireGateway.create(webinaire.cloneInitial());

    participantQuery = new InMemoryParticipantQuery({
      [webinaire.id]: [jack, jill],
    });

    mailer = new LoopbackMailer();
    useCase = new Cancel(webinaireGateway, participantQuery, mailer);
  });

  describe('Scenario: canceling a webinaire', () => {
    const payload = {
      user: alice,
      webinaireId: 'webinaire-id',
    };

    it('should delete the webinaire', async () => {
      await useCase.execute(payload);

      const updatedWebinaireOption = await webinaireGateway.getWebinaireById(
        'webinaire-id',
      );

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
