import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Employee } from '../db/entities/EmployeeEntity';
import { Query as ExpressQuery } from 'express-serve-static-core';
import { CreateEmployeeDto } from './dto/CreateEmployee.dto';
import { UpdateEmployeeDto } from './dto/UpdateEmployee.dto';
@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name) private employeeModel: Model<Employee>,
  ) {}

  async create(employee: CreateEmployeeDto) {
    const createdEmployee = new this.employeeModel(employee);
    return createdEmployee.save();
  }

  async findOne(id: string) {
    const employee = await this.employeeModel.findById(id).exec();
    if (!employee) {
      console.log('Employee not found')
      return
    }
    return {   
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      homeAddress: employee.homeAddress,
      city: employee.city,
      zipCode: employee.zipCode,
      addressLine1: employee.addressLine1,
      addressLine2: employee.addressLine2,
      dateOfEmployment: employee.dateOfEmployment,
      dateOfBirth: employee.dateOfBirth,
      isActive: employee.isActive 
    }
  }

  async update(id: string, employee: UpdateEmployeeDto) {
    return this.employeeModel
      .findByIdAndUpdate(id, employee, { new: true })
      .exec();
  }


  async delete(id: string) {
    return this.employeeModel.findByIdAndUpdate(id, { isActive: false }, { new: true }).exec();
  }

  async findActiveEmployees(query: ExpressQuery) {
    const resPerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);

    const employees = await this.employeeModel.find({ isActive: true }).limit(resPerPage).skip(skip).exec();
    if (employees.length > 0 ) {
      return employees.map( (employee) => {
        return {   
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          homeAddress: employee.homeAddress,
          city: employee.city,
          zipCode: employee.zipCode,
          addressLine1: employee.addressLine1,
          addressLine2: employee.addressLine2,
          dateOfEmployment: employee.dateOfEmployment,
          dateOfBirth: employee.dateOfBirth,
          isActive: employee.isActive 
        }
      }
    )
  }
  return []
  }

  async findDeletedEmployees(query: ExpressQuery) {
    const resPerPage = 10;
    const currentPage = Number(query.page) || 1;
    const skip = resPerPage * (currentPage - 1);
    
    const employees = await this.employeeModel.find({ isActive: false }).limit(resPerPage).skip(skip).exec();
    if (employees.length > 0 ) {
      return employees.map( (employee) => {
        return {   
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          homeAddress: employee.homeAddress,
          city: employee.city,
          zipCode: employee.zipCode,
          addressLine1: employee.addressLine1,
          addressLine2: employee.addressLine2,
          dateOfEmployment: employee.dateOfEmployment,
          dateOfBirth: employee.dateOfBirth,
          isActive: employee.isActive 
        }
      }
    )
  }
  return []
}
}