import gql from "graphql-tag";

export const SiteGroupObjectQuery = gql `
query{
    getSiteGroupObject {
      response
    }
}
`;


export const getSiteGroups = gql `
query($input: SiteGroupFilter!){
    sitegroups(input: $input) {
      _id
      sitegroupname
      metadata
      createdDate
      updatedDate
    }
}
`;

export const getSiteGroup = gql `
query($id: String!){
  siteGroup(_id: $id) {
    _id
    sitegroupname
    metadata
  }
}
`;