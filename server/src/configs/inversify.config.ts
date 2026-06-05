import { Container } from 'inversify';
import { TYPES } from '../constants/types';
import { IUserRepository } from '../repositories/interfaces/user.repository.interface';
import { UserRepository } from '../repositories/user.repository';
import { IAuthService } from '../services/interfaces/auth.service.interface';
import { AuthService } from '../services/auth.service';
import { AuthController } from '../controllers/auth.controller';

const container = new Container();

container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository);
container.bind<IAuthService>(TYPES.AuthService).to(AuthService);
container.bind<AuthController>(TYPES.AuthController).to(AuthController);

export { container };
