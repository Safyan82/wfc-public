import gql from "graphql-tag";

export const SiteObjectQuery = gql `
query{
    getSiteObject {
      response
    }
}
`;