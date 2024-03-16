import { gql } from "@apollo/client";

export const upsertCustomerPayTableMutation = gql `
mutation($input: PayTableInput!){
    upsertCustomerPayTable(input: $input) {
      response
      message
    }
}
`;