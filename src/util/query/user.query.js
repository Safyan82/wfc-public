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