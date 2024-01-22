import { gql } from "@apollo/client";

export const UserAccessLogQuery = gql `
query{
    getUsersAccessLog {
      _id
      location
      ip
      userId
      employee
      accessedAt
      platform
      isActive
    }
}
`;

export const UserAccessLogByEmployeeIdQuery = gql `
query($employeeId: String!){
  getUsersAccessLogByEmpId(employeeId: $employeeId) {
      _id
      location
      ip
      userId
      employee
      accessedAt
      platform
      isActive
    }
}
`;