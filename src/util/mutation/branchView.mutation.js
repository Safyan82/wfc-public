import {gql} from "@apollo/client";

export const createBranchViewMutation = gql`
mutation($input: BranchViewInput!){
    createBranchView(input: $input) {
      success
      message
    }
}`;


export const updateBranchView = gql`
mutation($input: BranchViewInput!){
  updateBranchView(input: $input) {
    success
  }
}
`;