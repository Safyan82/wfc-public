import {gql} from "@apollo/client";

export const GET_BRANCHES = gql`
query($input: BranchFilter!){
    branches(input: $input) {
        _id
        branchname
        postcode
        metadata
    }
}
`;

export const GetBranchObject = gql`
    query{
        getBranchProperty {
        response
        }
    }
`;

export const getSingleBranch = gql`
query($id: String!){
    branch(_id: $id) {
      branchname
      postcode
      metadata
    }
}
`;