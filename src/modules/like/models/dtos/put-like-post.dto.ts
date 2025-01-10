import { Type } from "class-transformer";
import { IsNotEmpty } from "class-validator";

export class PutLikeOnPostDto {
    @IsNotEmpty()
    @Type(() => Number)
    postId: number;
}
