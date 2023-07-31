import { addDays } from 'date-fns';
import { TestApp } from '../setup/test-app';
import {
  IWebinaireRepository,
  I_WEBINAIRE_REPOSITORY,
} from '../../modules/webinaires/ports/webinaire.repository';
import { WebinaireFactory } from '../../modules/webinaires/entities/webinaire.factory';
import { WebinaireEntity } from '../../modules/webinaires/entities/webinaire.entity';
import { UserFixture } from '../auth/user.fixture';

describe('Feature: canceling a webinaire', () => {
  let app: TestApp;
  let webinaireRepository: IWebinaireRepository;

  let johnDoe: UserFixture;
  let johnDoeWebinaire: WebinaireEntity;

  beforeEach(async () => {
    johnDoe = new UserFixture('johndoe@gmail.com', 'azerty');

    app = new TestApp();
    await app.setup();
    await app.loadFixtures([johnDoe]);

    johnDoeWebinaire = WebinaireFactory.create({
      id: 'john-doe-webinaire',
      organizerId: johnDoe.getId(),
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
        .set('Authorization', johnDoe.getAuthorizationToken());

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
