export class EmployeesResponseDto {
    name: string;
    email: string;
    phone: string;
    homeAddress: string;
    city: string;
    zipCode: string;
    addressLine1: string;
    addressLine2?: string;
    dateOfEmployment: Date;
    dateOfBirth: Date; 
    isActive: boolean;
}