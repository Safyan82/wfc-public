import { gql } from "@apollo/client";

export const UpsertPayTableMutation = gql `
mutation($input: PayTableInput!){
    upsertPayTable(input: $input) {
      response
      message
    }
}
`;