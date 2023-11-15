import { gql } from "@apollo/client";

export const EmployeeObjectQuery = gql `
query{
    getEmployeeObject {
      response
    }
}
`;


export const GetEmployeeRecord = gql `
query{
  getEmployee {
    response
  }
}`;