import { Request, Response, NextFunction } from 'express';
import * as userService from '@/services/user.service';
import success from '@/utils/response';
import { HTTP_STATUS } from '@/constants/http';

/**
 * Get all users with filters, search, sorting, and pagination
 */
export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { status, role, search, sort, page, limit } = req.query;

    const query = {
      status: status as any,
      role: role as any,
      search: search as string,
      sort: sort as any,
      page: page ? Number(page) : undefined,
      limit: limit ? Number(limit) : undefined,
    };

    const result = await userService.getAllUsers(query);

    return success(res, HTTP_STATUS.OK, result, 'Users fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Get user by ID (admin only)
 */
export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await userService.getUserById(id);

    if (!user) {
      return res
        .status(HTTP_STATUS.NOT_FOUND)
        .json({ success: false, message: 'User not found', data: null });
    }

    // Exclude sensitive data from response
    const { password, googleId, ...safeUser } = user.toObject();

    return success(res, HTTP_STATUS.OK, safeUser, 'User fetched successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Block (disable) a user
 */
export const blockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await userService.blockUser(id);
    return success(res, HTTP_STATUS.OK, user, 'User blocked successfully');
  } catch (error) {
    next(error);
  }
};

/**
 * Unblock (restore) a user
 */
export const unblockUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id as string;
    const user = await userService.unblockUser(id);
    return success(res, HTTP_STATUS.OK, user, 'User unblocked successfully');
  } catch (error) {
    next(error);
  }
};
