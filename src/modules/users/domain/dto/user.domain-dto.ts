export class CreateDomainUserDto {
    login: string
    email: string
    passwordSalt: string
    passwordHash: string
    isConfirmed: boolean
}