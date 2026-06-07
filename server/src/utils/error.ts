import { AppError } from '@/utils/AppError';
import { NextFunction, Response, Request } from 'express';
import logger from '@/libs/logger';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  // 🔥 LOG REAL ERROR (THIS IS WHAT YOU ARE MISSING)
  logger.error({
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message,
    });
  }

  return res.status(500).json({
    success: false,
    message: 'Internal Server Error',
  });
};

export default errorHandler;
