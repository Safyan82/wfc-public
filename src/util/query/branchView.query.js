import { gql } from "@apollo/client";

export const BranchViewQuery = gql `
query{
    branchViews {
      advanceFilter
      _id
      name
      visibility
      quickFilter
      isStandard
      isManual
      viewFields
    }
}
`;


export const SingleBranchViewQuery = gql`
query($id: String!){
  singlebranchView(_id: $id) {
    viewFields
    name
    _id
  }
}
`;


export const BranchViewForSpecificUser = gql`
  query($createdBy: String!, $createdFor: String!){
    getUserBranchView(createdBy: $createdBy, createdFor: $createdFor) {
      success
      response
    }
  }
`;