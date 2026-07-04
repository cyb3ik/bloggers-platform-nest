import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query.repository';
import { BcryptService } from './application/bcrypt.service';
import { CqrsModule } from '@nestjs/cqrs';
import { FindUserByIdQueryHandler } from './application/use-cases/queries/find-user-by-id.query';
import { FindAllUsersQueryHandler } from './application/use-cases/queries/find-all-users.query';
import { CreateUserUseCase } from './application/use-cases/commands/create-user.usecase';
import { DeleteUserUseCase } from './application/use-cases/commands/delete-user.usecase';
import { LoginUserUseCase } from '../auth/application/use-cases/commands/login-user.usecase';
import { RegisterUserUseCase } from '../auth/application/use-cases/commands/register-user.usecase';
import { ConfirmUserEmailUseCase } from '../auth/application/use-cases/commands/confirm-user-email.usecase';
import { ResendConfirmationCodeUseCase } from '../auth/application/use-cases/commands/resend-confirmation-code.usecase';
import { ChangeUserPasswordUseCase } from '../auth/application/use-cases/commands/change-user-password.usecase';
import { RecoverUserPasswordUseCase } from '../auth/application/use-cases/commands/recover-user-password.usecase';
import { GetMePageQueryHandler } from '../auth/application/use-cases/queries/get-me-page.query';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { AuthQueryRepository } from '../auth/infrastructure/auth.query.repository';
import { MailService } from '../auth/application/mail.service';
import { AuthController } from '../auth/api/auth.controller';
import { AuthService } from '../auth/application/auth.service';
import { ACCESS_TOKEN_STRATEGY_INJECT_TOKEN, REFRESH_TOKEN_STRATEGY_INJECT_TOKEN } from '../../core/constants/jwt-tokens';

const queryHandlers = [
  FindUserByIdQueryHandler,
  FindAllUsersQueryHandler,
  GetMePageQueryHandler
]
const commandHandlers = [
  CreateUserUseCase,
  DeleteUserUseCase,
  LoginUserUseCase,
  RegisterUserUseCase,
  ConfirmUserEmailUseCase,
  ResendConfirmationCodeUseCase,
  ChangeUserPasswordUseCase,
  RecoverUserPasswordUseCase
]

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
    CqrsModule.forRoot()
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    BcryptService,
    AuthService,
    AuthQueryRepository,
    MailService,
    ...queryHandlers,
    ...commandHandlers,
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'access-token-secret',
          signOptions: { expiresIn: '5m' },
        })
      }
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (): JwtService => {
        return new JwtService({
          secret: 'refresh-token-secret',
          signOptions: { expiresIn: '24h' },
        })
      }
    }
  ],
  exports: [
    UsersService,
    UsersRepository,
    BcryptService]
})
export class UsersModule { }
