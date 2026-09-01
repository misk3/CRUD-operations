import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import type { Model, QueryFilter } from 'mongoose';
import { CreateEmployeeDto } from './dto/create-employee.dto.js';
import {
  EmployeeQueryDto,
  EmployeeSortField,
  EmployeeStatus,
  SortOrder,
} from './dto/employee-query.dto.js';
import {
  EmployeeResponseDto,
  PaginatedEmployeesResponseDto,
} from './dto/employee-response.dto.js';
import { UpdateEmployeeDto } from './dto/update-employee.dto.js';
import { Employee } from './schemas/employee.schema.js';
import type { EmployeeDocument } from './schemas/employee.schema.js';

type EmployeeRecord = Employee & {
  _id: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
};

@Injectable()
export class EmployeeService {
  constructor(
    @InjectModel(Employee.name)
    private readonly employeeModel: Model<EmployeeDocument>,
  ) {}

  async create(input: CreateEmployeeDto): Promise<EmployeeResponseDto> {
    try {
      const employee = await this.employeeModel.create({
        ...input,
        dateOfEmployment: new Date(input.dateOfEmployment),
      });

      return this.toResponse(employee.toObject() as EmployeeRecord);
    } catch (error: unknown) {
      this.rethrowDuplicateEmail(error);
      throw error;
    }
  }

  async findAll(
    query: EmployeeQueryDto,
  ): Promise<PaginatedEmployeesResponseDto> {
    const filter: QueryFilter<Employee> = {};

    if (query.status !== EmployeeStatus.ALL) {
      filter.isActive = query.status === EmployeeStatus.ACTIVE;
    }

    if (query.department) {
      filter.department = query.department;
    }

    if (query.search?.trim()) {
      const searchExpression = new RegExp(
        this.escapeRegex(query.search.trim()),
        'i',
      );
      filter.$or = [
        { firstName: searchExpression },
        { lastName: searchExpression },
        { email: searchExpression },
      ];
    }

    const skip = (query.page - 1) * query.limit;
    const sortDirection = query.sortOrder === SortOrder.ASC ? 1 : -1;
    const sort = { [query.sortBy]: sortDirection } as Record<
      EmployeeSortField,
      1 | -1
    >;

    const [employees, totalItems] = await Promise.all([
      this.employeeModel
        .find(filter)
        .sort(sort)
        .skip(skip)
        .limit(query.limit)
        .lean<EmployeeRecord[]>()
        .exec(),
      this.employeeModel.countDocuments(filter).exec(),
    ]);

    return {
      items: employees.map((employee) => this.toResponse(employee)),
      meta: {
        page: query.page,
        limit: query.limit,
        totalItems,
        totalPages: Math.ceil(totalItems / query.limit),
      },
    };
  }

  async findOne(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeModel
      .findById(id)
      .lean<EmployeeRecord>()
      .exec();

    if (!employee) {
      throw new NotFoundException('Employee not found');
    }

    return this.toResponse(employee);
  }

  async update(
    id: string,
    input: UpdateEmployeeDto,
  ): Promise<EmployeeResponseDto> {
    const update = {
      ...input,
      ...(input.dateOfEmployment
        ? { dateOfEmployment: new Date(input.dateOfEmployment) }
        : {}),
    };

    try {
      const employee = await this.employeeModel
        .findByIdAndUpdate(id, update, {
          new: true,
          runValidators: true,
        })
        .lean<EmployeeRecord>()
        .exec();

      if (!employee) {
        throw new NotFoundException('Employee not found');
      }

      return this.toResponse(employee);
    } catch (error: unknown) {
      this.rethrowDuplicateEmail(error);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    const employee = await this.employeeModel
      .findOneAndUpdate(
        { _id: id, isActive: true },
        { isActive: false },
        { new: true },
      )
      .lean<EmployeeRecord>()
      .exec();

    if (!employee) {
      throw new NotFoundException('Active employee not found');
    }
  }

  async restore(id: string): Promise<EmployeeResponseDto> {
    const employee = await this.employeeModel
      .findOneAndUpdate(
        { _id: id, isActive: false },
        { isActive: true },
        { new: true },
      )
      .lean<EmployeeRecord>()
      .exec();

    if (!employee) {
      throw new NotFoundException('Inactive employee not found');
    }

    return this.toResponse(employee);
  }

  private toResponse(employee: EmployeeRecord): EmployeeResponseDto {
    return {
      id: employee._id.toString(),
      firstName: employee.firstName,
      lastName: employee.lastName,
      email: employee.email,
      phone: employee.phone,
      jobTitle: employee.jobTitle,
      department: employee.department,
      city: employee.city,
      dateOfEmployment: employee.dateOfEmployment,
      isActive: employee.isActive,
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
    };
  }

  private rethrowDuplicateEmail(error: unknown): void {
    if (
      typeof error === 'object' &&
      error !== null &&
      'code' in error &&
      error.code === 11000
    ) {
      throw new ConflictException('An employee with this email already exists');
    }
  }

  private escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }
}
