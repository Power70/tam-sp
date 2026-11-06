import type { ErrorRequestHandler } from 'express';

type HttpError = Error & { statusCode?: number; status?: number; type?: string };

function getStatusCode(error: HttpError): number {
  if (Number.isInteger(error.statusCode)) return error.statusCode as number;
  if (Number.isInteger(error.status)) return error.status as number;
  return error.type === 'entity.parse.failed' ? 400 : 500;
}

const errorHandler: ErrorRequestHandler = (
  error: HttpError,
  req,
  res,
  next
) => {
  if (res.headersSent) return next(error);
  const statusCode = getStatusCode(error);
  if (statusCode === 500) console.error(error);
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error.' : error.message
  });
};

export default errorHandler;
