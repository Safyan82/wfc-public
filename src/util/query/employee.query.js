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


export const getSingleEmployeeRecord = gql `
query($id: String!){
  singleEmployee(_id: $id) {
    response
  }
}
`;

export const getEmployeePropHistoryQuery = gql `
query($input: EmployeePropertyHistoryInput!){
  getEmployeePropHistory(input: $input) {
    response
  }
}
`;

export const getAllEmployeePropHistoryQuery = gql `
query($employeeId: String!){
  getEmployeeAllPropHistory(employeeId: $employeeId) {
    response
  }
}
`;