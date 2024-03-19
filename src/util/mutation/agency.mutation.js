import { gql } from "@apollo/client";

export const bulkCreateAgencyObjectMutation = gql`
mutation($input: BulkAgencyObjectInput!){
    bulkCreateAgencyObject(input: $input) {
      response
    }
}
`;


export const bulkDeleteAgencyObjectMutation = gql `
mutation($input: DeleteAgencyObjectInput!){
    bulkDeleteAgencyObject(input: $input) {
      response
    }
}
`;

export const bulkUpdateAgencyObjectOrderMutation = gql`
mutation($input: BulkAgencyObjectInput!){
    bulkUpdateAgencyObjectOrder(input: $input) {
      response
    }
}
`;

// --------------------- Agency Mutation

export const UpdateBulkAgency = gql `
mutation($input: AgencyUpdateInput!){
  updateBulkAgency(input: $input) {
    response
  }
}
`;