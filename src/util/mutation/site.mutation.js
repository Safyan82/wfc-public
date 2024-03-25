import { gql } from "@apollo/client";

export const AddSiteMutation = gql `
mutation($input: createSiteInput!){
    createSite(input: $input) {
      response
      message
    }
}
`;

export const UpdateBulkSiteMutation = gql `
mutation($input: BulkSiteUpdateInput!){
    updateBulkSite(input: $input) {
      response
      message
    }
}
`;