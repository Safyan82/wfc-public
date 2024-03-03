import { gql } from "@apollo/client";

export const getNote = gql `
query($objectType: String!, $createdFor: String!){
  getNote(objectType: $objectType, createdFor: $createdFor) {
    message
    response
  }
}
`;