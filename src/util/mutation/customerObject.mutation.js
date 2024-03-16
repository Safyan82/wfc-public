import gql from "graphql-tag";

export const BulkCustomerObjectCreationMutation = gql `
mutation($input: BulkCustomerObjectInput!){
    bulkCreateCustomerObject(input: $input) {
      response
    }
}
`;

export const bulkUpdateCustomerObjectOrderMutation = gql `
mutation($input: BulkCustomerObjectInput!){
    bulkUpdateCustomerObjectOrder(input: $input) {
      response
    }
}
`;


export const BulkDeleteCustomerObjectMutation = gql `
mutation($input: DeleteCustomerObjectInput!){
    bulkDeleteCustomerObject(input: $input) {
      response
    }
}
`;