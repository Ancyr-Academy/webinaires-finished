import { UserEntity } from '../../../../auth/core/user.entity';
import { IUserRepository } from '../../../../auth/ports/user-repository';
import { IMailer } from '../../../../mailer/ports/mailer.interface';
import { DomainException } from '../../../../shared/domain-exception';
import { Executable } from '../../../../shared/executable';
import { IIDProvider } from '../../../../system/id/id-provider';
import { ParticipationEntity } from '../../model/participation.entity';
import { WebinaireEntity } from '../../model/webinaire.entity';
import { IParticipationRepository } from '../../ports/participation.repository';
import { IWebinaireRepository } from '../../ports/webinaire.repository';

type Request = {
  user: UserEntity;
  webinaireId: string;
};

type Response = void;

export class ReserveSeat extends Executable<Request, Response> {
  constructor(
    private readonly idProvider: IIDProvider,
    private readonly userRepository: IUserRepository,
    private readonly webinaireRepository: IWebinaireRepository,
    private readonly participationRepository: IParticipationRepository,
    private readonly mailer: IMailer,
  ) {
    super();
  }

  async execute({ user, webinaireId }: Request): Promise<Response> {
    const webinaireQuery = await this.webinaireRepository.findById(webinaireId);

    const webinaire = webinaireQuery.getOrThrow(
      new DomainException('NOT_FOUND', 'Webinaire not found'),
    );

    const participationsCount =
      await this.participationRepository.findParticipationCount(webinaireId);

    if (participationsCount >= webinaire.data.seats) {
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

  private async notifyOrganizer(webinaire: WebinaireEntity) {
    const organizerQuery = await this.userRepository.findById(
      webinaire.data.organizerId,
    );

    const organizer = organizerQuery.getOrThrow();

    await this.mailer.sendMail({
      to: organizer.data.emailAddress,
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
