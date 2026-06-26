import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "../../users/infrastructure/users.repository";
import { BcryptService } from "../../users/application/bcrypt.service";
import { JwtService } from "@nestjs/jwt";
import { AuthQueryRepository } from "../infrastructure/auth.query.repository";
import { MailService } from "./mail.service";
import { CreateUserInputDto } from "../../users/api/dto/users.input-dto";
import { UsersService } from "../../users/application/users.service";
import { randomUUID } from "crypto";
import { NewPasswordInput } from "../api/dto/new-password.input-dto";

@Injectable()
export class AuthService {
    constructor(
        private readonly UsersService: UsersService,
        private readonly UsersRepository: UsersRepository,
        private readonly AuthQueryRepository: AuthQueryRepository,
        private readonly CryptoService: BcryptService,
        private readonly JwtService: JwtService,
        private readonly MailService: MailService
    ) { }

    async checkCredentials(loginOrEmail: string, password: string) {
        const userByLogin = await this.UsersRepository.findUserByLogin(loginOrEmail)

        const userByEmail = await this.UsersRepository.findUserByEmail(loginOrEmail)

        if (!userByLogin && !userByEmail) {
            throw new UnauthorizedException()
        }

        const user = userByEmail || userByLogin

        if (user.passwordHash !== await this.CryptoService.generateHash(password, user.passwordSalt)) {
            throw new UnauthorizedException()
        }

        const accessToken = await this.JwtService.sign({ id: user._id.toString() })

        return { accessToken: accessToken }
    }

    async registerUser(dto: CreateUserInputDto) {
        const userId = await this.UsersService.createUser(dto)

        const user = await this.UsersRepository.findUserByIdOrFail(userId)

        const emailConfirmationCode = randomUUID().toString()

        user.setEmailConfirmationCode(emailConfirmationCode)

        await this.UsersRepository.save(user)

        await this.MailService.sendEmail(user.email, emailConfirmationCode)
    }

    async confirmUserEmail(code: string): Promise<void> {
        const user = await this.UsersRepository.findUserByConfirmationCodeOrFail(code)

        if (!user) {
            throw new NotFoundException('User not found')
        }

        if (code !== user.emailConfirmation.confirmationCode) {
            throw new BadRequestException(
                [{
                    message: 'Code is wrong',
                    field: 'code',
                }]
            )
        }

        if (user.emailConfirmation.expirationDate < new Date()) {
            throw new BadRequestException(
                [{
                    message: 'Code has expired',
                    field: 'code',
                }]
            )
        }

        if (user.emailConfirmation.isConfirmed) {
            throw new BadRequestException(
                [{
                    message: 'Email already confirmed',
                    field: 'code',
                }]
            )
        }

        user.setEmailConfirmationStatus(true)

        await this.UsersRepository.save(user)
    }

    async resendConfirmationCode(email: string): Promise<void> {
        const user = await this.UsersRepository.findUserByEmail(email)

        if (!user || user.emailConfirmation.isConfirmed) {
            throw new BadRequestException(
                [{
                    message: 'Email already confirmed',
                    field: 'email',
                }]
            )
        }

        const emailConfirmationCode = randomUUID().toString()

        user.setEmailConfirmationCode(emailConfirmationCode)

        await this.UsersRepository.save(user)

        await this.MailService.sendEmail(user.email, emailConfirmationCode)

    }

    async recoverUserPassword(email: string) {
        const user = await this.UsersRepository.findUserByEmailOrLogin(email, '')

        if (!user) {
            throw new NotFoundException('User not found')
        }

        if (user.passwordRecovery) {
            throw new BadRequestException(
                [{
                    message: 'User with this email is recovering password already',
                    field: 'email',
                }]
            )
        }

        const recoveryCode = randomUUID().toString()

        user.setPasswordRecoveryCode(recoveryCode)

        await this.UsersRepository.save(user)

        await this.MailService.sendRecoveryCode(email, recoveryCode)

    }

    async changeUserPassword(dto: NewPasswordInput) {
        const user = await this.UsersRepository.findUserByRecoveryCodeOrFail(dto.recoveryCode)

        if (!user) {
            throw new NotFoundException('User not found')
        }

        if (dto.recoveryCode !== user.passwordRecovery.recoveryCode) {
            throw new BadRequestException(
                {
                    message: 'Code is wrong',
                    field: 'code',
                }
            )
        }

        if (user.passwordRecovery.expirationDate < new Date()) {
            throw new BadRequestException({
                message: 'Code has expired',
                field: 'code',
            })
        }

        await this.UsersService.updateUserPassword(user._id, dto.newPassword)
    }

    async getMePage(id: string) {
        return this.AuthQueryRepository.getMePage(id)
    }

}