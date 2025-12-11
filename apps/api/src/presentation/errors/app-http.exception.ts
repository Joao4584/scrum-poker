import { HttpException, HttpStatus } from '@nestjs/common';

export type AppErrorCode =
  | 'NOT_FOUND'
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  | 'CONFLICT'
  | 'BAD_REQUEST'
  | 'INTERNAL_ERROR';

export interface AppErrorBody {
  code: AppErrorCode | string;
  message: string;
}

/**
 * Standard HTTP exception wrapper that always returns a payload with
 * a machine-readable code and a human-friendly message.
 */
export class AppHttpException extends HttpException {
  constructor(code: AppErrorBody['code'], message: string, status: HttpStatus) {
    super({ code, message }, status);
  }
}

export const AppErrors = {
  notFound: (message = 'Recurso não encontrado') =>
    new AppHttpException('NOT_FOUND', message, HttpStatus.NOT_FOUND),
  unauthorized: (message = 'Não autorizado') =>
    new AppHttpException('UNAUTHORIZED', message, HttpStatus.UNAUTHORIZED),
  forbidden: (message = 'Acesso negado') =>
    new AppHttpException('FORBIDDEN', message, HttpStatus.FORBIDDEN),
  conflict: (message = 'Conflito ao processar a requisição') =>
    new AppHttpException('CONFLICT', message, HttpStatus.CONFLICT),
  badRequest: (message = 'Dados inválidos') =>
    new AppHttpException('BAD_REQUEST', message, HttpStatus.BAD_REQUEST),
  internal: (message = 'Erro interno do servidor') =>
    new AppHttpException('INTERNAL_ERROR', message, HttpStatus.INTERNAL_SERVER_ERROR),
};
