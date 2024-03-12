import { gql } from "@apollo/client";

export const shiftTypeQuery = gql`
query{
    getShiftType {
      message
      response
    }
}
`;