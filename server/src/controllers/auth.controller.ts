import { Request, Response, NextFunction } from 'express';
import { injectable, inject } from 'inversify';
import { IAuthService } from '../services/interfaces/auth.service.interface';
import { TYPES } from '../constants/types';
import { signupSchema } from '../utils/validations';
import success from '../utils/response';
import { AppError } from '../utils/AppError';

@injectable()
export class AuthController {
    constructor(
        @inject(TYPES.AuthService) private authService: IAuthService
    ) { }

  signup = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      // Validate request body
      const validatedData = signupSchema.parse(req.body);

      const result = await this.authService.signup(validatedData);
      
      success(res, 201, 'User registered successfully', result);
    } catch (error: any) {
      if (error.name === 'ZodError') {
        next(new AppError(error.errors[0].message, 400));
        return;
      }
      next(error);
    }
  };
}
