import { Body, Controller, Post } from '@nestjs/common';

import { CreateAccount } from '../../../modules/auth/usecases/create-account/create-account';
import { ZodValidationPipe } from '../app/zod-validation.pipe';
import { AuthAPI } from './auth.api';

@Controller('auth')
export class AuthController {
  constructor(private readonly createAccount: CreateAccount) {}

  @Post('create-account')
  async createAccountHandler(
    @Body(new ZodValidationPipe(AuthAPI.CreateAccount.schema))
    payload: AuthAPI.CreateAccount.Request,
  ): Promise<AuthAPI.CreateAccount.Response> {
    return this.createAccount.execute(payload);
  }
}
