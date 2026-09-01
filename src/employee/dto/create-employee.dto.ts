import { Transform } from 'class-transformer';
import {
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
  Length,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

const trim = ({ value }: { value: unknown }) =>
  typeof value === 'string' ? value.trim() : value;

export class CreateEmployeeDto {
  @ApiProperty({ example: 'Ana' })
  @Transform(trim)
  @IsString()
  @Length(2, 50)
  firstName!: string;

  @ApiProperty({ example: 'Jovanović' })
  @Transform(trim)
  @IsString()
  @Length(2, 50)
  lastName!: string;

  @ApiProperty({ example: 'ana.jovanovic@example.com' })
  @Transform(({ value }: { value: unknown }) =>
    typeof value === 'string' ? value.trim().toLowerCase() : value,
  )
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: '+381641234567' })
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(30)
  phone?: string;

  @ApiProperty({ example: 'Backend Engineer' })
  @Transform(trim)
  @IsString()
  @Length(2, 100)
  jobTitle!: string;

  @ApiProperty({ example: 'Engineering' })
  @Transform(trim)
  @IsString()
  @Length(2, 100)
  department!: string;

  @ApiPropertyOptional({ example: 'Novi Sad' })
  @Transform(trim)
  @IsOptional()
  @IsString()
  @MaxLength(100)
  city?: string;

  @ApiProperty({ example: '2024-03-15' })
  @IsDateString()
  dateOfEmployment!: string;
}
