import { gql } from '@apollo/client';

export const CREATE_GROUP = gql`
    mutation($input: GroupInput!){
        createGroup(input: $input) {
            success
            message
        }
    }
`;

