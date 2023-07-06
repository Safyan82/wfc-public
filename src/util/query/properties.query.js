import {gql} from "@apollo/client";

export const PROPERTYLIST = gql`
    query{
        propertyList {
            key
            objectType
            label
            fieldType
            useIn
            groupName
            createdAt
        }
    }
`;

export const ARCHIVE_PROPERTY_LIST = gql`
    query{
        getArchiveProperties {
            key
            objectType
            label
            fieldType
            useIn
            groupName
            createdAt
            archiveTime
            createdBy
            
        }
    }
`;