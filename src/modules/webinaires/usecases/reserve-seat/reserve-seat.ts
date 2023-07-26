import { UserEntity } from '../../../auth/entity/user.entity';
import { IMailer } from '../../../mailer/gateway/mailer.interface';
import { DomainException } from '../../../shared/domain-exception';
import { AbstractExecutable } from '../../../shared/executable';
import { IIDProvider } from '../../../system/id/id-provider';
import { WebinaireViewModel } from '../../entities/webinaire.viewmodel';
import { IWebinaireQuery } from '../../gateway/webinaire.query';
import { ParticipationEntity } from '../../entities/participation.entity';
import { IParticipationRepository } from '../../gateway/participation.repository';

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

  async handle({ user, webinaireId }: Request): Promise<Response> {
    const webinaireOption = await this.webinaireQuery.findById(webinaireId);
    const webinaire = webinaireOption.getOrThrow(
      new DomainException('NOT_FOUND', 'Webinaire not found'),
    );

    if (webinaire.isFull()) {
      throw new DomainException('WEBINAIRE_FULL', 'Webinaire is full');
    }

    const existingParticipation = await this.participationRepository.find(
      webinaireId,
      user.id,
    );

    if (existingParticipation.isNull() === false) {
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
