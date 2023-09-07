import { UserEntity } from '../../../../auth/entity/user.entity';
import { IMailer } from '../../../../mailer/ports/mailer.interface';
import { DomainException } from '../../../../shared/domain-exception';
import { Executable } from '../../../../shared/executable';
import { IWebinaireRepository } from '../../ports/webinaire.repository';
import { IParticipationRepository } from '../../ports/participation.repository';
import { IUserRepository } from '../../../../auth/ports/auth.gateway';

type Request = {
  user: UserEntity;
  webinaireId: string;
};

type Response = void;

export class CancelWebinaire extends Executable<Request, Response> {
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly webinaireRepository: IWebinaireRepository,
    private readonly participationRepository: IParticipationRepository,
    private readonly mailer: IMailer,
  ) {
    super();
  }

  async execute({ user, webinaireId }: Request): Promise<Response> {
    const webinaireQuery = await this.webinaireRepository.getWebinaireById(
      webinaireId,
    );

    const webinaire = webinaireQuery.getOrThrow(
      new DomainException('WEBINAIRE_NOT_FOUND', 'Webinaire not found'),
    );

    if (webinaire.isOrganizer(user.id) === false) {
      throw new DomainException(
        'NOT_ORGANIZER',
        'Only the organizer can cancel the webinaire',
      );
    }

    await this.webinaireRepository.delete(webinaire);
    await this.notifyParticipants(webinaireId);
  }

  async notifyParticipants(webinaireId: string): Promise<void> {
    const participations =
      await this.participationRepository.findParticipations(webinaireId);

    const users = await this.userRepository.findByIds(
      participations.map((p) => p.data.userId),
    );

    await Promise.all(
      users.map(async (user) => {
        return this.mailer.sendMail({
          to: user.data.emailAddress,
          subject: 'Annulation du webinaire',
          body: 'Le webinaire a été annulé.',
        });
      }),
    );
  }
}
