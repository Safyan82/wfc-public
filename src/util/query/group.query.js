import {gql} from "@apollo/client";

export const GROUPLIST = gql`
query($objectType: String!){
    groupList(objectType: $objectType) {
            key
            name
            properties
            tabs
            propertyList
        }
}
`;