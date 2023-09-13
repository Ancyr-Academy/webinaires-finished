import { UserFactory } from '../../../../auth/core/user.factory';
import { LoopbackMailer } from '../../../../mailer/adapters/loopback-mailer';
import { FixedDateProvider } from '../../../../system/date/fixed-date-provider';
import { WebinaireFactory } from '../../model/webinaire.factory';
import { InMemoryWebinaireRepository } from '../../adapters/in-memory-webinaire-repository';
import { ChangeDates } from './change-dates';
import { InMemoryUserRepository } from '../../../../auth/adapters/in-memory-user-repository';
import { InMemoryParticipationRepository } from '../../adapters/in-memory-participation-repository';
import { ParticipationFactory } from '../../model/participation.factory';

describe('Feature: Changing the dates of a webinaire', () => {
  async function getWebinaireById(id: string) {
    const updatedWebinaireOption = await webinaireRepository.getWebinaireById(
      id,
    );
    return updatedWebinaireOption.getOrThrow();
  }

  async function expectDatesAreUnchanged(id: string) {
    const updatedWebinaire = await getWebinaireById(id);
    expect(updatedWebinaire.data.startAt).toEqual(startAt);
    expect(updatedWebinaire.data.endAt).toEqual(endAt);
  }

  const todayIs = new Date('2023-01-01T00:00:00.000Z');
  const startAt = new Date('2023-01-21T11:00:00.000Z');
  const endAt = new Date('2023-01-21T12:00:00.000Z');

  const alice = UserFactory.create({
    id: 'alice',
  });

  const bob = UserFactory.create({
    id: 'bob',
  });

  const webinaire = WebinaireFactory.create({
    id: 'webinaire-id',
    organizerId: alice.id,
    startAt,
    endAt,
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

  let dateProvider: FixedDateProvider;
  let userRepository: InMemoryUserRepository;
  let webinaireRepository: InMemoryWebinaireRepository;
  let participationRepository: InMemoryParticipationRepository;
  let mailer: LoopbackMailer;
  let useCase: ChangeDates;

  beforeEach(() => {
    dateProvider = new FixedDateProvider(todayIs);
    userRepository = new InMemoryUserRepository([alice, bob, jill, jack]);
    webinaireRepository = new InMemoryWebinaireRepository([webinaire]);
    participationRepository = new InMemoryParticipationRepository([
      jackParticipation,
      jillParticipation,
    ]);

    mailer = new LoopbackMailer();

    useCase = new ChangeDates(
      dateProvider,
      userRepository,
      webinaireRepository,
      participationRepository,
      mailer,
    );
  });

  describe('Scenario: Changing the dates', () => {
    const payload = {
      user: alice,
      webinaireId: 'webinaire-id',
      startAt: new Date('2023-01-29T11:00:00.000Z'),
      endAt: new Date('2023-01-29T12:00:00.000Z'),
    };

    it('should update the webinaire', async () => {
      const result = await useCase.execute(payload);
      expect(result).toBeUndefined();

      const updatedWebinaire = await getWebinaireById('webinaire-id');

      expect(updatedWebinaire.data.startAt).toEqual(
        new Date('2023-01-29T11:00:00.000Z'),
      );

      expect(updatedWebinaire.data.endAt).toEqual(
        new Date('2023-01-29T12:00:00.000Z'),
      );
    });

    it('should send an email to all participants', async () => {
      await useCase.execute(payload);
      const sentEmails = mailer.getSentEmails();

      expect(sentEmails).toContainEqual({
        to: 'jack@gmail.com',
        subject: 'Changement de dates',
        body: 'Les dates du webinaire ont été modifiées.',
      });

      expect(sentEmails).toContainEqual({
        to: 'jill@gmail.com',
        subject: 'Changement de dates',
        body: 'Les dates du webinaire ont été modifiées.',
      });
    });
  });

  describe('Scenario: the webinaire does not exist', () => {
    const payload = {
      user: bob,
      webinaireId: 'does-not-exist',
      startAt: new Date('2023-01-29T11:00:00.000Z'),
      endAt: new Date('2023-01-29T12:00:00.000Z'),
    };

    it('should fail to update', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinaire not found',
      );

      await expectDatesAreUnchanged('webinaire-id');
    });
  });

  describe('Scenario: the user is not the organizer', () => {
    const payload = {
      user: bob,
      webinaireId: 'webinaire-id',
      startAt: new Date('2023-01-29T11:00:00.000Z'),
      endAt: new Date('2023-01-29T12:00:00.000Z'),
    };

    it('should fail to update', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Only the organizer can change the dates',
      );

      await expectDatesAreUnchanged('webinaire-id');
    });
  });

  describe('Scenario: the choosen date is too close to today', () => {
    const payload = {
      user: alice,
      webinaireId: 'webinaire-id',
      startAt: new Date('2023-01-03T11:00:00.000Z'),
      endAt: new Date('2023-01-03T12:00:00.000Z'),
    };

    it('should fail to update', async () => {
      await expect(useCase.execute(payload)).rejects.toThrow(
        'Webinaire must start in at least 3 days',
      );

      await expectDatesAreUnchanged('webinaire-id');
    });
  });
});
