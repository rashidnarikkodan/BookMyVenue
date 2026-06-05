import { AppError } from '@/utils/AppError';
import { NextFunction, Response, Request } from 'express';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
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
