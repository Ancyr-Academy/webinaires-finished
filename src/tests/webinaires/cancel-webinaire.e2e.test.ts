import { addDays } from 'date-fns';
import { TestApp } from '../setup/test-app';
import {
  IWebinaireRepository,
  I_WEBINAIRE_REPOSITORY,
} from '../../modules/webinaires/ports/webinaire.repository';
import { WebinaireFactory } from '../../modules/webinaires/entities/webinaire.factory';
import { WebinaireEntity } from '../../modules/webinaires/entities/webinaire.entity';

describe('Feature: canceling a webinaire', () => {
  let app: TestApp;
  let authorization: string;
  let webinaireRepository: IWebinaireRepository;

  const johnDoe = {
    emailAddress: 'johndoe@gmail.com',
    password: 'azerty',
  };

  let johnDoeWebinaire: WebinaireEntity;

  beforeEach(async () => {
    app = new TestApp();
    await app.setup();

    const createdUser = await app.registerUser(
      johnDoe.emailAddress,
      johnDoe.password,
    );

    authorization = app.createAuthorizationToken(
      johnDoe.emailAddress,
      johnDoe.password,
    );

    johnDoeWebinaire = WebinaireFactory.create({
      id: 'john-doe-webinaire',
      organizerId: createdUser.id,
      startAt: addDays(new Date(), 4),
      endAt: addDays(new Date(), 5),
      seats: 100,
    });

    webinaireRepository = app.get<IWebinaireRepository>(I_WEBINAIRE_REPOSITORY);
    await webinaireRepository.create(johnDoeWebinaire);
  });

  describe('Scenario: happy path', () => {
    it('should cancel a webinaire', async () => {
      const result = await app
        .request()
        .delete(`/webinaires/${johnDoeWebinaire.data.id}`)
        .set('Authorization', authorization);

      expect(result.status).toEqual(200);

      const currentWebinaire = await webinaireRepository.getWebinaireById(
        result.body.id,
      );

      expect(currentWebinaire.isNull()).toEqual(true);
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
