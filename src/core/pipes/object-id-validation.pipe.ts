import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from "@nestjs/common";
import { isValidObjectId, Types } from "mongoose";

@Injectable()
export class ObjectIdValidationPipe implements PipeTransform {
    transform(value: string, metadata: ArgumentMetadata) {
        if (metadata.metatype === Types.ObjectId) {
            if (!isValidObjectId(value)) {
                throw new BadRequestException([
                    {
                        message: 'Invalid ObjectId',
                        field: metadata.data ?? 'id',
                    },
                ])
            }
            return value
        }
        return value
    }
}