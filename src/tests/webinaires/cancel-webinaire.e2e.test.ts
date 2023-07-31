import { addDays } from 'date-fns';
import { TestApp } from '../setup/test-app';
import {
  IWebinaireRepository,
  I_WEBINAIRE_REPOSITORY,
} from '../../modules/webinaires/ports/webinaire.repository';
import { WebinaireFactory } from '../../modules/webinaires/entities/webinaire.factory';
import { UserFixture } from '../auth/user.fixture';
import { WebinaireFixture } from './webinaire.fixture';

describe('Feature: canceling a webinaire', () => {
  async function expectWebinaireToExist(id: string) {
    const currentWebinaire = await webinaireRepository.getWebinaireById(id);
    expect(currentWebinaire.isNull()).toEqual(true);
  }

  let app: TestApp;
  let webinaireRepository: IWebinaireRepository;

  let johnDoe: UserFixture, alice: UserFixture;
  let johnDoeWebinaire: WebinaireFixture, aliceWebinaire: WebinaireFixture;

  beforeEach(async () => {
    johnDoe = new UserFixture('johndoe@gmail.com', 'azerty');
    alice = new UserFixture('alice@gmail.com', 'azerty');

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

    aliceWebinaire = new WebinaireFixture(
      WebinaireFactory.create({
        id: 'alice-webinaire',
        organizerId: alice.getId(),
        startAt: addDays(new Date(), 2),
        endAt: addDays(new Date(), 3),
      }),
    );

    await app.loadFixtures([johnDoeWebinaire, aliceWebinaire]);

    webinaireRepository = app.get<IWebinaireRepository>(I_WEBINAIRE_REPOSITORY);
  });

  describe('Scenario: happy path', () => {
    it('should cancel the webinaire', async () => {
      const result = await app
        .request()
        .delete(`/webinaires/${johnDoeWebinaire.getId()}`)
        .set('Authorization', johnDoe.getAuthorizationToken());

      expect(result.status).toEqual(200);
      await expectWebinaireToExist(result.body.id);
    });
  });

  describe('Scenario: canceling someone else webinaire', () => {
    it('should not cancel the webinaire', async () => {
      const result = await app
        .request()
        .delete(`/webinaires/${aliceWebinaire.getId()}`)
        .set('Authorization', johnDoe.getAuthorizationToken());

      expect(result.status).toEqual(400);
      await expectWebinaireToExist(result.body.id);
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should fail to cancel the webinaire', async () => {
      const result = await app
        .request()
        .delete('/webinaires/john-doe-webinaire');

      expect(result.status).toEqual(401);
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
