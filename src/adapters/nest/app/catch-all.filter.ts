import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { DomainException } from '../../../modules/shared/domain-exception';
import { ValidationException } from '../../../modules/shared/validator';

@Catch()
export class CatchAllFilter implements ExceptionFilter {
  catch(exception: any, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();

    if (exception instanceof DomainException) {
      response.status(400).json({
        statusCode: 400,
        message: exception.message,
        payload: null,
        code: exception.code,
      });
    } else if (exception instanceof ValidationException) {
      response.status(400).json({
        statusCode: 400,
        message: exception.message,
        payload: exception.errors,
        code: null,
      });
    } else if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json({
        statusCode: exception.getStatus(),
        message: exception.message,
        payload: null,
        code: null,
      });
    } else {
      response.status(500).json({
        statusCode: 500,
        message: 'Internal server error',
        payload: null,
        code: null,
      });
    }
  }
}
