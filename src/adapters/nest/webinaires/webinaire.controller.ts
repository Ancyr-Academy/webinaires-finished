import { Body, Controller, Delete, Param, Post } from '@nestjs/common';

import { CancelReservation } from '../../../modules/webinaires/usecases/cancel-reservation/cancel-reservation';
import { CancelWebinaire } from '../../../modules/webinaires/usecases/cancel-webinaire/cancel-webinaire';
import { ChangeDates } from '../../../modules/webinaires/usecases/change-dates/change-dates';
import { ChangeSeats } from '../../../modules/webinaires/usecases/change-seats/change-seats';
import { Organize } from '../../../modules/webinaires/usecases/organize/organize';
import { ReserveSeat } from '../../../modules/webinaires/usecases/reserve-seat/reserve-seat';
import { User } from '../auth/user.decorator';
import { UserEntity } from '../../../modules/auth/entity/user.entity';
import { WebinaireAPI } from '../../../modules/webinaires/public/webinaire.api';
import { ZodValidationPipe } from '../app/zod-validation.pipe';

@Controller('webinaires')
export class WebinaireController {
  constructor(
    private readonly cancelReservation: CancelReservation,
    private readonly cancelWebinaire: CancelWebinaire,
    private readonly changeDates: ChangeDates,
    private readonly changeSeats: ChangeSeats,
    private readonly organize: Organize,
    private readonly reserveSeat: ReserveSeat,
  ) {}

  @Delete('/:webinaireId/reservation')
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
}
