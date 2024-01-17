import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    const httpStatus =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;
    let res = {
      message: 'Internal server error',
      error: 'Internal server error',
    };
    if (exception instanceof HttpException) {
      res = exception.getResponse() as any;
    }

    const responseBody = {
      status_code: httpStatus,
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
      message: res.message,
      error: res.error,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
  }
}
