import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import type { HydratedDocument } from 'mongoose';

export type EmployeeDocument = HydratedDocument<Employee>;

@Schema({ timestamps: true, versionKey: false })
export class Employee {
  @Prop({ required: true, trim: true, minlength: 2, maxlength: 50 })
  firstName!: string;

  @Prop({ required: true, trim: true, minlength: 2, maxlength: 50 })
  lastName!: string;

  @Prop({
    required: true,
    unique: true,
    index: true,
    trim: true,
    lowercase: true,
  })
  email!: string;

  @Prop({ trim: true, maxlength: 30 })
  phone?: string;

  @Prop({ required: true, trim: true, maxlength: 100 })
  jobTitle!: string;

  @Prop({ required: true, trim: true, index: true, maxlength: 100 })
  department!: string;

  @Prop({ trim: true, maxlength: 100 })
  city?: string;

  @Prop({ required: true })
  dateOfEmployment!: Date;

  @Prop({ default: true, index: true })
  isActive!: boolean;

  createdAt!: Date;
  updatedAt!: Date;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);

EmployeeSchema.index({ lastName: 1, firstName: 1 });
EmployeeSchema.index({ department: 1, isActive: 1 });
