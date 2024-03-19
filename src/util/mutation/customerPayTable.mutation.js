import { gql } from "@apollo/client";

export const upsertCustomerPayTableMutation = gql `
mutation($input: CustomerPayTableInput!){
    upsertCustomerPayTable(input: $input) {
      response
      message
    }
}
`;