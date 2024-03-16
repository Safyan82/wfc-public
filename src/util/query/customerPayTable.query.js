import { gql } from "@apollo/client";

export const getCustomerPayTableQuery = gql `
query{
    getCustomerPayTable {
      response
      message
    }
}
`;