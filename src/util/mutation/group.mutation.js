import { gql } from '@apollo/client';

export const CREATE_GROUP = gql`
    mutation($input: GroupInput!){
        createGroup(input: $input) {
            success
            message
        }
    }
`;

export const UPDATE_GROUP = gql`
    mutation($input: GroupInput!){
        updateGroup(input: $input) {
            success
            message
        }
    }
`;

export const DELETE_GROUP = gql`
    mutation($deleteGroupId: String!){
        deleteGroup(id: $deleteGroupId) {
            success
            message
        }
    }

`;
