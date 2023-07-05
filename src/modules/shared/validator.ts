import z from 'zod';

export class Validator<T> {
  constructor(private schema: z.Schema<any>) {}

  validate(payload: T): void {
    const result = this.schema.safeParse(payload);
    if (result.success === true) {
      return;
    }

    throw ValidationException.fromZod(result.error);
  }
}

export class ValidationException extends Error {
  static fromZod(zodError: z.ZodError) {
    return new ValidationException({
      errors: zodError.errors.map((error) => {
        return {
          message: error.message,
          path: error.path,
        };
      }),
    });
  }

  public errors: ValidationError[];
  constructor(data: ValidationExceptionPayload) {
    super('Validation errors');
    this.errors = data.errors;
  }
}

type ValidationExceptionPayload = {
  errors: ValidationError[];
};

type ValidationError = {
  message: string;
  path: (string | number)[];
};
