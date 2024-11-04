import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { catchError, tap, throwError } from 'rxjs';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  constructor(private logger: Logger) {}

  intercept(context: ExecutionContext, next: CallHandler): any {
    const request = context.switchToHttp().getRequest<Request>();
    this.logger.log(
      `Incoming request: ${request.method} ${request.url}`,
      'http',
    );
    const now = Date.now();
    return next.handle().pipe(
      catchError((error) => {
        const time = Date.now() - now;
        this.logger.log(
          `Request: ${
            context.switchToHttp().getRequest().originalUrl
          } - Execution time ${time}ms`,
          'http',
        );
        this.logger.error(error);
        return throwError(() => error);
      }),
      tap(() => {
        const time = Date.now() - now;
        this.logger.log(
          `Request: ${
            context.switchToHttp().getRequest().originalUrl
          } - Execution time ${time}ms`,
          'http',
        );
      }),
    );
  }
}
