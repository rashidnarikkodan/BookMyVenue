import logger from '@/libs/logger';
import { NextFunction, Request, Response } from 'express';
import { ZodSchema } from 'zod';
import mongoose from 'mongoose';
import { AppError } from '@/utils/AppError';

export const validateInputs = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req.body);
      req.body = validatedData;
      logger.info(`Inputs: ${JSON.stringify(req.body)}`);

      next();
    } catch (error) {
      next(error);
    }
  };
};

export const validateObjectId = (paramName: string) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const id = req.params[paramName] as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError('Invalid ID format', 400);
    }

    next();
  };
};

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};
