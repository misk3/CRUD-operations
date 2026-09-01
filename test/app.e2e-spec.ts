import { ValidationPipe } from '@nestjs/common';
import type { INestApplication } from '@nestjs/common';
import { afterAll, beforeAll, describe, it, jest } from '@jest/globals';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { EmployeeController } from '../src/employee/employee.controller.js';
import { EmployeeService } from '../src/employee/employee.service.js';

describe('Employee API validation (e2e)', () => {
  let app: INestApplication;

  const employeeService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
    restore: jest.fn(),
  };

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [EmployeeController],
      providers: [{ provide: EmployeeService, useValue: employeeService }],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('rejects unknown request properties', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/employees')
      .send({
        firstName: 'Ana',
        lastName: 'Jovanović',
        email: 'ana.jovanovic@example.com',
        jobTitle: 'Backend Engineer',
        department: 'Engineering',
        dateOfEmployment: '2024-03-15',
        unexpected: true,
      })
      .expect(400);
  });

  it('rejects malformed employee ids', async () => {
    await request(app.getHttpServer())
      .get('/api/v1/employees/not-an-object-id')
      .expect(400);
  });
});
