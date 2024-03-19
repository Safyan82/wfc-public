import { gql } from "@apollo/client";

export const getCustomerPayTableQuery = gql `
query($customerId: String!){
  getCustomerPayTable(customerId: $customerId) {
    response
  }
}
`;