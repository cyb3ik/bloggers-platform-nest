export class CreateBlogInputDto {
    name: string
    description: string
    websiteUrl: string
}

export class UpdateBlogInputDto extends CreateBlogInputDto { }
