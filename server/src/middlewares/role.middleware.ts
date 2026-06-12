import { HTTP_STATUS } from '@/constants/http';
import { AppError } from '@/utils/AppError';
import { NextFunction, Request, Response } from 'express';

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User not authenticated', HTTP_STATUS.UNAUTHORIZED));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Access denied. You do not have the required permissions.', HTTP_STATUS.FORBIDDEN));
    }

    next();
  };
};
