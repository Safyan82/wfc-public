import {gql} from "@apollo/client";

export const GROUPLIST = gql`
    query{
        groupList {
            key
            name
            properties
        }
    }
`;