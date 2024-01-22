import { gql } from "@apollo/client";

export const UserRoleQuery = gql `
query{
    userRoleList {
      response
    }
}
`;

export const userRoleByIdQuery = gql`
query($userRoleByIdId: String!){
  userRoleById(id: $userRoleByIdId) {
    response
  }
}
`;