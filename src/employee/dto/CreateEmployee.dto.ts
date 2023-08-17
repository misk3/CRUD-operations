import { IsEmail, IsOptional, IsString, IsNotEmpty } from "class-validator";

export class CreateEmployeeDto {
    @IsString({ message: 'The employee should have name'})
    name: string;
    @IsEmail()
    email: string;
    @IsString()
    phone: string;
    @IsNotEmpty({ message: 'The homeAddress should have home address'})
    homeAddress: string;
    @IsNotEmpty({ message: 'The city should have city name'})
    city: string;
    @IsString()
    zipCode: string;
    @IsNotEmpty({ message: 'The addressLine1 should have address Line'})
    addressLine1: string;
    @IsOptional()
    addressLine2?: string;
    
    dateOfEmployment: Date;
    
    dateOfBirth: Date; 
}