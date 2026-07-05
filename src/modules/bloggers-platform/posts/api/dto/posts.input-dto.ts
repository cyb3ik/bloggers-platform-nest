import { IsMongoId, IsNotEmpty, IsString, Length } from "class-validator"
import { Trim } from "../../../../../core/decorators/trim.decorator"

export class CreatePostForBlogInputDto {
    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(0, 30)
    title: string

    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(0, 100)
    shortDescription: string

    @IsString()
    @Trim()
    @IsNotEmpty()
    @Length(0, 1000)
    content: string
}

export class CreatePostInputDto extends CreatePostForBlogInputDto {
    @IsString()
    @IsNotEmpty()
    @IsMongoId()
    blogId: string
}

export class UpdatePostInputDto extends CreatePostInputDto { }