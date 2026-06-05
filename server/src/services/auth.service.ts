import { injectable, inject } from 'inversify';
import { IAuthService } from './interfaces/auth.service.interface';
import { IUserRepository } from '../repositories/interfaces/user.repository.interface';
import { TYPES } from '../constants/types';
import { IUser } from '../models/user.model';
import argon2 from 'argon2';
import jwt from 'jsonwebtoken';
import env from '../configs/env.config';
import { AppError } from '../utils/AppError';

@injectable()
export class AuthService implements IAuthService {
  constructor(
    @inject(TYPES.UserRepository) private userRepository: IUserRepository
  ) {}

  async signup(userData: Partial<IUser>): Promise<{ user: Partial<IUser>; token: string }> {
    const existingUser = await this.userRepository.findByEmail(userData.email!);
    if (existingUser) {
      throw new AppError('User already exists', 409);
    }

    const hashedPassword = await argon2.hash(userData.password!);
    const user = await this.userRepository.create({
      ...userData,
      password: hashedPassword,
    });

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      env.JWT_ACCESS_SECRET || 'fallback-secret', // Replace with proper secret from env
      { expiresIn: '7d' }
    );

    const userObj = user.toObject();
    delete userObj.password;

    return { user: userObj, token };
  }
}
