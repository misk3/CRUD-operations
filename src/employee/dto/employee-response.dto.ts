import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class EmployeeResponseDto {
  @ApiProperty({ example: '66d4b71aaee2b20686f9e8a1' })
  id!: string;

  @ApiProperty({ example: 'Ana' })
  firstName!: string;

  @ApiProperty({ example: 'Jovanović' })
  lastName!: string;

  @ApiProperty({ example: 'ana.jovanovic@example.com' })
  email!: string;

  @ApiPropertyOptional({ example: '+381641234567' })
  phone?: string;

  @ApiProperty({ example: 'Backend Engineer' })
  jobTitle!: string;

  @ApiProperty({ example: 'Engineering' })
  department!: string;

  @ApiPropertyOptional({ example: 'Novi Sad' })
  city?: string;

  @ApiProperty({ example: '2024-03-15T00:00:00.000Z' })
  dateOfEmployment!: Date;

  @ApiProperty({ example: true })
  isActive!: boolean;

  @ApiProperty()
  createdAt!: Date;

  @ApiProperty()
  updatedAt!: Date;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 1 })
  page!: number;

  @ApiProperty({ example: 10 })
  limit!: number;

  @ApiProperty({ example: 42 })
  totalItems!: number;

  @ApiProperty({ example: 5 })
  totalPages!: number;
}

export class PaginatedEmployeesResponseDto {
  @ApiProperty({ type: [EmployeeResponseDto] })
  items!: EmployeeResponseDto[];

  @ApiProperty({ type: PaginationMetaDto })
  meta!: PaginationMetaDto;
}
