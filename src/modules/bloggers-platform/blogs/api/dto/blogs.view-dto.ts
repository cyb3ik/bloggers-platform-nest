import { BlogDocument } from '../../domain/blog.entity';

export class BlogViewDto {
    id: string
    name: string
    description: string
    websiteUrl: string
    isMembership: boolean
    createdAt: Date

    constructor(blog: BlogDocument) {
        this.id = blog._id.toString()
        this.name = blog.name
        this.description = blog.description
        this.websiteUrl = blog.websiteUrl
        this.isMembership = blog.isMembership
        this.createdAt = blog.createdAt
    }
}