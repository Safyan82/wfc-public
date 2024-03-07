import gql from "graphql-tag";

export const BulkSiteObjectCreationMutation = gql `
mutation($input: BulkSiteObjectInput!){
    bulkCreateSiteObject(input: $input) {
      response
    }
  }
`;

export const bulkUpdateSiteObjectOrderMutation = gql `
mutation($input: BulkSiteObjectInput!){
  bulkUpdateSiteObjectOrder(input: $input) {
    response
  }
}
`;


export const BulkDeleteSiteObjectMutation = gql `
mutation($input: DeleteSiteObjectInput!){
  bulkDeleteSiteObject(input: $input) {
    response
  }
}
`;

