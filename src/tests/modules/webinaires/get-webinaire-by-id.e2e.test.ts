import { addDays } from 'date-fns';

import { TestApp } from '../../setup/test-app';
import { WebinaireFactory } from '../../../modules/webinaires/write/model/webinaire.factory';
import { UserFixture } from '../../fixtures/user.fixture';
import { WebinaireFixture } from '../../fixtures/webinaire.fixture';

describe('Feature: getting a webinaire by its ID', () => {
  let app: TestApp;

  let johnDoe: UserFixture;
  let johnDoeWebinaire: WebinaireFixture;

  beforeEach(async () => {
    johnDoe = new UserFixture({
      id: 'john-doe',
      emailAddress: 'johndoe@gmail.com',
      password: 'azerty',
    });
    app = new TestApp();
    await app.setup();
    await app.loadFixtures([johnDoe]);

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
    it('should get the webinaire', async () => {
      const result = await app
        .request()
        .get(`/webinaires/${johnDoeWebinaire.getId()}`);

      expect(result.status).toEqual(200);

      expect(result.body).toEqual({
        id: johnDoeWebinaire.entity.data.id,
        organizer: {
          id: johnDoe.props.id,
          emailAddress: johnDoe.props.emailAddress,
        },
        seats: {
          available: johnDoeWebinaire.entity.data.seats,
          total: johnDoeWebinaire.entity.data.seats,
        },
        startAt: johnDoeWebinaire.entity.data.startAt.toISOString(),
        endAt: johnDoeWebinaire.entity.data.endAt.toISOString(),
      });
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
