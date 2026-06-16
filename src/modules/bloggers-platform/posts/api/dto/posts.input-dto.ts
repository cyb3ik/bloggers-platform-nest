export class CreatePostForBlogInputDto {
    title: string
    shortDescription: string
    content: string
}

export class CreatePostInputDto extends CreatePostForBlogInputDto {
    blogId: string
}

export class UpdatePostInputDto extends CreatePostInputDto { }