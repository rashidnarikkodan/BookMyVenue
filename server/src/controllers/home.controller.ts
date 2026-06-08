import { Request, Response, NextFunction } from "express";
import homeService from '@/services/home.service';
import success from "@/utils/response";
import { HTTP_STATUS } from "@/constants/http";

export const getEliteVenues = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const venues = await homeService.getEliteVenues();

        return success(
            res,
            HTTP_STATUS.OK,
            venues,
            'Elite Venues fetched successfully'
        )
    } catch (error) {
        next(error)
    }
}