import { HTTP_STATUS } from "@/constants/http";
import { AppError } from "./AppError";
import { NextFunction } from "express";

export const handleControllerError = (error: unknown, next: NextFunction) => {
    const err = error as Error;
    if (err.name === 'ZodError') {
        next(new AppError(err.message, HTTP_STATUS.BAD_REQUEST));
        return;
    }
    next(error);
};