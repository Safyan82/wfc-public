import { gql } from "@apollo/client";

export const AddEmployeeMutation = gql `
mutation($input: EmployeeInput!){
    addEmployee(input: $input) {
      response
      message
    }
}
`;