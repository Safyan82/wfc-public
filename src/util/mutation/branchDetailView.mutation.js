import { gql } from "@apollo/client";

export const AddBranchDetailViewMutation = gql`mutation($input: BranchDetailViewInput!){
    addBranchDetailView(input: $input) {
      success
      message
    }
}`