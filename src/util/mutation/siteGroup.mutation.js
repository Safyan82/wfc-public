import gql from "graphql-tag";

export const AddSiteGroupMutation = gql `
mutation($input: createSiteGroupInput!){
    createSiteGroup(input: $input) {
      response
    }
  }
`;
