import { ConflictException, NotFoundException } from '@nestjs/common';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { Types } from 'mongoose';
import type { Model } from 'mongoose';
import { EmployeeQueryDto, EmployeeStatus } from './dto/employee-query.dto.js';
import { EmployeeService } from './employee.service.js';
import type { EmployeeDocument } from './schemas/employee.schema.js';

const employeeRecord = {
  _id: new Types.ObjectId('507f1f77bcf86cd799439011'),
  firstName: 'Ana',
  lastName: 'Jovanović',
  email: 'ana.jovanovic@example.com',
  phone: '+381641234567',
  jobTitle: 'Backend Engineer',
  department: 'Engineering',
  city: 'Novi Sad',
  dateOfEmployment: new Date('2024-03-15'),
  isActive: true,
  createdAt: new Date('2024-03-15'),
  updatedAt: new Date('2024-03-15'),
};

function leanQuery<T>(value: T) {
  return {
    lean: jest.fn().mockReturnValue({
      exec: jest.fn().mockResolvedValue(value),
    }),
  };
}

describe('EmployeeService', () => {
  let service: EmployeeService;
  let model: Record<string, jest.Mock>;

  beforeEach(() => {
    model = {
      create: jest.fn(),
      find: jest.fn(),
      countDocuments: jest.fn(),
      findById: jest.fn(),
      findByIdAndUpdate: jest.fn(),
      findOneAndUpdate: jest.fn(),
    };
    service = new EmployeeService(model as unknown as Model<EmployeeDocument>);
  });

  it('creates an employee and maps the database id', async () => {
    model.create.mockResolvedValue({
      toObject: () => employeeRecord,
    });

    const result = await service.create({
      firstName: 'Ana',
      lastName: 'Jovanović',
      email: 'ana.jovanovic@example.com',
      phone: '+381641234567',
      jobTitle: 'Backend Engineer',
      department: 'Engineering',
      city: 'Novi Sad',
      dateOfEmployment: '2024-03-15',
    });

    expect(result.id).toBe('507f1f77bcf86cd799439011');
    expect(model.create).toHaveBeenCalledWith(
      expect.objectContaining({
        email: 'ana.jovanovic@example.com',
        dateOfEmployment: new Date('2024-03-15'),
      }),
    );
  });

  it('returns a conflict for a duplicate email', async () => {
    model.create.mockRejectedValue({ code: 11000 });

    await expect(
      service.create({
        firstName: 'Ana',
        lastName: 'Jovanović',
        email: 'ana.jovanovic@example.com',
        jobTitle: 'Backend Engineer',
        department: 'Engineering',
        dateOfEmployment: '2024-03-15',
      }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('returns a paginated list of active employees', async () => {
    const query = Object.assign(new EmployeeQueryDto(), {
      status: EmployeeStatus.ACTIVE,
    });
    const exec = jest.fn().mockResolvedValue([employeeRecord]);
    const limit = jest.fn().mockReturnValue({ lean: () => ({ exec }) });
    const skip = jest.fn().mockReturnValue({ limit });
    const sort = jest.fn().mockReturnValue({ skip });
    model.find.mockReturnValue({ sort });
    model.countDocuments.mockReturnValue({
      exec: jest.fn().mockResolvedValue(1),
    });

    const result = await service.findAll(query);

    expect(result.items).toHaveLength(1);
    expect(result.meta).toEqual({
      page: 1,
      limit: 10,
      totalItems: 1,
      totalPages: 1,
    });
    expect(model.find).toHaveBeenCalledWith({ isActive: true });
  });

  it('throws when an employee cannot be found', async () => {
    model.findById.mockReturnValue(leanQuery(null));

    await expect(
      service.findOne('507f1f77bcf86cd799439011'),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('soft-deletes an active employee', async () => {
    model.findOneAndUpdate.mockReturnValue(leanQuery(employeeRecord));

    await expect(
      service.remove('507f1f77bcf86cd799439011'),
    ).resolves.toBeUndefined();
    expect(model.findOneAndUpdate).toHaveBeenCalledWith(
      { _id: '507f1f77bcf86cd799439011', isActive: true },
      { isActive: false },
      { new: true },
    );
  });
});
