import { Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { ValidationError, validateSync } from 'class-validator';
import { plainToClass } from 'class-transformer';

@Injectable()
export class ValidationRequestPipe implements PipeTransform {
  transform(value: any, { metatype }: any) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);

    const errors: ValidationError[] = validateSync(object);

    if (errors.length > 0) {
      const messageErrors = errors.reduce((acc, err) => {
        const messages = Object.values(err.constraints || {});
        if (messages.length > 0 && !acc[err.property]) {
          acc[err.property] = messages[0];
        }
        return acc;
      }, {});

      throw new BadRequestException({
        message: messageErrors,
        error: 'Bad Request',
        statusCode: 422,
      });
    }

    return value;
  }

  private toValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
