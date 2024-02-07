import { gql } from "@apollo/client";

export const deleteUserMutation = gql `
mutation($deleteUserId: String!){
    deleteUser(id: $deleteUserId) {
      success
      message
    }
}
`;