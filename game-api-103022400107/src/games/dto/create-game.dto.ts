import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class CreateGameDto {
  @IsString() @IsNotEmpty() title: string;
  @IsString() @IsNotEmpty() codeName: string;
  @IsString() @IsNotEmpty() description: string;
  @IsString() @IsNotEmpty() genre: string;

  @IsNumber() @Min(0) @Max(5) rating: number;
  @IsInt() @Min(1970) @Max(2035) releaseYear: number;

  @IsOptional() @IsNumber() @Min(0) price?: number;

  @IsArray() @ArrayNotEmpty() @IsString({ each: true }) platforms: string[];

  @IsString() @IsNotEmpty() badge: string;
  @IsString() @IsNotEmpty() image: string;
  @IsString() @IsNotEmpty() developer: string;
}
