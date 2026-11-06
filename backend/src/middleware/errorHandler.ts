import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (
  error: Error & { statusCode?: number; status?: number; type?: string },
  req,
  res,
  next
) => {
  if (res.headersSent) return next(error);
  const statusCode = Number.isInteger(error.statusCode)
    ? error.statusCode ?? 500
    : Number.isInteger(error.status)
      ? error.status ?? 500
      : error.type === 'entity.parse.failed' ? 400 : 500;
  if (statusCode === 500) console.error(error);
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error.' : error.message
  });
};

export default errorHandler;
