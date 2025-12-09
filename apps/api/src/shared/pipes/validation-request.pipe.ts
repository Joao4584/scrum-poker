/* eslint-disable @typescript-eslint/no-unsafe-function-type */
import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class ValidationRequestPipe implements PipeTransform<any> {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (value === null || value === undefined) {
      return value;
    }

    if (!metatype || !this.toValidate(metatype)) {
      if (
        typeof value === 'object' &&
        value !== null &&
        Object.keys(value).length === 0
      ) {
        return value;
      }
      return value;
    }

    const object = plainToInstance(metatype, value);
    const errors = await validate(object, { forbidUnknownValues: false });
    if (errors.length > 0) {
      const errorMessages = errors
        .map((error) => Object.values(error.constraints || {}))
        .flat();
      throw new BadRequestException(errorMessages);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
