import {gql} from "@apollo/client";

export const GET_BRANCHES = gql`
query($input: BranchFilter!){
    branches(input: $input) {
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