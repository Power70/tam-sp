import type { ErrorRequestHandler } from 'express';
import { NotFoundError, ValidationError } from '../domain/errors';

type HttpError = Error & { status?: number; type?: string };

function getStatusCode(error: HttpError): number {
  if (error instanceof ValidationError) return 400;
  if (error instanceof NotFoundError) return 404;
  if (Number.isInteger(error.status)) return error.status as number;
  return error.type === 'entity.parse.failed' ? 400 : 500;
}

const errorHandler: ErrorRequestHandler = (error: HttpError, _req, res, next) => {
  if (res.headersSent) return next(error);
  const statusCode = getStatusCode(error);
  if (statusCode === 500) console.error(error);
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error.' : error.message,
  });
};

export default errorHandler;
