import { gql } from "@apollo/client";

export const UpdateEmployeeViewMutation = gql `
mutation($input: EmployeeViewInput!){
    updateEmployeeView(input: $input) {
      response
    }
}
`;


export const newEmployeeViewMutation = gql `
mutation($input: EmployeeViewInput!){
    newEmployeeView(input: $input) {
      response
    }
}
`;