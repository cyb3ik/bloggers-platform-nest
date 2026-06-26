import { Body, Controller, Get, HttpCode, HttpStatus, Post, UseGuards } from "@nestjs/common";
import { LoginInputDto } from "./dto/login.input-dto";
import { CreateUserInputDto } from "../../users/api/dto/users.input-dto";
import { ConfirmationCode } from "./dto/confirmation-code.dto";
import { EmailInput } from "./dto/email.input-dto";
import { NewPasswordInput } from "./dto/new-password.input-dto";
import { AuthService } from "../application/auth.service";
import { AccessTokenAuthGuard } from "../../../core/guards/access-token.auth.guard";
import { ExtractUserFromRequest } from "../../../core/decorators/extract-user.decorator";

@Controller('auth')
export class AuthController {
    constructor(
        private readonly AuthService: AuthService
    ) { }

    @HttpCode(HttpStatus.OK)
    @Post('login')
    async authUser(@Body() dto: LoginInputDto) {
        return this.AuthService.checkCredentials(dto.loginOrEmail, dto.password)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration')
    async registerUser(@Body() dto: CreateUserInputDto) {
        return this.AuthService.registerUser(dto)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration-confirmation')
    async confirmUserRegistration(@Body() dto: ConfirmationCode) {
        return this.AuthService.confirmUserEmail(dto.code)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('registration-email-resending')
    async resendConfirmationCode(@Body() dto: EmailInput) {
        return this.AuthService.resendConfirmationCode(dto.email)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('password-recovery')
    async recoverUserPassword(@Body() dto: EmailInput) {
        return this.AuthService.recoverUserPassword(dto.email)
    }

    @HttpCode(HttpStatus.NO_CONTENT)
    @Post('new-password')
    async changeUserPassword(@Body() dto: NewPasswordInput) {
        return this.AuthService.changeUserPassword(dto)
    }

    @HttpCode(HttpStatus.OK)
    @UseGuards(AccessTokenAuthGuard)
    @Get('me')
    async getMePage(@ExtractUserFromRequest() user: { id: string }) {
        return this.AuthService.getMePage(user.id)
    }
}