import { gql } from "@apollo/client";

export const SearchMutation = gql`
mutation($input: SearchInput!){
    QueryResult(input: $input) {
      response
      message
    }
}
`;