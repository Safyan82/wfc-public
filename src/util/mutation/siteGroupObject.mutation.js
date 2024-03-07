import gql from "graphql-tag";

export const BulkSiteGroupObjectCreationMutation = gql `
mutation($input: BulkSiteGroupObjectInput!){
    bulkCreateSiteGroupObject(input: $input) {
      response
    }
}
`;

export const bulkUpdateSiteGroupObjectOrderMutation = gql `
mutation($input: BulkSiteGroupObjectInput!){
  bulkUpdateSiteGroupObjectOrder(input: $input) {
    response
  }
}
`;


export const BulkDeleteSiteGroupObjectMutation = gql `
mutation($input: DeleteSiteGroupObjectInput!){
  bulkDeleteSiteGroupObject(input: $input) {
    response
  }
}
`;

