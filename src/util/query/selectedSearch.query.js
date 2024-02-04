import { gql } from "@apollo/client";

export const selectedSearchQuery = gql `
query($userId: String!){
    getSelectedSearchByUser(userId: $userId) {
      selectedSearchObject
      query
      category
      searchedBy
    }
}
`;