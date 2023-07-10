import {gql} from "@apollo/client";

export const PROPERTYLIST = gql`
    query{
        propertyList {
            options
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

export const GetProptyById = gql`
    query($getPropertyById: String!){
        getPropertyById(id: $getPropertyById) {
            _id
            options
            key
            objectType
            label
            fieldType
            useIn
            groupName
            createdAt
            description
            groupId
            rules
        } 
    }
`;


export const GetProptyByGroupId = gql`
    query($groupId: String!){
        getPropertyByGroupId(groupId: $groupId) {
            _id
            options
            key
            objectType
            label
            fieldType
            useIn
            groupName
            createdAt
            description
            groupId
            rules
        } 
    }
`;