import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { Document } from 'mongoose';

@Schema()
export class Employee extends Document {
    
 @ApiProperty({
    description: 'The name of user',
    example: 'Pera Peric',
  })
  @Prop({ required: true })
  name: string;

  @ApiProperty({
    description: 'The email addres of user',
    example: 'peraperic@gmail.com',
})
  @Prop({ required: true, unique: true })
  email: string;

  @ApiProperty({
    description: 'The phone number of user',
    example: '123456789',
})
  @Prop({ required: true })
  phone: string;

  @ApiProperty({
    description: 'The home addres of user',
    example: 'Nikole Tesle',
})
  @Prop({ required: true })
  homeAddress: string;

  @ApiProperty({
    description: 'The city of user',
    example: 'Beograd',
})
  @Prop({ required: true })
  city: string;

  @ApiProperty({
    description: 'The zip code of user',
    example: '11000',
})
  @Prop({ required: true })
  zipCode: string;

  @ApiProperty({
    description: 'The addres line1 of user',
    example: 'Zlatne grede',
})
  @Prop({ required: true })
  addressLine1: string;

  @ApiProperty({
    description: 'The addres line2 of user',
    example: 'Strazilovska',
})
  @Prop({ required: false })
  addressLine2: string;

  @ApiProperty({
    description: 'The date of employemet of user',
    example: '2023-10-1',
})
  @Prop({ required: true })
  dateOfEmployment: Date;

  @ApiProperty({
    description: 'The date of birth of user',
    example: '1991-8-25',
})
  @Prop({ required: true })
  dateOfBirth: Date;

  @Prop({ default: true })
  isActive: boolean;
}

export const EmployeeSchema = SchemaFactory.createForClass(Employee);
