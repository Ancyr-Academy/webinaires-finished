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

describe('Feature: changing the seats of a webinaire', () => {
  async function expectDatesToBeChanged(id: string, seats: number) {
    const webinaireQuery = await webinaireRepository.findById(id);
    const webinaire = webinaireQuery.getOrThrow();

    expect(webinaire.data.seats).toEqual(seats);
  }

  async function expectDatesNotToBeChanged(id: string) {
    const webinaireQuery = await webinaireRepository.findById(id);
    const webinaire = webinaireQuery.getOrThrow();

    expect(webinaire.data.seats).toEqual(bobWebinaireData.seats);
  }

  let app: TestApp;
  let webinaireRepository: IWebinaireRepository;

  let bob: UserFixture, alice: UserFixture;
  let bobWebinaire: WebinaireFixture;

  const bobWebinaireData: Partial<EntityType<WebinaireEntity>> = {
    id: 'john-doe-webinaire',
    seats: 10,
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
    const seats = 50;

    it('should change the seats', async () => {
      const result = await app
        .request()
        .post(`/webinaires/${bobWebinaire.getId()}/seats`)
        .send({ seats })
        .set('Authorization', bob.getAuthorizationToken());

      expect(result.status).toEqual(200);
      await expectDatesToBeChanged(bobWebinaire.getId(), seats);
    });
  });

  describe('Scenario: changing the seats of someone else webinaire', () => {
    const seats = 50;

    it('should not change the seats', async () => {
      const result = await app
        .request()
        .post(`/webinaires/${bobWebinaire.getId()}/seats`)
        .send({ seats })
        .set('Authorization', alice.getAuthorizationToken());

      expect(result.status).toEqual(400);
      await expectDatesNotToBeChanged(bobWebinaire.getId());
    });
  });

  describe('Scenario: the user is not authenticated', () => {
    const seats = 50;

    it('should fail to change the seats', async () => {
      const result = await app
        .request()
        .post(`/webinaires/${bobWebinaire.getId()}/seats`)
        .send({ seats });

      expect(result.status).toEqual(401);
    });
  });

  afterEach(async () => {
    await app.teardown();
  });
});
