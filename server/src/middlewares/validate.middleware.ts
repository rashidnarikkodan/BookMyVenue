import logger from "@/libs/logger";
import { NextFunction, Request, Response } from "express";
import { ZodError, ZodSchema } from "zod";

export const validateInputs = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        
        try {
            const validatedData = schema.parse(req.body);
            req.body = validatedData;
            logger.info(`Inputs: ${JSON.stringify(req.body)}`);

            next();
        } catch (error) {
            if (error instanceof ZodError) {
                res.status(400).json({
                    success: false,
                    message: "Validation failed",
                    errors: error.flatten(),
                });
                return;
            }

            next(error);
        }
    };
};