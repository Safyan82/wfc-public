import { gql } from "@apollo/client";

export const getUserEmployeeDetailView = gql `
query($createdFor: String!, $createdBy: String!){
    getUserEmployeeDetailView(createdFor: $createdFor, createdBy: $createdBy) {
      response
    }
}
`;