import { Container } from 'inversify';
import { TYPES } from '../constants/types';

// Interfaces
import { IUserRepository } from '../repositories/interfaces/user.repository.interface';
import { IAuthService }     from '../services/interfaces/auth.service.interface';
import { IEmailService }    from '../services/interfaces/email.service.interface';
import { IOtpService }      from '../services/interfaces/otp.service.interface';
import { IRedisService }    from '../services/interfaces/redis.service.interface';

// Implementations
import { UserRepository } from '../repositories/user.repository';
import { AuthService }    from '../services/auth.service';
import { EmailService }   from '../services/email.service';
import { OtpService }     from '../services/otp.service';
import { RedisService }   from '../services/redis.service';

// Controllers
import { AuthController } from '../controllers/auth.controller';

const container = new Container();

// Repositories
container.bind<IUserRepository>(TYPES.UserRepository).to(UserRepository).inSingletonScope();

// Infrastructure services (singleton — shared Redis connection)
container.bind<IRedisService>(TYPES.RedisService).to(RedisService).inSingletonScope();
container.bind<IEmailService>(TYPES.EmailService).to(EmailService).inSingletonScope();

// Domain services
container.bind<IOtpService>(TYPES.OtpService).to(OtpService).inSingletonScope();
container.bind<IAuthService>(TYPES.AuthService).to(AuthService).inSingletonScope();

// Controllers
container.bind<AuthController>(TYPES.AuthController).to(AuthController).inSingletonScope();

export { container };
