import { gql } from "@apollo/client";

export const UserAccessLogQuery = gql `
query{
    getUsersAccessLog {
      _id
      location
      ip
      userId
      employee
      accessedAt
      platform
      isActive
    }
}
`;