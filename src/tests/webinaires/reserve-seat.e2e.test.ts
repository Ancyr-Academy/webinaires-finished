import { addDays } from 'date-fns';
import { TestApp } from '../setup/test-app';
import { WebinaireFactory } from '../../modules/webinaires/write/model/webinaire.factory';
import { UserFixture } from '../auth/user.fixture';
import { WebinaireFixture } from './webinaire.fixture';
import {
  IParticipationRepository,
  I_PARTICIPATION_REPOSITORY,
} from '../../modules/webinaires/write/ports/participation.repository';

describe('Feature: reserving a seat', () => {
  async function expectSeatToBeReserved(webinaireId: string, userId: string) {
    const currentParticipation = await participationRepository.find(
      webinaireId,
      userId,
    );

    expect(currentParticipation.isNull()).toEqual(false);
  }

  let app: TestApp;
  let participationRepository: IParticipationRepository;

  let johnDoe: UserFixture, alice: UserFixture;
  let johnDoeWebinaire: WebinaireFixture;

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
  });

  describe('Scenario: happy path', () => {
    it('should reserve a seat', async () => {
      const result = await app
        .request()
        .post(`/webinaires/${johnDoeWebinaire.getId()}/reservations`)
        .set('Authorization', alice.getAuthorizationToken());

      expect(result.status).toEqual(201);
      await expectSeatToBeReserved(johnDoeWebinaire.getId(), alice.getId());
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should fail to reserve a seat', async () => {
      const result = await app
        .request()
        .post(`/webinaires/${johnDoeWebinaire.getId()}/reservations`);

      expect(result.status).toEqual(401);
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
