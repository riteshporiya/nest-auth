import logger from '../logger';

export const logAround = (options?: {
  ignoreArgs?: boolean;
  ignoreReturn?: boolean;
}) => {
  return function (
    target: any,
    propertyKey: string,
    descriptor: PropertyDescriptor,
  ) {
    const targetMethod = descriptor.value;

    if (descriptor.value.constructor.name === 'AsyncFunction') {
      descriptor.value = async function (...args: any) {
        const now: number = Date.now();
        try {
          if (options?.ignoreArgs) {
            logger.log(
              `class: ${this?.constructor?.name} method: ${propertyKey} is called`,
            );
          } else {
            logger.log(
              `class: ${
                this?.constructor?.name
              } method: ${propertyKey} is called with args: ${JSON.stringify(
                args,
              )}`,
            );
          }
        } catch (_) {}
        const value = await targetMethod.apply(this, args);
        try {
          const time: number = Date.now() - now;
          if (options?.ignoreReturn || !value) {
            logger.log(
              `class: ${this?.constructor?.name} method: ${propertyKey} returned ::::: Execution time - ${time}ms`,
            );
          } else {
            logger.log(
              `class: ${
                this?.constructor?.name
              } method: ${propertyKey} returned value: ${JSON.stringify(
                value,
              )} ::::: Execution time - ${time}ms`,
            );
          }
        } catch (_) {}
        return value;
      };

      return descriptor;
    } else {
      descriptor.value = function (...args: any) {
        const now: number = Date.now();
        try {
          if (options?.ignoreArgs) {
            logger.log(
              `class: ${this?.constructor?.name} method: ${propertyKey} is called`,
            );
          } else {
            logger.log(
              `class: ${
                this?.constructor?.name
              } method: ${propertyKey} is called with args: ${JSON.stringify(
                args,
              )}`,
            );
          }
        } catch (_) {}
        const value = targetMethod.apply(this, args);
        try {
          const time: number = Date.now() - now;
          if (options?.ignoreReturn || !value) {
            logger.log(
              `class: ${this?.constructor?.name} method: ${propertyKey} returned ::::: Execution time - ${time}ms`,
            );
          } else {
            logger.log(
              `class: ${
                this?.constructor?.name
              } method: ${propertyKey} returned value: ${JSON.stringify(
                value,
              )} ::::: Execution time - ${time}ms`,
            );
          }
        } catch (_) {}
        return value;
      };

      return descriptor;
    }
  };
};
