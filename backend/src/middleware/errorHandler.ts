import type { ErrorRequestHandler } from 'express';

const errorHandler: ErrorRequestHandler = (error: Error & { statusCode?: number }, req, res, next) => {
  if (res.headersSent) return next(error);
  const statusCode = Number.isInteger(error.statusCode) ? error.statusCode ?? 500 : 500;
  if (statusCode === 500) console.error(error);
  res.status(statusCode).json({
    error: statusCode === 500 ? 'Internal server error.' : error.message
  });
};

export default errorHandler;
