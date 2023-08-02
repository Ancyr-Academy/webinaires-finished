import { addDays } from 'date-fns';
import { TestApp } from '../setup/test-app';
import {
  IWebinaireRepository,
  I_WEBINAIRE_REPOSITORY,
} from '../../modules/webinaires/ports/webinaire.repository';
import { UserFixture } from '../auth/user.fixture';

type Payload = {
  startAt: Date;
  endAt: Date;
  seats: number;
};

describe('Feature: organizing a webinaire', () => {
  async function expectWebinaireToBeOrganized(id: string, payload: Payload) {
    const webinaireQuery = await webinaireRepository.getWebinaireById(id);

    expect(webinaireQuery.isNull()).toEqual(false);

    const webinaire = webinaireQuery.get();

    expect(webinaire.data.startAt).toEqual(payload.startAt);
    expect(webinaire.data.endAt).toEqual(payload.endAt);
    expect(webinaire.data.seats).toEqual(payload.seats);
  }

  let app: TestApp;
  let webinaireRepository: IWebinaireRepository;

  let johnDoe: UserFixture;

  beforeEach(async () => {
    johnDoe = new UserFixture('johndoe@gmail.com', 'azerty');

    app = new TestApp();
    await app.setup();
    await app.loadFixtures([johnDoe]);

    webinaireRepository = app.get<IWebinaireRepository>(I_WEBINAIRE_REPOSITORY);
  });

  describe('Scenario: happy path', () => {
    const payload: Payload = {
      startAt: addDays(new Date(), 4),
      endAt: addDays(new Date(), 5),
      seats: 100,
    };

    it('should create a webinaire', async () => {
      const result = await app
        .request()
        .post('/webinaires')
        .set('Authorization', johnDoe.getAuthorizationToken())
        .send(payload);

      expect(result.status).toEqual(201);
      await expectWebinaireToBeOrganized(result.body.id, payload);
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    const payload: Payload = {
      startAt: addDays(new Date(), 4),
      endAt: addDays(new Date(), 5),
      seats: 100,
    };

    it('should fail to create the webinaire', async () => {
      const result = await app.request().post('/webinaires').send(payload);
      expect(result.status).toEqual(401);
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
