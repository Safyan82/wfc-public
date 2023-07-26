import { gql } from '@apollo/client';

export const CREATE_BRACNH = gql`
  mutation createBranch($input: createBranchInput!) {
    createBranch(input: $input) {
      success
      response
      message
    }
  }
`;

export const BulkBranchObjectMutation = gql`
mutation($input: BulkBranchObjectInput!){
  createBranchObject(input: $input) {
    response
  }
}`;

export const BulkDeleteBranchObjectMutation = gql`
mutation($input: DeleteBranchObjectInput!){
  deleteBranchObject(input: $input) {
    response
  }
}
`;