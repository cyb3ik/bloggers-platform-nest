import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/users.query.repository';
import { BcryptService } from './application/bcrypt.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    BcryptService
  ],
  controllers: [UsersController],
  exports: [
    UsersService,
    UsersRepository,
    BcryptService]
})
export class UsersModule { }
