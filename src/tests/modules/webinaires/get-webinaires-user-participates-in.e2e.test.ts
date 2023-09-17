import { addDays } from 'date-fns';

import { TestApp } from '../../setup/test-app';
import { WebinaireFactory } from '../../../modules/webinaires/write/model/webinaire.factory';
import { UserFixture } from '../../fixtures/user.fixture';
import { WebinaireFixture } from '../../fixtures/webinaire.fixture';
import { ParticipationFixture } from '../../fixtures/participation.fixture';
import { ParticipationFactory } from '../../../modules/webinaires/write/model/participation.factory';

describe('Feature: getting the webinaires the user participates in', () => {
  let app: TestApp;

  let johnDoe: UserFixture, alice: UserFixture;
  let johnDoeWebinaire: WebinaireFixture;
  let aliceParticipation: ParticipationFixture;

  beforeEach(async () => {
    johnDoe = new UserFixture({
      id: 'john-doe',
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty',
    });
    alice = new UserFixture({
      id: 'alice',
      emailAddress: 'alice@gmail.com',
      password: 'azerty',
    });

    app = new TestApp();
    await app.setup();
    await app.loadFixtures([johnDoe, alice]);

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

  describe('Case: alice participates in one webinaire', () => {
    it('should get the webinaires', async () => {
      const result = await app
        .request()
        .get(`/webinaires/participated`)
        .set('Authorization', alice.getAuthorizationToken());

      expect(result.status).toEqual(200);
      expect(result.body).toEqual([
        {
          id: johnDoeWebinaire.entity.data.id,
          organizer: {
            id: johnDoe.props.id,
            emailAddress: johnDoe.props.emailAddress,
          },
          seats: {
            available: johnDoeWebinaire.entity.data.seats - 1,
            total: johnDoeWebinaire.entity.data.seats,
          },
          startAt: johnDoeWebinaire.entity.data.startAt.toISOString(),
          endAt: johnDoeWebinaire.entity.data.endAt.toISOString(),
        },
      ]);
    });
  });

  describe('Case: john participates in zero webinaire', () => {
    it('should get an empty list', async () => {
      const result = await app
        .request()
        .get(`/webinaires/participated`)
        .set('Authorization', johnDoe.getAuthorizationToken());

      expect(result.status).toEqual(200);
      expect(result.body).toEqual([]);
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
