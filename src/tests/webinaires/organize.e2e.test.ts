import { addDays } from 'date-fns';
import { TestApp } from '../setup/test-app';
import {
  IWebinaireRepository,
  I_WEBINAIRE_REPOSITORY,
} from '../../modules/webinaires/ports/webinaire.repository';

describe('Feature: organizing a webinaire', () => {
  let app: TestApp;
  let authorization: string;
  let webinaireRepository: IWebinaireRepository;

  const johnDoe = {
    emailAddress: 'johndoe@gmail.com',
    password: 'azerty',
  };

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    await app.registerUser(johnDoe.emailAddress, johnDoe.password);
    authorization = app.createAuthorizationToken(
      johnDoe.emailAddress,
      johnDoe.password,
    );

    webinaireRepository = app.get<IWebinaireRepository>(I_WEBINAIRE_REPOSITORY);
  });

  describe('Scenario: happy path', () => {
    const payload = {
      startAt: addDays(new Date(), 4),
      endAt: addDays(new Date(), 5),
      seats: 100,
    };

    it('should create a webinaire', async () => {
      const result = await app
        .request()
        .post('/webinaires')
        .set('Authorization', authorization)
        .send(payload);

      expect(result.status).toEqual(201);

      const webinaire = await webinaireRepository.getWebinaireById(
        result.body.id,
      );

      expect(webinaire.isNull()).toEqual(false);

      const createdWebinaire = webinaire.get();

      expect(createdWebinaire.data.startAt).toEqual(payload.startAt);
      expect(createdWebinaire.data.endAt).toEqual(payload.endAt);
      expect(createdWebinaire.data.seats).toEqual(payload.seats);
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    const payload = {
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
