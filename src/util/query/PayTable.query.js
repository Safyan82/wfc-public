import { gql } from "@apollo/client";

export const getPayTable = gql `
query{
    getPayTable {
      response
    }
}
`;