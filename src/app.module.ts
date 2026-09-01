import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EmployeeModule } from './employee/employee.module.js';
import { HealthController } from './health/health.controller.js';

function validateEnvironment(config: Record<string, unknown>) {
  if (typeof config.MONGODB_URI !== 'string' || !config.MONGODB_URI.trim()) {
    throw new Error('MONGODB_URI is required');
  }

  return config;
}

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnvironment,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.getOrThrow<string>('MONGODB_URI'),
      }),
    }),
    EmployeeModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
