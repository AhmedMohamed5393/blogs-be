import { Type } from "class-transformer";
import { IsOptional, IsString } from "class-validator";

export class UpdateDto {
    @IsOptional()
    @Type(() => Number)
    postId: number;

    @IsOptional()
    @IsString()
    content: string;
}
