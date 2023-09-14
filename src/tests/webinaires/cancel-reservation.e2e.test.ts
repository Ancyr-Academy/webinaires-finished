import { addDays } from 'date-fns';
import { TestApp } from '../setup/test-app';
import { WebinaireFactory } from '../../modules/webinaires/write/model/webinaire.factory';
import { UserFixture } from '../fixtures/user.fixture';
import { WebinaireFixture } from '../fixtures/webinaire.fixture';
import {
  IParticipationRepository,
  I_PARTICIPATION_REPOSITORY,
} from '../../modules/webinaires/write/ports/participation.repository';
import { ParticipationFixture } from '../fixtures/participation.fixture';
import { ParticipationFactory } from '../../modules/webinaires/write/model/participation.factory';

describe('Feature: canceling a reservation', () => {
  async function expectReservationToBeCanceled(
    webinaireId: string,
    userId: string,
  ) {
    const participationQuery = await participationRepository.find(
      webinaireId,
      userId,
    );

    expect(participationQuery.isNull()).toEqual(true);
  }

  let app: TestApp;
  let participationRepository: IParticipationRepository;

  let johnDoe: UserFixture, alice: UserFixture;
  let johnDoeWebinaire: WebinaireFixture;
  let aliceParticipation: ParticipationFixture;

  beforeEach(async () => {
    johnDoe = new UserFixture('johndoe@gmail.com', 'azerty');
    alice = new UserFixture('alice@gmail.com', 'azerty');

    app = new TestApp();
    await app.setup();
    await app.loadFixtures([johnDoe, alice]);

    participationRepository = app.get<IParticipationRepository>(
      I_PARTICIPATION_REPOSITORY,
    );

    johnDoeWebinaire = new WebinaireFixture(
      WebinaireFactory.create({
        id: 'john-doe-webinaire',
        organizerId: johnDoe.getId(),
        startAt: addDays(new Date(), 4),
        endAt: addDays(new Date(), 5),
      }),
    );

    await app.loadFixtures([johnDoeWebinaire]);

    aliceParticipation = new ParticipationFixture(
      ParticipationFactory.create({
        id: 'alice-participation',
        webinaireId: johnDoeWebinaire.getId(),
        userId: alice.getId(),
      }),
    );

    await app.loadFixtures([aliceParticipation]);
  });

  describe('Scenario: happy path', () => {
    it('should cancel the reservation', async () => {
      const result = await app
        .request()
        .delete(`/webinaires/${johnDoeWebinaire.getId()}/reservations`)
        .set('Authorization', alice.getAuthorizationToken());

      expect(result.status).toEqual(200);

      await expectReservationToBeCanceled(
        johnDoeWebinaire.getId(),
        aliceParticipation.getId(),
      );
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should fail to cancel the reservation', async () => {
      const result = await app
        .request()
        .delete(`/webinaires/${johnDoeWebinaire.getId()}/reservations`);

      expect(result.status).toEqual(401);
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
