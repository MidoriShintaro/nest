import { ArrayNotEmpty, IsArray } from "class-validator";

export class DeleteDTO{
    @IsArray()
    @ArrayNotEmpty()
    readonly ids:string[];
}