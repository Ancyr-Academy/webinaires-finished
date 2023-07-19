import { UserFactory } from '../../../auth/entity/user.factory';
import { LoopbackMailer } from '../../../mailer/gateway-infra/loopback-mailer';
import { WebinaireFactory } from '../../entities/webinaire.factory';
import { InMemoryWebinaireRepository } from '../../gateway-infra/in-memory-webinaire-repository';
import { Cancel } from './cancel';
describe('Feature: canceling a webinaire', () => {
  let webinaireGateway: InMemoryWebinaireRepository;
  let mailer: LoopbackMailer;
  let useCase: Cancel;

  const alice = UserFactory.create({
    id: 'alice',
  });

  const bob = UserFactory.create({
    id: 'bob',
  });

  const webinaire = WebinaireFactory.create({
    id: 'webinaire-id',
    organizerId: alice.id,
  });

  beforeEach(() => {
    webinaireGateway = new InMemoryWebinaireRepository();
    webinaireGateway.create(webinaire.cloneInitial());

    mailer = new LoopbackMailer();
    useCase = new Cancel(webinaireGateway, mailer);
  });

  describe('Scenario: canceling a webinaire', () => {
    it('should delete the webinaire', async () => {
      await useCase.execute({
        user: alice,
        webinaireId: 'webinaire-id',
      });

      const updatedWebinaireOption = await webinaireGateway.getWebinaireById(
        'webinaire-id',
      );

      expect(updatedWebinaireOption.isNull()).toBe(true);
    });
  });

  describe('Scenario: canceling a webinaire that does not exist', () => {
    it('should fail', async () => {
      await expect(
        useCase.execute({
          user: alice,
          webinaireId: 'does-not-exist',
        }),
      ).rejects.toThrowError('Webinaire not found');
    });
  });

  describe('Scenario: canceling a webinaire the user does not own', () => {
    it('should fail', async () => {
      await expect(
        useCase.execute({
          user: bob,
          webinaireId: 'webinaire-id',
        }),
      ).rejects.toThrowError('Only the organizer can cancel the webinaire');
    });
  });
});
