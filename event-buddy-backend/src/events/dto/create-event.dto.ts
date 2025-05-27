import { IsString, IsDateString, IsInt, Min } from 'class-validator';

export class CreateEventDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsDateString()
  date: string;

  @IsInt()
  @Min(1)
  totalSeats: number;
}
