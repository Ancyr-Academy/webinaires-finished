import { UserEntity } from '../../../auth/entity/user.entity';
import { DomainException } from '../../../shared/domain-exception';
import { AbstractExecutable } from '../../../shared/executable';
import { IWebinaireRepository } from '../../gateway/webinaire.repository';

type Request = {
  user: UserEntity;
  webinaireId: string;
};

type Response = void;

export class Cancel extends AbstractExecutable<Request, Response> {
  constructor(private readonly webinaireGateway: IWebinaireRepository) {
    super();
  }

  async handle({ user, webinaireId }: Request): Promise<Response> {
    const webinaireOption = await this.webinaireGateway.getWebinaireById(
      webinaireId,
    );

    const webinaire = webinaireOption.getOrThrow(
      new DomainException('WEBINAIRE_NOT_FOUND', 'Webinaire not found'),
    );

    if (webinaire.isOrganizer(user.id) === false) {
      throw new DomainException(
        'NOT_ORGANIZER',
        'Only the organizer can cancel the webinaire',
      );
    }

    await this.webinaireGateway.delete(webinaire);
    return;
  }
}
