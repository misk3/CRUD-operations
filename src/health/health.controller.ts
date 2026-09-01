import { Controller, Get, ServiceUnavailableException } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { InjectConnection } from '@nestjs/mongoose';
import type { Connection } from 'mongoose';

@ApiTags('health')
@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  @ApiOperation({ summary: 'Check API and database availability' })
  @ApiOkResponse({
    schema: {
      example: {
        status: 'ok',
        database: 'connected',
        timestamp: '2026-08-31T12:00:00.000Z',
      },
    },
  })
  getHealth() {
    if (this.connection.readyState !== 1) {
      throw new ServiceUnavailableException('Database is not connected');
    }

    return {
      status: 'ok',
      database: 'connected',
      timestamp: new Date().toISOString(),
    };
  }
}
