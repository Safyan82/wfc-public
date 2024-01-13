import { gql } from "@apollo/client";

export const GetAllUserQuery = gql `
query{
    getAllUser {
      response
    }
}
`;

export const isLoginCheckQuery = gql `
query($deviceId: String!){
  IsLogin(deviceId: $deviceId) {
    isLogin
  }
}
`;


export const GetUserByEmpIdQuery = gql `
query($employeeId: String!){
  getUserByEmpId(employeeId: $employeeId) {
    response
  }
}
`;