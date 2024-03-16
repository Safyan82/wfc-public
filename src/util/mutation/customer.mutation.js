import gql from "graphql-tag";

export const AddCustomerMutation = gql `
mutation($input: CustomerInput!){
    createCustomer(input: $input) {
      response
      message
    }
}
`;

export const UpdateBulkCustomerMutation = gql`
mutation($input: CustomerUpdateInput!){
    updateBulkCustomer(input: $input) {
      response
      message
    }
}
`;