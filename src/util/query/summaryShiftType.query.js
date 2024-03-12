import { gql } from "@apollo/client";

export const getSummaryShiftTypeQuery = gql `
query{
    getSummaryShiftType {
      message
      response
    }
}
`;