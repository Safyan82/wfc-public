import { gql } from "@apollo/client";

export const EmployeeObjectQuery = gql `
query{
    getEmployeeObject {
      response
    }
}
`;


export const GetEmployeeRecord = gql `
query($input: EmployeeFilter!){
  getEmployee(input: $input) {
    response
  }
}`;