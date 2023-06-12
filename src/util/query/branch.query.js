import {gql} from "@apollo/client";

export const GET_BRANCHES = gql`
    query{
        branches {
            branchName
            postCode
            metadata
        }
    }
`;