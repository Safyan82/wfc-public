import { gql } from "@apollo/client";

export const upsertAgencyPayTableMutation = gql `
mutation($input: AgencyPayTableInput!){
    upsertAgencyPayTable(input: $input) {
      response
    }
}
`;