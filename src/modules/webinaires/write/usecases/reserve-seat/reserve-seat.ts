import { UserEntity } from '../../../../auth/entity/user.entity';
import { IMailer } from '../../../../mailer/ports/mailer.interface';
import { DomainException } from '../../../../shared/domain-exception';
import { AbstractExecutable } from '../../../../shared/executable';
import { IIDProvider } from '../../../../system/id/id-provider';
import { WebinaireViewModel } from '../../../read/model/webinaire.viewmodel';
import { IWebinaireQuery } from '../../../read/ports/webinaire.query';
import { ParticipationEntity } from '../../model/participation.entity';
import { IParticipationRepository } from '../../ports/participation.repository';

type Request = {
  user: UserEntity;
  webinaireId: string;
};

type Response = void;

export class ReserveSeat extends AbstractExecutable<Request, Response> {
  constructor(
    private readonly idProvider: IIDProvider,
    private readonly webinaireQuery: IWebinaireQuery,
    private readonly participationRepository: IParticipationRepository,
    private readonly mailer: IMailer,
  ) {
    super();
  }

  async run({ user, webinaireId }: Request): Promise<Response> {
    const webinaireQuery = await this.webinaireQuery.findById(webinaireId);
    const webinaire = webinaireQuery.getOrThrow(
      new DomainException('NOT_FOUND', 'Webinaire not found'),
    );

    if (webinaire.isFull()) {
      throw new DomainException('WEBINAIRE_FULL', 'Webinaire is full');
    }

    const participationQuery = await this.participationRepository.find(
      webinaireId,
      user.id,
    );

    if (participationQuery.isNull() === false) {
      throw new DomainException(
        'ALREADY_RESERVED',
        'You already participate in this webinaire',
      );
    }

    const participation = new ParticipationEntity({
      id: this.idProvider.getId(),
      userId: user.id,
      webinaireId,
    });

    await this.participationRepository.create(participation);

    await this.notifyOrganizer(webinaire);
    await this.notifyParticipant(user);
  }

  private async notifyOrganizer(webinaire: WebinaireViewModel) {
    await this.mailer.sendMail({
      to: webinaire.data.organizer.emailAddress,
      subject: 'Nouvelle participation à votre webinaire',
      body: 'Une nouvelle personne participe à votre webinaire.',
    });
  }

  private async notifyParticipant(user: UserEntity) {
    await this.mailer.sendMail({
      to: user.data.emailAddress,
      subject: 'Votre participation',
      body: 'Votre participation au webinaire a bien été pris en compte.',
    });
  }
}
