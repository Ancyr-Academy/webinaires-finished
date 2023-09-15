import { addDays } from 'date-fns';
import { TestApp } from '../../setup/test-app';
import {
  IWebinaireRepository,
  I_WEBINAIRE_REPOSITORY,
} from '../../../modules/webinaires/write/ports/webinaire.repository';
import { WebinaireFactory } from '../../../modules/webinaires/write/model/webinaire.factory';
import { UserFixture } from '../../fixtures/user.fixture';
import { WebinaireFixture } from '../../fixtures/webinaire.fixture';

describe('Feature: canceling a webinaire', () => {
  async function expectWebinaireToExist(id: string) {
    const webinaireQuery = await webinaireRepository.findById(id);
    expect(webinaireQuery.isNull()).toEqual(false);
  }

  async function expectWebinaireNotToExist(id: string) {
    const webinaireQuery = await webinaireRepository.findById(id);
    expect(webinaireQuery.isNull()).toEqual(true);
  }

  let app: TestApp;
  let webinaireRepository: IWebinaireRepository;

  let johnDoe: UserFixture, alice: UserFixture;
  let johnDoeWebinaire: WebinaireFixture, aliceWebinaire: WebinaireFixture;

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

    webinaireRepository = app.get<IWebinaireRepository>(I_WEBINAIRE_REPOSITORY);

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
  });

  describe('Scenario: happy path', () => {
    it('should cancel the webinaire', async () => {
      const result = await app
        .request()
        .delete(`/webinaires/${johnDoeWebinaire.getId()}`)
        .set('Authorization', johnDoe.getAuthorizationToken());

      expect(result.status).toEqual(200);
      await expectWebinaireNotToExist(johnDoeWebinaire.getId());
    });
  });

  describe('Scenario: canceling someone else webinaire', () => {
    it('should not cancel the webinaire', async () => {
      const result = await app
        .request()
        .delete(`/webinaires/${aliceWebinaire.getId()}`)
        .set('Authorization', johnDoe.getAuthorizationToken());

      expect(result.status).toEqual(400);
      await expectWebinaireToExist(aliceWebinaire.getId());
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    it('should fail to cancel the webinaire', async () => {
      const result = await app
        .request()
        .delete(`/webinaires/${johnDoeWebinaire.getId()}`);

      expect(result.status).toEqual(401);
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
