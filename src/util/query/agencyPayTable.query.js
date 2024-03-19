import { gql } from "@apollo/client";

export const getAgencyPayTableQuery = gql `
query($agencyId: String!){
    getAgencyPayTable(agencyId: $agencyId) {
      response
    }
}
`;