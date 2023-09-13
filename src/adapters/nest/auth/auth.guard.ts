import {
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IAuthenticator } from '../../../modules/auth/services/authenticator/authenticator.interface';
import { IS_PUBLIC_KEY } from './auth.metadata';
import { Request } from 'express';

export class AuthGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authenticator: IAuthenticator,
  ) {}

  async canActivate(context: ExecutionContext) {
    try {
      const request = context.switchToHttp().getRequest();
      const token = this.extractTokenFromHeader(request);
      const user = await this.authenticate(token);

      request.user = user;
      return true;
    } catch (e) {
      if (this.acceptsUnauthenticatedRequest(context)) {
        return true;
      }

      throw e;
    }
  }

  private acceptsUnauthenticatedRequest(context: ExecutionContext) {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    return isPublic;
  }

  private extractTokenFromHeader(request: Request) {
    const authorizationHeader = request.headers.authorization;
    if (!authorizationHeader) {
      throw new UnauthorizedException("Missing 'Authorization' header");
    }

    const [type, token] = authorizationHeader.split(' ');
    if (type !== 'Basic') {
      throw new UnauthorizedException("Invalid 'Authorization' header");
    }

    return token;
  }

  private async authenticate(token: string) {
    try {
      const authenticatedUser = await this.authenticator.authenticate(token);
      return authenticatedUser;
    } catch (e) {
      throw new UnauthorizedException('Failed to authenticate user');
    }
  }
}
