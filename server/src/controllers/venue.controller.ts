import * as venueService from "@/services/venue.service";
import { Request, Response, NextFunction } from "express";
import { HTTP_STATUS } from "@/constants/http";
import { AppError } from "@/utils/AppError";
import { MESSAGES } from "@/constants/messages";
import success from "@/utils/response";

// POST /owner/venues
export const createVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const ownerId = req?.user.id;
    const ownerId = "6a274f14c7615f07e8893bf9";
    if (!ownerId)
      throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const data = req.body;
    const venue = await venueService.createVenue(ownerId, data);

    return success(res, HTTP_STATUS.CREATED, venue, MESSAGES.VENUE_CREATED);
  } catch (error) {
    next(error);
  }
};

// GET /owner/venues
export const getOwnerVenues = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const ownerId = req?.user.id;
    const ownerId = "6a274f14c7615f07e8893bf9";
    if (!ownerId)
      throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const result = await venueService.getOwnerVenues(ownerId, req.query as any);

    return success(res, HTTP_STATUS.OK, result, MESSAGES.VENUES_FETCHED);
  } catch (error) {
    next(error);
  }
};

// GET /owner/venues/:id
export const getVenueById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const {id} = req.params;
    // const ownerId = req?.user.id;
    const ownerId = "6a274f14c7615f07e8893bf9";
    if (!ownerId)
      throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const venue = await venueService.getVenueById(ownerId, id as string);

    return success(res, HTTP_STATUS.OK, venue, MESSAGES.VENUES_FETCHED);
  } catch (error) {
    next(error);
  }
};

// PATCH /owner/venues/:id
export const updateVenue = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // const ownerId = req?.user.id;
    const {venueId}  = req.params
    const ownerId = "6a274f14c7615f07e8893bf9";
    if (!ownerId)
      throw new AppError(MESSAGES.UNAUTHORIZED, HTTP_STATUS.UNAUTHORIZED);

    const venue = await venueService.updateVenue(
      ownerId,
      venueId as string,
      req.body
    );

    return success(res, HTTP_STATUS.OK, venue, MESSAGES.VENUE_UPDATED);
  } catch (error) {
    next(error);
  }
};