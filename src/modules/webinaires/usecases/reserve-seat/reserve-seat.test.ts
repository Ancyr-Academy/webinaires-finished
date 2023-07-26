import { InMemoryParticipationRepository } from '../../adapters/in-memory-participation-gateway';
import { ReserveSeat } from './reserve-seat';
import { UserFactory } from '../../../auth/entity/user.factory';
import { InMemoryWebinaireQuery } from '../../adapters/in-memory-webinaire-query';
import { FixedIdProvider } from '../../../system/id/fixed-id-provider';
import { WebinaireFactory } from '../../entities/webinaire.factory';
import { ParticipationFactory } from '../../entities/participation.factory';
import { LoopbackMailer } from '../../../mailer/adapters/loopback-mailer';

describe('Feature: reserving a seat', () => {
  async function expectParticipationNotToBeCreated() {
    const participationOption = await participationRepository.findById(
      'participation-id',
    );

    expect(participationOption.isNull()).toBe(true);
  }

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

  const webinaireInWhichAliceParticipate = WebinaireFactory.createViewModel({
    id: 'webinaire-id-2',
    organizer: {
      id: 'organizer-2',
      name: 'The Organizer 2',
      emailAddress: 'organizer-2@gmail.com',
    },
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
  let mailer: LoopbackMailer;

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
    mailer = new LoopbackMailer();

    useCase = new ReserveSeat(
      idProvider,
      webinaireQuery,
      participationRepository,
      mailer,
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

    it('should an email to the organizer', async () => {
      await useCase.execute(payload);
      const sentEmails = mailer.getSentEmails();

      expect(sentEmails).toContainEqual({
        to: 'organizer-1@gmail.com',
        subject: 'Nouvelle participation à votre webinaire',
        body: 'Une nouvelle personne participe à votre webinaire.',
      });
    });

    it('should an email to the participant', async () => {
      await useCase.execute(payload);
      const sentEmails = mailer.getSentEmails();

      expect(sentEmails).toContainEqual({
        to: 'alice@gmail.com',
        subject: 'Votre participation',
        body: 'Votre participation au webinaire a bien été pris en compte.',
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
