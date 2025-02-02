import { Employee } from '../Employee';
import { Qualification } from '../Qualification';

export interface EmployeeQualitificationsDTO {
  id: number;
  lastname: string;
  firstname: string;
  skillSet: Qualification[];
}


