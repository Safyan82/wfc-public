import { gql } from "@apollo/client";

export const createUserRoleMutation = gql `
    mutation($input: userRoleInput!){
        newUserRole(input: $input) {
        success
        }
    }
`;

export const updateUserRoleMutation = gql `
mutation($input: userRoleInput!){
    updateUserRole(input: $input) {
      response
      message
    }
}
`;