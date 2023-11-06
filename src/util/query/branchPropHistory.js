import { gql } from "@apollo/client";

export const GetBranchPropertyHistoryDetail = gql `
query($input: BranchPropertyHistoryInput!){
    getBranchPropHistory(input: $input) {
      response
    }
}
`;