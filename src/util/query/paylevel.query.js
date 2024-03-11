import { gql } from "@apollo/client";

export const getPayLevelQuery = gql`
query{
    getPayLevel {
      response
      message
    }
}
`;