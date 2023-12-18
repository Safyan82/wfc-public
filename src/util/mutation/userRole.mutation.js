import { gql } from "@apollo/client";

export const createUserRoleMutation = gql `
    mutation($input: userRoleInput!){
        newUserRole(input: $input) {
        success
        }
    }
`;