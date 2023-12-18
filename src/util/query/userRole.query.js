import { gql } from "@apollo/client";

export const UserRoleQuery = gql `
query{
    userRoleList {
      response
    }
}
`;