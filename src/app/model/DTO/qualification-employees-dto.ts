import { Employee } from '../Employee';
import { Qualification } from '../Qualification';

export interface QualificationEmployeesDTO {
  qualification: Qualification;
  employees: Employee[];
}

