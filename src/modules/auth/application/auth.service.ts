import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UsersRepository } from "../../users/infrastructure/users.repository";
import { BcryptService } from "../../users/application/bcrypt.service";
import { JwtService } from "@nestjs/jwt";
import { AuthQueryRepository } from "../infrastructure/auth.query.repository";
import { MailService } from "./mail.service";
import { UsersService } from "../../users/application/users.service";
import { randomUUID } from "crypto";
import { NewPasswordInput } from "../api/dto/new-password.input-dto";
import { LoginInputDto } from "../api/dto/login.input-dto";
import { UserDocument } from "../../users/domain/user.entity";

export enum CodeType {
    emailConfirmation = "emailConfimation",
    recovery = "recovery"
}

@Injectable()
export class AuthService {
    constructor(
        private readonly UsersRepository: UsersRepository,
        private readonly CryptoService: BcryptService,
        private readonly MailService: MailService
    ) { }

    async checkCredentials(dto: LoginInputDto) {
        const userByLogin = await this.UsersRepository.findUserByLogin(dto.loginOrEmail)

        const userByEmail = await this.UsersRepository.findUserByEmail(dto.loginOrEmail)

        if (!userByLogin && !userByEmail) {
            throw new UnauthorizedException()
        }

        const user = userByEmail || userByLogin

        if (user.passwordHash !== await this.CryptoService.generateHash(dto.password, user.passwordSalt)) {
            throw new UnauthorizedException()
        }

        return user
    }

    async sendCodeViaEmail(user: UserDocument, options: { codeType: CodeType }) {
        const code = randomUUID().toString()

        switch (options.codeType) {
            case (CodeType.emailConfirmation):
                user.setEmailConfirmationCode(code)
                await this.MailService.sendEmail(user.email, code)
                break
            case (CodeType.recovery):
                user.setPasswordRecoveryCode(code)
                await this.MailService.sendRecoveryCode(user.email, code)
                break
        }

        await this.UsersRepository.save(user)

        return code
    }

    async checkIfCodeIsValid(user: UserDocument, code: string, options: { codeType: CodeType }) {
        switch (options.codeType) {
            case (CodeType.emailConfirmation):
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

                break

            case (CodeType.recovery):
                if (code !== user.passwordRecovery.recoveryCode) {
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

                break
        }

        await this.UsersRepository.save(user)
    }

}