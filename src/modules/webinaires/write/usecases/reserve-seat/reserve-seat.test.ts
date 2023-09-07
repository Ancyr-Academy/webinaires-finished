import { InMemoryParticipationRepository } from '../../adapters/in-memory-participation-repository';
import { ReserveSeat } from './reserve-seat';
import { UserFactory } from '../../../../auth/entity/user.factory';
import { FixedIdProvider } from '../../../../system/id/fixed-id-provider';
import { WebinaireFactory } from '../../model/webinaire.factory';
import { ParticipationFactory } from '../../model/participation.factory';
import { LoopbackMailer } from '../../../../mailer/adapters/loopback-mailer';
import { InMemoryWebinaireRepository } from '../../adapters/in-memory-webinaire-repository';
import { InMemoryUserRepository } from '../../../../auth/adapters/in-memory/in-memory-user-repository';

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

  const bob = UserFactory.create({
    id: 'bob',
    emailAddress: 'bob@gmail.com',
  });

  const chad = UserFactory.create({
    id: 'chad',
    emailAddress: 'chad@gmail.com',
  });

  const webinaire = WebinaireFactory.create({
    id: 'webinaire-id-1',
    organizerId: 'bob',
  });

  const webinaireInWhichAliceParticipate = WebinaireFactory.create({
    id: 'webinaire-id-2',
    organizerId: 'bob',
  });

  const fullWebinaire = WebinaireFactory.create({
    id: 'full-webinaire-id',
    organizerId: 'bob',
    seats: 1,
  });

  const aliceParticipationInWebinaire = ParticipationFactory.create({
    id: 'alice-full-webinaire-id',
    webinaireId: webinaireInWhichAliceParticipate.data.id,
    userId: alice.id,
  });

  const chadParticipationInFullWebinaire = ParticipationFactory.create({
    id: 'chad-full-webinaire-id',
    webinaireId: fullWebinaire.data.id,
    userId: chad.id,
  });

  let idProvider: FixedIdProvider;
  let userRepository: InMemoryUserRepository;
  let participationRepository: InMemoryParticipationRepository;
  let webinaireRepository: InMemoryWebinaireRepository;
  let useCase: ReserveSeat;
  let mailer: LoopbackMailer;

  beforeEach(() => {
    idProvider = new FixedIdProvider('participation-id');
    userRepository = new InMemoryUserRepository([alice, bob, chad]);

    participationRepository = new InMemoryParticipationRepository([
      aliceParticipationInWebinaire,
      chadParticipationInFullWebinaire,
    ]);

    webinaireRepository = new InMemoryWebinaireRepository([
      webinaire,
      webinaireInWhichAliceParticipate,
      fullWebinaire,
    ]);
    mailer = new LoopbackMailer();

    useCase = new ReserveSeat(
      idProvider,
      userRepository,
      webinaireRepository,
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
        to: 'bob@gmail.com',
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
