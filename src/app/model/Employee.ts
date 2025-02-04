import { Qualification } from "./Qualification";

export class Employee {
  constructor(public id: number,
              public lastName?: string,
              public firstName?: string,
              public street?: string,
              public postcode?: string,
              public city?: string,
              public phone?: string,
              public skillSet?: Qualification[]) {
  }
  /**
   * Returns the full name of the employee.
   * @returns {string} The first name, a space, and the last name.
   */
  get fullname(): string {
    return this.firstName + " " + this.lastName;
  }
}
