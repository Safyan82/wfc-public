import { gql } from "@apollo/client";

export const selectedSearchMutation = gql `
mutation($input: SelectedSearchInput!){
    newSelectedSearch(input: $input) {
      _id
    }
}`;