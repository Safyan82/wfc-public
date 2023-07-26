import {gql} from "@apollo/client";

export const GET_BRANCHES = gql`
    query{
        branches {
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