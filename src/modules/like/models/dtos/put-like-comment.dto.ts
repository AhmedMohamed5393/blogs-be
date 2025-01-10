import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class PutLikeOnCommentDto {
    @IsNotEmpty()
    @Type(() => Number)
    commentId: number;
}
