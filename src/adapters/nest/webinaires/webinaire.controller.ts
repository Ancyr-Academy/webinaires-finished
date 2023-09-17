import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Inject,
  Param,
  Post,
} from '@nestjs/common';

import { CancelReservation } from '../../../modules/webinaires/write/usecases/cancel-reservation/cancel-reservation';
import { CancelWebinaire } from '../../../modules/webinaires/write/usecases/cancel-webinaire/cancel-webinaire';
import { ChangeDates } from '../../../modules/webinaires/write/usecases/change-dates/change-dates';
import { ChangeSeats } from '../../../modules/webinaires/write/usecases/change-seats/change-seats';
import { Organize } from '../../../modules/webinaires/write/usecases/organize/organize';
import { ReserveSeat } from '../../../modules/webinaires/write/usecases/reserve-seat/reserve-seat';
import { User } from '../auth/user.decorator';
import { UserEntity } from '../../../modules/auth/core/user.entity';
import { WebinaireAPI } from '../../../modules/webinaires/write/contract/webinaire.api';
import { ZodValidationPipe } from '../app/zod-validation.pipe';
import { GetWebinaireByIdQuery } from './queries/get-webinaire-by-id.query';
import { GetWebinairesUserParticipatesInQuery } from './queries/get-webinaires-user-participates-in.query';
import { Public } from '../auth/auth.metadata';
import { I_GET_WEBINAIRE_BY_ID_QUERY } from '../../../modules/webinaires/read/queries/get-webinaire-by-id.query-interface';
import { I_GET_WEBINAIRES_USER_PARTICIPATES_IN_QUERY } from '../../../modules/webinaires/read/queries/get-webinaires-user-participates-in.query-interface';

@Controller('webinaires')
export class WebinaireController {
  constructor(
    private readonly cancelReservation: CancelReservation,
    private readonly cancelWebinaire: CancelWebinaire,
    private readonly changeDates: ChangeDates,
    private readonly changeSeats: ChangeSeats,
    private readonly organize: Organize,
    private readonly reserveSeat: ReserveSeat,

    @Inject(I_GET_WEBINAIRE_BY_ID_QUERY)
    private readonly getWebinaireById: GetWebinaireByIdQuery,
    @Inject(I_GET_WEBINAIRES_USER_PARTICIPATES_IN_QUERY)
    private readonly getWebinairesUserParticipatesIn: GetWebinairesUserParticipatesInQuery,
  ) {}

  @Delete('/:webinaireId/reservations')
  async cancelReservationHandler(
    @User() user: UserEntity,
    @Param('webinaireId') webinaireId: string,
  ): Promise<WebinaireAPI.CancelReservation.Response> {
    return this.cancelReservation.execute({
      webinaireId,
      user,
    });
  }

  @Delete('/:webinaireId')
  async cancelWebinaireHandler(
    @User() user: UserEntity,
    @Param('webinaireId') webinaireId: string,
  ): Promise<WebinaireAPI.CancelWebinaire.Response> {
    return this.cancelWebinaire.execute({
      webinaireId,
      user,
    });
  }

  @HttpCode(200)
  @Post('/:webinaireId/dates')
  async changeDatesHandler(
    @User() user: UserEntity,
    @Param('webinaireId') webinaireId: string,
    @Body(new ZodValidationPipe(WebinaireAPI.ChangeDates.schema))
    body: WebinaireAPI.ChangeDates.Request,
  ): Promise<WebinaireAPI.ChangeDates.Response> {
    return this.changeDates.execute({
      webinaireId,
      user,
      startAt: body.startAt,
      endAt: body.endAt,
    });
  }

  @HttpCode(200)
  @Post('/:webinaireId/seats')
  async changeSeatsHandler(
    @User() user: UserEntity,
    @Param('webinaireId') webinaireId: string,
    @Body(new ZodValidationPipe(WebinaireAPI.ChangeSeats.schema))
    body: WebinaireAPI.ChangeSeats.Request,
  ): Promise<WebinaireAPI.ChangeSeats.Response> {
    return this.changeSeats.execute({
      webinaireId,
      user,
      seats: body.seats,
    });
  }

  @Post('/')
  async organizeHandler(
    @User() user: UserEntity,
    @Body(new ZodValidationPipe(WebinaireAPI.Organize.schema))
    body: WebinaireAPI.Organize.Request,
  ): Promise<WebinaireAPI.Organize.Response> {
    return this.organize.execute({
      user,
      startAt: body.startAt,
      endAt: body.endAt,
      seats: body.seats,
    });
  }

  @Post('/:webinaireId/reservations')
  async reserveSeatHandler(
    @User() user: UserEntity,
    @Param('webinaireId') webinaireId: string,
  ): Promise<WebinaireAPI.ReserveSeat.Response> {
    return this.reserveSeat.execute({
      webinaireId,
      user,
    });
  }

  @Get('/participated')
  async getWebinairesUserParticipatesInHandler(
    @User() user: UserEntity,
  ): Promise<WebinaireAPI.FindWebinairesUserParticipatesIn.Response> {
    return this.getWebinairesUserParticipatesIn.execute(user.data.id);
  }

  // Put it last or it will get called before the one above
  @Public()
  @Get('/:webinaireId')
  async getWebinaireByIdHandler(
    @Param('webinaireId') webinaireId: string,
  ): Promise<WebinaireAPI.FindWebinaireById.Response> {
    return this.getWebinaireById.execute(webinaireId);
  }
}
