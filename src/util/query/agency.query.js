import { gql } from "@apollo/client";

export const AgencyObjectQuery = gql `
query{
    getAgencyObject {
      response
    }
}
`;

export const getAgencies = gql `
query($input: AgencyFilter!){
  agencies(input: $input) {
    _id
    agencyname
    metadata
    createdAt
    createdBy
  }
}
`;


export const getSingleAgency = gql `
query($id: String!){
  agency(_id: $id) {
    _id
    agencyname
    metadata
  }
}
`;

// ----------------------------------------------------------------------

export const createAgencyMutation = gql `
mutation($input: AgencyInput!){
  createAgency(input: $input) {
    response
  }
}
`;

