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
      sitegroupname
      metadata
      createdDate
      updatedDate
    }
}
`;

