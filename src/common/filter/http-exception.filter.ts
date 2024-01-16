import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let res = exception.getResponse() as any;
    if (typeof res === 'string') {
      res = {
        message: res,
        error: res,
      };
    }

    response.status(status).json({
      status_code: status,
      path: request.url,
      message: res.message,
      error: res.error,
    });
  }
}
