import { IsEnum, IsNotEmpty, IsString } from "class-validator";
import { LikeStatus } from "./create-domain-like.dto";
import { Trim } from "../../../../core/decorators/trim.decorator";

export class ChangeLikeStatusInputDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @IsEnum(LikeStatus)
    likeStatus: LikeStatus
}