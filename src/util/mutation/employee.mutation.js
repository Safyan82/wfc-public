import { gql } from "@apollo/client";

export const AddEmployeeMutation = gql `
mutation($input: EmployeeInput!){
    addEmployee(input: $input) {
      response
      message
    }
}
`;

export const updateEmployeeMutation = gql `
mutation($input: EmployeeUpdateInput!){
  updateEmployee(input: $input) {
    response
  }
}
`;