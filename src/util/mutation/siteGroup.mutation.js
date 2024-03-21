import gql from "graphql-tag";

export const AddSiteGroupMutation = gql `
mutation($input: createSiteGroupInput!){
    createSiteGroup(input: $input) {
      response
    }
  }
`;

export const UpdateBulkSiteGroupMutation = gql`
mutation($input: BulkSiteGroupUpdateInput!){
  updateBulkSiteGroup(input: $input) {
    response
    message
  }
}
`;

export const UpdateSiteGroupMutation = gql `
mutation($input: SiteGroupUpdateInput!){
  updateSiteGroup(input: $input) {
    response
    message
  }
}
`;

export const UpsertSiteGroupPayTableMutation = gql `
mutation($input: SiteGroupPayTableInput!){
  upsertSiteGroupPayTable(input: $input) {
    response
    message
  }
}
`;