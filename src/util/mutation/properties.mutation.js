import { gql } from '@apollo/client';

export const CREATE_PROPERTIES = gql`
    mutation($input: PropertiesInput!){
        createProperty(input: $input) {
            success
            message
        }
    }
`;

export const UPDATE_PROPERTY = gql`
    mutation($input: PropertiesInput!){
        updateProperty(input: $input) {
            success
            message
        }
    }
`;

export const ARCHIVE_PROPERTY = gql`
    mutation($input: ArchivePropertyInput!){
        archiveProperty(input: $input) {
            success
            message
        }
    }
`;

export const UN_ARCHIVE_PROPERTY = gql`
    mutation($input: ArchivePropertyInput!){
        unarchiveProperty(input: $input) {
            success
            message
        }
    }
`;

export const DELETE_PROPERTY = gql`
    mutation($input: ArchivePropertyInput!){
        deleteProperty(input: $input) {
            success
            message
        }
    }
`;

