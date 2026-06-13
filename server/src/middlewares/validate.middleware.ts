import mongoose from 'mongoose';
import { Request, Response, NextFunction } from 'express';
import { AppError } from '@/utils/AppError';
import { HTTP_STATUS } from '@/constants/http';
import { z } from 'zod';

export const validateObjectId = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName] as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return next(new AppError('Invalid ID format', HTTP_STATUS.BAD_REQUEST));
    }

    next();
  };
};

export const validateRequest = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateQuery = (schema: z.ZodTypeAny) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};
