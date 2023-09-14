import { addDays } from 'date-fns';
import { TestApp } from '../../setup/test-app';
import { WebinaireFactory } from '../../../modules/webinaires/write/model/webinaire.factory';
import { UserFixture } from '../../fixtures/user.fixture';
import { WebinaireFixture } from '../../fixtures/webinaire.fixture';
import {
  IWebinaireRepository,
  I_WEBINAIRE_REPOSITORY,
} from '../../../modules/webinaires/write/ports/webinaire.repository';
import { EntityType } from '../../../modules/shared/entity';
import { WebinaireEntity } from '../../../modules/webinaires/write/model/webinaire.entity';

describe('Feature: changing the dates of a webinaire', () => {
  async function expectDatesToBeChanged(
    id: string,
    startAt: Date,
    endAt: Date,
  ) {
    const webinaireQuery = await webinaireRepository.getWebinaireById(id);
    const webinaire = webinaireQuery.getOrThrow();

    expect(webinaire.data.startAt).toEqual(startAt);
    expect(webinaire.data.endAt).toEqual(endAt);
  }

  async function expectDatesNotToBeChanged(id: string) {
    const webinaireQuery = await webinaireRepository.getWebinaireById(id);
    const webinaire = webinaireQuery.getOrThrow();

    expect(webinaire.data.startAt).toEqual(bobWebinaireData.startAt);
    expect(webinaire.data.endAt).toEqual(bobWebinaireData.endAt);
  }

  let app: TestApp;
  let webinaireRepository: IWebinaireRepository;

  let bob: UserFixture, alice: UserFixture;
  let bobWebinaire: WebinaireFixture;

  const bobWebinaireData: Partial<EntityType<WebinaireEntity>> = {
    id: 'john-doe-webinaire',
    startAt: addDays(new Date(), 4),
    endAt: addDays(new Date(), 5),
  };

  beforeEach(async () => {
    bob = new UserFixture({
      id: 'bob',
      emailAddress: 'bob@gmail.com',
      password: 'azerty',
    });
    alice = new UserFixture({
      id: 'alice',
      emailAddress: 'alice@gmail.com',
      password: 'azerty',
    });

    app = new TestApp();
    await app.setup();
    await app.loadFixtures([bob, alice]);

    webinaireRepository = app.get<IWebinaireRepository>(I_WEBINAIRE_REPOSITORY);

    bobWebinaire = new WebinaireFixture(
      WebinaireFactory.create({
        ...bobWebinaireData,
        organizerId: bob.getId(),
      }),
    );

    await app.loadFixtures([bobWebinaire]);
  });

  describe('Scenario: happy path', () => {
    const startAt = addDays(new Date(), 7);
    const endAt = addDays(new Date(), 8);

    it('should change the dates', async () => {
      const result = await app
        .request()
        .post(`/webinaires/${bobWebinaire.getId()}/dates`)
        .send({ startAt, endAt })
        .set('Authorization', bob.getAuthorizationToken());

      expect(result.status).toEqual(200);
      await expectDatesToBeChanged(bobWebinaire.getId(), startAt, endAt);
    });
  });

  describe('Scenario: changing the dates of someone else webinaire', () => {
    const startAt = addDays(new Date(), 7);
    const endAt = addDays(new Date(), 8);

    it('should not change the dates', async () => {
      const result = await app
        .request()
        .post(`/webinaires/${bobWebinaire.getId()}/dates`)
        .send({ startAt, endAt })
        .set('Authorization', alice.getAuthorizationToken());

      expect(result.status).toEqual(400);
      await expectDatesNotToBeChanged(bobWebinaire.getId());
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    const startAt = addDays(new Date(), 7);
    const endAt = addDays(new Date(), 8);

    it('should fail to change the dates', async () => {
      const result = await app
        .request()
        .post(`/webinaires/${bobWebinaire.getId()}/dates`)
        .send({ startAt, endAt });

      expect(result.status).toEqual(401);
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
