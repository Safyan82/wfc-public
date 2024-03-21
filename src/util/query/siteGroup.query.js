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
      customer 
      branch
      metadata
      createdDate
      updatedDate
    }
}
`;

export const getSiteGroup = gql `
query($id: String!){
  siteGroup(_id: $id) {
    response 
    message
  }
}
`;

export const getSiteGroupPayTableQuery = gql `
query($sitegroupId: String!){
  getSiteGroupPayTable(sitegroupId: $sitegroupId) {
    response
    message
  }
}
`;