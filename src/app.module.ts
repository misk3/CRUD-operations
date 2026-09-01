import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forRoot(process.env.MONGODB_URI ?? '',),
    EmployeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}