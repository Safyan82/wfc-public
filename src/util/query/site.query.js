import gql from "graphql-tag";

export const SiteObjectQuery = gql `
query{
    getSiteObject {
      response
    }
}
`;

export const getSitesQuery = gql `
query($input: SiteGroupFilter!){
  sites(input: $input) {
    _id
    sitename
    sitegroupId
    contractstartdate
    postcode
    metadata
  }
}
`;

export const getSiteQuery = gql `
query($id: String!){
  site(_id: $id) {
    response
  }
}
`;