import { gql } from '@apollo/client';

export const CREATE_BRACNH = gql`
  mutation createBranch($input: createBranchInput!) {
    createBranch(input: $input) {
      _id
      branchName
      postCode
      metadata
    }
  }
`;