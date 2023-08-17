import { Module } from '@nestjs/common';
import { EmployeeModule } from './employee/employee.module';
import { MongooseModule } from '@nestjs/mongoose';
@Module({
  imports: [
    MongooseModule.forRoot(`mongodb+srv://markomiskeljin09:304hNlMcBCVKTsKE@neotech.e5cqllq.mongodb.net/?retryWrites=true&w=majority`),
    EmployeeModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
