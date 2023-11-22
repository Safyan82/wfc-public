import { gql } from "@apollo/client";

export const BulkEmployeeObjectCreationMutation = gql `
mutation($input: BulkEmployeeObjectInput!){
    bulkCreateEmployeeObject(input: $input) {
      response
    }
}
`;


export const BulkDeleteEmployeeObjectMutation = gql `
mutation($input: DeleteEmployeeObjectInput!){
    bulkDeleteEmployeeObject(input: $input) {
      response
    }
}
`;


export const bulkUpdateEmployeeObjectOrderMutation = gql `
mutation($input: BulkEmployeeObjectInput!){
    bulkUpdateEmployeeObjectOrder(input: $input) {
      response
    }
}
`