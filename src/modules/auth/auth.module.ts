import { Module } from "@nestjs/common";
import { UsersModule } from "../users/users.module";
import { JwtModule } from "@nestjs/jwt";
import { AuthService } from "./application/auth.service";
import { AuthController } from "./api/auth.controller";
import { AuthQueryRepository } from "./infrastructure/auth.query.repository";
import { MailService } from "./application/mail.service";
import { UsersService } from "../users/application/users.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../users/domain/user.entity";

@Module({
    imports: [
        UsersModule,
        JwtModule.register({
            secret: process.env.JWT_SECRET || '123',
            signOptions: { expiresIn: '5m' }
        }),
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }])
    ],
    providers: [
        UsersService,
        AuthService,
        AuthQueryRepository,
        MailService],
    controllers: [AuthController]
})

export class AuthModule { }