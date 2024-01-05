import { gql } from "@apollo/client";

export const GetAllUserQuery = gql `
query{
    getAllUser {
      response
    }
}
`;

export const isLoginCheckQuery = gql `
query{
  IsLogin {
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