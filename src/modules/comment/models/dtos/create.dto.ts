import { Type } from "class-transformer";
import { IsNotEmpty, IsString } from "class-validator";

export class CreateDto {
    @IsNotEmpty()
    @Type(() => Number)
    postId: number;

    @IsNotEmpty()
    @IsString()
    content: string;
}
