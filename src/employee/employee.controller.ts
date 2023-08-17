import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  HttpCode,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { Employee } from '../db/entities/EmployeeEntity';
import { EmployeeService } from './employee.service';

import { Query as ExpressQuery } from 'express-serve-static-core';
import { ApiBadRequestResponse, ApiCreatedResponse } from '@nestjs/swagger';
import { CreateEmployeeDto } from './dto/CreateEmployee.dto';
import { UpdateEmployeeDto } from './dto/UpdateEmployee.dto';
import { EmployeesResponseDto } from './dto/EmployeeResponse.dto';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  @HttpCode(201)
  @UsePipes(ValidationPipe)
  @ApiCreatedResponse({
    description: 'User created successfully',
    type: Employee,
  })
  @ApiBadRequestResponse({
    description: 'User cannot be created. Try again!'
  })
  async create(@Body() employee: CreateEmployeeDto) {
    await this.employeeService.create(employee);
  }

  
  @Get()
  findAll(@Query() query: ExpressQuery): Promise<EmployeesResponseDto[]> {
    return this.employeeService.findActiveEmployees(query);
  }

  @Get('deleted')
  findDeletedEmloyees(@Query() query: ExpressQuery): Promise<EmployeesResponseDto[]> {
    return this.employeeService.findDeletedEmployees(query);
  }

  @Get(':id')
  findeOne(@Param('id') id: string): Promise<EmployeesResponseDto> {
    return this.employeeService.findOne(id);
  }

  @Put(':id')
  @ApiCreatedResponse({
    description: 'User updated successfully'
  })
  @ApiBadRequestResponse({
    description: 'User cannot be updated. Try again!'
  })
  async update(@Param('id') id: string, @Body() employee: UpdateEmployeeDto): Promise<any> {
    await this.employeeService.update(id, employee);
  }

  @Delete(':id')
  @ApiCreatedResponse({
    description: 'User deleted successfully',
    })
  @ApiBadRequestResponse({
    description: 'User cannot be deleted. Try again!'
  })
  async delete(@Param('id') id: string) {
    await this.employeeService.delete(id);
  }


}
