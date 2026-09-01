import { Test, TestingModule } from '@nestjs/testing';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';
import { EmployeeQueryDto } from './dto/employee-query.dto.js';
import { EmployeeController } from './employee.controller.js';
import { EmployeeService } from './employee.service.js';

describe('EmployeeController', () => {
  let controller: EmployeeController;

  const employeeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [{ provide: EmployeeService, useValue: employeeService }],
    }).compile();

    controller = module.get(EmployeeController);
  });

  it('delegates list queries to the service', async () => {
    const query = new EmployeeQueryDto();
    const result = {
      items: [],
      meta: { page: 1, limit: 10, totalItems: 0, totalPages: 0 },
    };
    employeeService.findAll.mockResolvedValue(result);

    await expect(controller.findAll(query)).resolves.toEqual(result);
    expect(employeeService.findAll).toHaveBeenCalledWith(query);
  });

  it('returns no content after soft deletion', async () => {
    employeeService.remove.mockResolvedValue(undefined);

    await expect(
      controller.remove('507f1f77bcf86cd799439011'),
    ).resolves.toBeUndefined();
    expect(employeeService.remove).toHaveBeenCalledWith(
      '507f1f77bcf86cd799439011',
    );
  });
});
