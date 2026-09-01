import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ParseObjectIdPipe } from '../common/pipes/parse-object-id.pipe.js';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import { EmployeeQueryDto } from './dto/employee-query.dto.js';
import {
  EmployeeResponseDto,
  PaginatedEmployeesResponseDto,
} from './dto/employee-response.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { EmployeeService } from './employee.service.js';

@ApiTags('employees')
@Controller('employees')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @ApiOperation({ summary: 'Create an employee' })
  @ApiCreatedResponse({ type: EmployeeResponseDto })
  @ApiBadRequestResponse({ description: 'Request validation failed' })
  @ApiConflictResponse({
    description: 'An employee with this email already exists',
  })
  create(@Body() input: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    return this.employeeService.create(input);
  }

  @Get()
  @ApiOperation({ summary: 'List, filter, search and sort employees' })
  @ApiOkResponse({ type: PaginatedEmployeesResponseDto })
  findAll(
    @Query() query: EmployeeQueryDto,
  ): Promise<PaginatedEmployeesResponseDto> {
    return this.employeeService.findAll(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get an employee by id' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  @ApiNotFoundResponse({ description: 'Employee was not found' })
  findOne(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<EmployeeResponseDto> {
    return this.employeeService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update an employee' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  @ApiNotFoundResponse({ description: 'Employee was not found' })
  @ApiConflictResponse({
    description: 'An employee with this email already exists',
  })
  update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() input: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    return this.employeeService.update(id, input);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Soft-delete an employee' })
  @ApiNoContentResponse({ description: 'Employee was marked as inactive' })
  @ApiNotFoundResponse({ description: 'Active employee was not found' })
  async remove(@Param('id', ParseObjectIdPipe) id: string): Promise<void> {
    await this.employeeService.remove(id);
  }

  @Post(':id/restore')
  @ApiOperation({ summary: 'Restore a soft-deleted employee' })
  @ApiOkResponse({ type: EmployeeResponseDto })
  @ApiNotFoundResponse({ description: 'Inactive employee was not found' })
  restore(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<EmployeeResponseDto> {
    return this.employeeService.restore(id);
  }
}
