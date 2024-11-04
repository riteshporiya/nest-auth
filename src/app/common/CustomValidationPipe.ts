import { ArgumentMetadata, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { ErrorCode } from '../exceptions/error-codes';
import { CustomExceptionFactory } from '../exceptions/custom-exception.factory';

export class CustomValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    value = this.trim(value);
    const object = plainToClass(metatype, value);
    const errors = await validate(object, { whitelist: true });
    if (errors.length > 0) {
      throw CustomExceptionFactory.create(ErrorCode.VALIDATION_ERROR);
    }
    return object;
  }

  private trim(value: any) {
    if (value && typeof value === 'string') {
      return value.trim();
    }
    if (value && typeof value === 'object') {
      if (Array.isArray(value)) {
        return value.map((v) => this.trim(v));
      }
      return Object.keys(value).reduce((acc, key) => {
        acc[key] = this.trim(value[key]);
        return acc;
      }, {});
    }
    return value;
  }

  private toValidate(metatype: new (...args: any[]) => any): boolean {
    const types: (new (...args: any[]) => any)[] = [
      String,
      Boolean,
      Number,
      Array,
      Object,
    ];
    return !types.includes(metatype);
  }
}
