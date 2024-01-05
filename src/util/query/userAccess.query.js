import { gql } from "@apollo/client";

export const UserAccessLogQuery = gql `
query{
    getUsersAccessLog {
      location
      ip
      userId
      employee
      accessedAt
    }
}
`;