import { Injectable, PipeTransform } from '@nestjs/common';
import { z } from 'zod';
import { Validator } from '../../shared/validator';

@Injectable()
export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: z.Schema<any>) {}

  transform(payload: any) {
    const validator = new Validator(this.schema);
    validator.validate(payload);
    return payload;
  }
}
