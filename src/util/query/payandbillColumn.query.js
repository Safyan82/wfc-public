import { gql } from "@apollo/client";

export const getPayandBillColumnQuery = gql`
query{
    getPayandBillColumn {
      message
      response
    }
}
`;
